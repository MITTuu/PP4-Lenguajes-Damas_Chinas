import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RowHeader from "./RowsHeader";
import ColumnHeader from "./ColumnsHeader";
import Cell from "./Cell";
import "../../assets/Board.css";
import { socketManager } from "../../services/socketManager";
import { getValidMoves, getValidMovesJumping } from './utils/moves';

const Board = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const rows = 17;
  const cols = 25;

  const [positions, setPositions] = useState({});
  const [selectedChip, setSelectedChip] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [turno, setTurno] = useState(null); 
  const [isGameOver, setIsGameOver] = useState(false);

  // Estados para manejar el modal del ganador
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const socket = socketManager.getSocket();

    if (!socketManager.isUserConnected()) {
      socketManager.connect();
    }

    if (socket && socket.connected) {
      socket.emit("getGameState", gameCode, (response) => {
        if (response.success) {
          setPositions(response.game.positions);
          setTurno(response.game.turn);
          if (response.game.gameType === "vsTiempo") {
            setTimeRemaining(response.game.gameTime * 60);
          }
        } else {
          console.error("Error al obtener el estado del juego:", response.message);
        }
        setIsLoading(false);
      });

      socket.on("gameStateUpdated", (data) => {
        if (data && data.newPositions) {
          setPositions(data.newPositions);
          setTurno(data.nextTurn);
        }
      });
       
      // Escuchar la actualización del estado del juego
      socket.on("Winner", ({ game }) => {
        setWinnerInfo({
          winner: game.winner,
          players: game.players.map((player) => player.nickname),
          creator: game.creatorName,
          gameId: game.gameCode,
        });
        setIsModalVisible(true); // Mostrar el modal
      });

    } else {
      console.error("El socket no está disponible o no está conectado");
    }

    return () => {
      if (socket) {
        socket.off("gameState");
        socket.off("gameStateUpdated");
        socket.off('Winner');
      }
    };
  }, [gameCode]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true); // Marca el juego como terminado
            
            // Emitir evento para verificar el ganador cuando se acabe el tiempo
            const socket = socketManager.getSocket();
            if (socket && socket.connected) {
              socket.emit("checkWinnerTimeOff", { gameCode }, (response) => {
                if (response.success) {
                  setWinnerInfo({
                    winner: response.game.winner,
                    players: response.game.players.map((player) => player.nickname),
                    creator: response.game.creatorName,
                    gameId: response.game.gameCode,
                  });
                  setIsModalVisible(true); // Mostrar el modal con la información del ganador
                } else {
                  console.error("Error al obtener el ganador:", response.message);
                }
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [timeRemaining, gameCode]);  

  const handleClick = (row, col, color) => {
    const socket = socketManager.getSocket();
    if (!socket || !socket.connected) {
      console.error("El socket no está disponible o no está conectado");
      return;
    }

    if (selectedChip) {
      if (
        color === "white" &&
        (validMoves.some(([vr, vc]) => vr === row && vc === col) ||
         validMovesJumping.some(([vr, vc]) => vr === row && vc === col))
      ) {
        socket.emit(
          "validateMove",
          {
            gameCode,
            fromRow: selectedChip.row,
            fromCol: selectedChip.col,
            toRow: row,
            toCol: col,
            chipColor: selectedChip.color,
          },
          (response) => {
            if (response.success) {
              setPositions(response.newPositions);
              setSelectedChip(null);
              setValidMoves([]);
              setValidMovesJumping([]);
              setHighlightedCells([]);
            } else {
              console.error("Movimiento inválido:", response.message);
              setSelectedChip(null);
              setValidMoves([]);
              setValidMovesJumping([]);
              setHighlightedCells([]);
            }
          }
        );
      } else {
        console.error("Movimiento inválido");
      }
    } else if (color !== "white") {
      setSelectedChip({ row, col, color });
      const basicMoves = getValidMoves(row, col, rows, cols, positions);
      const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);

      setValidMoves(basicMoves);
      setValidMovesJumping(jumpingMoves);
      setHighlightedCells([...basicMoves, ...jumpingMoves].map(([r, c]) => ({ row: r, col: c })));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-container">
      {isModalVisible && winnerInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="h2">Información del ganador</h2>
            <p className="p"><strong>Ganador:</strong> {winnerInfo.winner}</p>
            <p className="p"><strong>Jugadores:</strong> {winnerInfo.players.join(", ")}</p>
            <p className="p"><strong>Host de la partida:</strong> {winnerInfo.creator}</p>
            <p className="p"><strong>Id de la sala:</strong> {winnerInfo.gameId}</p>
            <button onClick={() => setIsModalVisible(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div className="header-cell"></div>
      <div className="timer">
        <strong>Tiempo restante:</strong>{" "}
        {timeRemaining === null
          ? "Sin límite"
          : `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`}
        <br />
        <strong>Turno de: {turno}</strong>
      </div>
      {Array.from({ length: cols }, (_, index) => (
        <ColumnHeader key={index} index={index} />
      ))}

      {Array.from({ length: rows }, (_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          <RowHeader rowIndex={rowIndex} />

          {Array.from({ length: cols }, (_, colIndex) => {
            const chipColor = Object.keys(positions).find((color) =>
              positions[color]?.some(
                ([row, col]) => row === rowIndex && col === colIndex
              )
            );

            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                chipColor={chipColor}
                onClick={() => handleClick(rowIndex, colIndex, chipColor)}
                highlightedCells={highlightedCells}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Board;
