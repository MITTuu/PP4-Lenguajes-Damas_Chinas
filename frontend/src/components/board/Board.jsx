import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RowHeader from "./RowsHeader";
import ColumnHeader from "./ColumnsHeader";
import Cell from "./Cell";
import "../../assets/Board.css";
import { socketManager } from "../../services/socketManager";

import { getValidMoves, getValidMovesJumping } from './utils/moves';

const Board = () => {
  const { gameCode } = useParams();
  const rows = 17;
  const cols = 25;

  // Estados para las posiciones, celdas resaltadas y estado de carga
  const [positions, setPositions] = useState({});
  const [selectedChip, setSelectedChip] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = socketManager.getSocket();

    // Verificar si el socket está conectado, si no, conectarse
    if (!socketManager.isUserConnected()) {
      socketManager.connect();
    }

    // Verificar si el socket está disponible y conectado antes de emitir el evento
    if (socket && socket.connected) {
      // Solicitar el estado del juego al backend
      socket.emit("getGameState", gameCode, (response) => {
        if (response.success) {
          setPositions(response.game.positions);
        } else {
          console.error("Error al obtener el estado del juego:", response.message);
        }
        setIsLoading(false);
      });

      // Escuchar la actualización del estado del juego
      socket.on("gameStateUpdated", (data) => {
        if (data && data.newPositions) {
          setPositions(data.newPositions); 
        }
      });

    } else {
      console.error("El socket no está disponible o no está conectado");
    }

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      if (socket) {
        socket.off("gameState");
        socket.off("gameStateUpdated");
      }
    };
  }, [gameCode]);

  const handleClick = (row, col, color) => {
    const socket = socketManager.getSocket();
  
    if (!socket || !socket.connected) {
      console.error("El socket no está disponible o no está conectado");
      return;
    }
  
    if (selectedChip) {
      // Verifica si el destino es válido (fichas blancas)
      if (
        color === "white" &&
        (validMoves.some(([vr, vc]) => vr === row && vc === col) ||
         validMovesJumping.some(([vr, vc]) => vr === row && vc === col))
      ) {
        // Emite el movimiento al backend
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
              console.log("Movimiento realizado con éxito");
              // Actualiza las posiciones en el estado
              setPositions(response.newPositions);
              setSelectedChip(null);
              setValidMoves([]);
              setValidMovesJumping([]);
              setHighlightedCells([]);
            } else {
              console.error("Movimiento inválido:", response.message);
            }
          }
        );
      } else {
        console.error("Movimiento inválido");
      }
    } else if (color !== "white") {
      // Seleccionar una ficha del color del jugador
      setSelectedChip({ row, col, color });
  
      // Calcula los movimientos válidos
      const basicMoves = getValidMoves(row, col, rows, cols, positions);
      const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);
      
      console.log("basicos: ", basicMoves);
      console.log("saltos: ", jumpingMoves);

      setValidMoves(basicMoves);
      setValidMovesJumping(jumpingMoves);
      setHighlightedCells([...basicMoves, ...jumpingMoves].map(([r, c]) => ({ row: r, col: c })));
    }
  };   

  // Mostrar el indicador de carga si no hemos obtenido el estado
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-container">
      <div className="header-cell"></div>
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
