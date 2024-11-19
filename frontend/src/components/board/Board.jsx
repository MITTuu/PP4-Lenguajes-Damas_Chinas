import React, { useState, useEffect } from "react";
import RowHeader from "./RowsHeader";
import ColumnHeader from "./ColumnsHeader";
import Cell from "./Cell";
import "../../assets/Board.css";
import { socketManager } from '../../services/socketManager';

const Board = ({ gameCode }) => {
  const rows = 17;
  const cols = 25;

  // Estados para las posiciones y celdas destacadas
  const [positions, setPositions] = useState({});
  const [highlightedCells, setHighlightedCells] = useState([]);

  useEffect(() => {
    const socket = socketManager.getSocket();

    // Asegurarse de que el socket esté conectado
    if (!socketManager.isUserConnected()) {
      socketManager.connect();
    }

    // Escuchar las actualizaciones del estado del juego desde el backend
    socket.on("gameStateUpdate", (gameState) => {
      if (gameState.gameCode === gameCode) {
        setPositions(gameState.positions); // Actualizar posiciones
      }
    });

    // Escuchar las celdas válidas para moverse
    socket.on("validMoves", (validMoves) => {
      setHighlightedCells(
        validMoves.map(([row, col]) => ({
          row,
          col,
          borderColor: "yellow",
        }))
      );
    });

    // Limpiar los listeners cuando se desmonte el componente
    return () => {
      socket.off("gameStateUpdate");
      socket.off("validMoves");
    };
  }, [gameCode]);

  // Manejar el clic en una celda
  const handleClick = (row, col, chipColor) => {
    const socket = socketManager.getSocket();

    if (chipColor) {
      // Enviar al backend la acción del jugador
      socket.emit("playerMove", { gameCode, row, col });
    }
  };

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
              positions[color]?.some(([row, col]) => row === rowIndex && col === colIndex)
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
