import React, { useState } from 'react';
import { getAdjustedPositions } from './utils/positions';
import { getValidMoves, getValidMovesJumping } from './utils/moves';
import RowHeader from './RowsHeader';
import ColumnHeader from './ColumnsHeader';
import Cell from './Cell';
import '../../assets/Board.css';

const Board = ({ numPlayers = 4 }) => {
  // Estado iniciales
  const rows = 17;
  const cols = 25;
  const [positions, setPositions] = useState(getAdjustedPositions(numPlayers));
  const [selectedChip, setSelectedChip] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);

  const handleClick = (row, col, color) => {
    if (selectedChip) {
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
  
        console.log(`¿Es un movimiento de salto válido? ${isValidJumpMove}`);
  
        newPositions.white = newPositions.white.filter(([r, c]) => !(r === row && c === col));
        newPositions.white.push([selectedChip.row, selectedChip.col]);
  
        newPositions[selectedChip.color].push([row, col]);
  
        setPositions(newPositions);
        setValidMoves([]);
        setValidMovesJumping([]);
        setHighlightedCells([]);
      }
      setSelectedChip(null);
    } else if (color !== 'white') {
      setSelectedChip({ row, col, color });
  
      // Obtener los movimientos básicos y de salto y guárdalos
      const basicMoves = getValidMoves(row, col, rows, cols, positions);
      const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);
  
      // Muestra los movimientos en consola o en la interfaz
      console.log("Movimientos básicos:", basicMoves);
      console.log("Movimientos de salto:", jumpingMoves);
  
      // Establece los movimientos válidos
      setValidMoves(basicMoves);
      setValidMovesJumping(jumpingMoves);

      // Almacena las celdas para destacar y el color de borde
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
