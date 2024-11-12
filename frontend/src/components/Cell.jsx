import React from 'react';
import '../assets/Board.css';

const Cell = ({ color, onClick, isSelected }) => {
  let cellStyle = {};
  let pieceClass = '';

  switch (color) {
    case '0':
      cellStyle = { backgroundColor: '#f0f0f0' };
      break;
    case 'R':
      cellStyle = { backgroundColor: 'red' };
      pieceClass = 'piece player1';
      break;
    case 'Y':
      cellStyle = { backgroundColor: 'yellow' };
      pieceClass = 'piece player2';
      break;
    case 'B':
      cellStyle = { backgroundColor: 'blue' };
      pieceClass = 'piece player3';
      break;
    case 'G':
      cellStyle = { backgroundColor: 'green' };
      pieceClass = 'piece player4';
      break;
    case 'P':
      cellStyle = { backgroundColor: 'purple' };
      pieceClass = 'piece player5';
      break;
    case 'O':
      cellStyle = { backgroundColor: 'orange' };
      pieceClass = 'piece player6';
      break;
    default:
      cellStyle = {};
      break;
  }

  return (
    <div 
      className={`cell ${isSelected ? 'selected' : ''}`} 
      style={cellStyle}
      onClick={onClick}
    >
      {color !== '0' && <div className={pieceClass}></div>}
    </div>
  );
};

export default Cell;
