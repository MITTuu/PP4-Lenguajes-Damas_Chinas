// Board.js
import React from 'react';
import Cell from './Cell';
import '../assets/Board.css';

const Board = () => {
  // Definición de la estructura del tablero con diferentes filas y columnas
  const boardStructure = [
    [null, null, null, null, null, null, 'R', null, null, null, null, null, null],       
    [null, null, null, null, null, null, 'R', 'R', null, null, null, null, null, null],
    [null, null, null, null, null, 'R', 'R', 'R', null, null, null, null, null],  
    [null, null, 'R', 'R', 'R', 'R', null, null],      
    ['Y', 'Y', 'Y', 'Y', '0', '0', '0', '0', '0', 'G', 'G', 'G', 'G'],
    ['Y', 'Y', 'Y', '0', '0', '0', '0', '0', '0', 'G', 'G', 'G'],
    ['Y', 'Y', '0', '0', '0', '0', '0', '0', '0', 'G', 'G'],
    ['Y', '0', '0', '0', '0', '0', '0', '0', '0', 'G'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['B', '0', '0', '0', '0', '0', '0', '0', '0', 'P'],
    ['B', 'B', '0', '0', '0', '0', '0', '0', '0', 'P', 'P'],
    ['B', 'B', 'B', '0', '0', '0', '0', '0', '0', 'P', 'P', 'P'], 
    ['B', 'B', 'B', 'B', '0', '0', '0', '0', '0', 'P', 'P', 'P', 'P'], 
    [null, null, 'O', 'O', 'O', 'O', null, null],
    [null, null, null, null, null, 'O', 'O', 'O', null, null, null, null, null],
    [null, null, null, null, null, null, 'O', 'O', null, null, null, null, null, null],
    [null, null, null, null, null, null, 'O', null, null, null, null, null, null]
  ];

  return (
    <div className="board">
      {boardStructure.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} color={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
