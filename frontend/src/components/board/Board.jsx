import React, { useState } from 'react';
import { getAdjustedPositions } from './utils/positions';
import { getValidMoves, getValidMovesJumping } from './utils/moves';
import { getNextTurn } from './utils/turns';
import RowHeader from './RowsHeader';
import ColumnHeader from './ColumnsHeader';
import Cell from './Cell';
import '../../assets/Board.css';

const Board = ({ numPlayers = 4 }) => {
  const rows = 17;
  const cols = 25;

  // Genera las posiciones iniciales ajustadas para el número de jugadores
  const initialPositions = getAdjustedPositions(numPlayers);

  // Determina el primer turno basado en el color de la primera ficha encontrada
  const initialTurn = Object.keys(initialPositions).find(
    (color) => color !== 'white' && initialPositions[color].length > 0
  );

  // Estados iniciales
  const [positions, setPositions] = useState(initialPositions);
  const [selectedChip, setSelectedChip] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [hasMoved, setHasMoved] = useState(false);

  const handleClick = (row, col, color) => {
    if (selectedChip) {
      // Si la posición seleccionada es otra ficha del mismo color y no se ha movido:
      if (!hasMoved && color === currentTurn && !(row === selectedChip.row && col === selectedChip.col)) {
        // Cambia la selección a la nueva ficha
        setSelectedChip({ row, col, color });
  
        // Obtiene los nuevos movimientos básicos y de salto
        const basicMoves = getValidMoves(row, col, rows, cols, positions);
        const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);
  
        setValidMoves(basicMoves);
        setValidMovesJumping(jumpingMoves);
  
        // Actualiza las celdas destacadas
        setHighlightedCells([...basicMoves, ...jumpingMoves].map(([r, c]) => ({ row: r, col: c, borderColor: color })));
  
        return; // Sale para evitar otras acciones
      }
  
      // Verifica que la posición sea válida para moverse
      if (
        color === 'white' &&
        (validMoves.some(([vr, vc]) => vr === row && vc === col) ||
         validMovesJumping.some(([vr, vc]) => vr === row && vc === col))
      ) {
        const newPositions = { ...positions };
  
        // Remueve y mueve la ficha seleccionada
        newPositions[selectedChip.color] = newPositions[selectedChip.color].filter(
          ([r, c]) => !(r === selectedChip.row && c === selectedChip.col)
        );
  
        const isValidJumpMove = validMovesJumping.some(([vr, vc]) => vr === row && vc === col);
  
        // Actualiza posiciones
        newPositions.white = newPositions.white.filter(([r, c]) => !(r === row && c === col));
        newPositions.white.push([selectedChip.row, selectedChip.col]);
        newPositions[selectedChip.color].push([row, col]);
  
        setPositions(newPositions);
        setHasMoved(true); // Marca que se realizó un movimiento
  
        if (isValidJumpMove) {
          // Comprueba si hay más saltos válidos disponibles desde la nueva posición
          const jumpingMoves = getValidMovesJumping(row, col, rows, cols, newPositions).filter(
            ([vr, vc]) => !(vr === selectedChip.row && vc === selectedChip.col) // Excluye la posición anterior
          );
  
          if (jumpingMoves.length > 0) {
            setValidMovesJumping(jumpingMoves);
            setValidMoves([]); // No hay movimientos básicos disponibles después de un salto
            setSelectedChip({ row, col, color: selectedChip.color });
  
            // Actualiza las celdas destacadas con el color correcto
            setHighlightedCells(
              jumpingMoves.map(([r, c]) => ({ row: r, col: c, borderColor: selectedChip.color }))
            );
  
            return; // No cambia el turno todavía
          }
        }
  
        // Si no hay más saltos válidos, el turno finaliza
        setSelectedChip(null);
        setValidMoves([]);
        setValidMovesJumping([]);
        setHighlightedCells([]);
        setHasMoved(false); // Reinicia el estado de movimiento
        setCurrentTurn(getNextTurn(currentTurn, positions));

        console.log(newPositions);
      }
    } else if (color !== 'white' && color === currentTurn && !hasMoved) {
      // Selecciona la ficha si es del color del turno actual y no se ha movido
      setSelectedChip({ row, col, color });
  
      // Obtiene los movimientos básicos y de salto
      const basicMoves = getValidMoves(row, col, rows, cols, positions);
      const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);
  
      setValidMoves(basicMoves);
      setValidMovesJumping(jumpingMoves);
  
      // Destaca las celdas válidas
      setHighlightedCells([...basicMoves, ...jumpingMoves].map(([r, c]) => ({ row: r, col: c, borderColor: color })));
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
            const chipColor = Object.keys(positions).find(color =>
              positions[color].some(([row, col]) => row === rowIndex && col === colIndex)
            );

            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                chipColor={chipColor}
                onClick={handleClick}
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
