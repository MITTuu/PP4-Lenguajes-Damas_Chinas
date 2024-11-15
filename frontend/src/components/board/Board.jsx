import React, { useState } from 'react';
import { getAdjustedPositions } from './utils/positions';
import { getValidMoves, getValidMovesJumping } from './utils/moves';
import RowHeader from './RowsHeader';
import ColumnHeader from './ColumnsHeader';
import Cell from './Cell';
import '../../assets/Board.css';

const Board = ({ numPlayers = 2 }) => {
  // Estados iniciales
  const rows = 17;
  const cols = 25;
  const [positions, setPositions] = useState(getAdjustedPositions(numPlayers));
  const [selectedChip, setSelectedChip] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [hasJumped, setHasJumped] = useState(false);
  const [originalJumpPosition, setOriginalJumpPosition] = useState(null); // Nueva estado para rastrear posición original
  //Turnos:
  const [currentTurn, setCurrentTurn] = useState(0);
  const initialPositions = getAdjustedPositions(numPlayers);
  const playerColors = Object.keys(initialPositions).filter(color => color !== 'white' && initialPositions[color].length > 0);

  const handleClick = (row, col, color) => {
    // Permite mover solo la ficha del jugador en turno
    if (selectedChip && color === 'white') {
      const isJumpMove = validMovesJumping.some(([vr, vc]) => vr === row && vc === col);
      
      // Si ya salto, solo permite movimientos de salto
      if (hasJumped && !isJumpMove) {
        return; // No permite move de un salto
      }

      if (
        (!hasJumped && validMoves.some(([vr, vc]) => vr === row && vc === col)) ||
        validMovesJumping.some(([vr, vc]) => vr === row && vc === col)
      ) {
        const newPositions = { ...positions };
        
        // Remueve la ficha seleccionada de su posicion original y mueve a la nueva
        newPositions[selectedChip.color] = newPositions[selectedChip.color].filter(
          ([r, c]) => !(r === selectedChip.row && c === selectedChip.col)
        );
        
        newPositions.white = newPositions.white.filter(([r, c]) => !(r === row && c === col));
        newPositions.white.push([selectedChip.row, selectedChip.col]);
        newPositions[selectedChip.color].push([row, col]);
        
        // Actualiza el estado de posiciones
        setPositions(newPositions);

        if (isJumpMove) {
          if (!hasJumped) {
            // Si es el primer salto, guarda la posicion original
            setOriginalJumpPosition({ row: selectedChip.row, col: selectedChip.col });
          }
          setHasJumped(true);
          
          // Verifica si hay ms saltos posibles desde la nueva posicion
          const newJumpingMoves = getValidMovesJumping(row, col, rows, cols, newPositions)
            .filter(([newRow, newCol]) => {
              // Filtra los saltos que llevarían de vuelta a la posicion original
              return !(originalJumpPosition && 
                     newRow === originalJumpPosition.row && 
                     newCol === originalJumpPosition.col);
            });
////////////////////////////RESTRICCION DE MOVES Y JUMP A PRIGEN////////////////////////////////////////
          if (newJumpingMoves.length > 0) {
            // Si hay mas saltos posibles, actualiza los movimientos validos
            setValidMovesJumping(newJumpingMoves);
            setValidMoves([]); // No permite movimientos basicos
            setHighlightedCells(newJumpingMoves.map(([r, c]) => ({ row: r, col: c, borderColor: selectedChip.color })));
            setSelectedChip({ row, col, color: selectedChip.color }); // Mantiene la ficha seleccionada asi evitamos problemas de selecion multiple
            return;
          }
        }

        // Si no hay más saltos posibles o fue un movimiento normal, limpia todo y pasa el turno
        setValidMoves([]);
        setValidMovesJumping([]);
        setHighlightedCells([]);
        setSelectedChip(null);
        setHasJumped(false);
        //setOriginalJumpPosition(null); 
        
        // Pasa el turno solo si no hay mas saltos posibles
        if (!isJumpMove || validMovesJumping.length === 0) {
          setCurrentTurn((currentTurn + 1) % playerColors.length);
        }
      }
    } else if (color === playerColors[currentTurn] && !hasJumped) {
      // Solo permite seleccionar nueva ficha si no ha saltado
      setSelectedChip({ row, col, color });

      const basicMoves = getValidMoves(row, col, rows, cols, positions);
      const jumpingMoves = getValidMovesJumping(row, col, rows, cols, positions);
      
      setValidMoves(basicMoves);
      setValidMovesJumping(jumpingMoves);
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