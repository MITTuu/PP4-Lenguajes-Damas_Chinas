import React from 'react';
import Chip from './Chip';

const Cell = ({ rowIndex, colIndex, chipColor, onClick, highlightedCells }) => {
  const highlight = highlightedCells.find(cell => cell.row === rowIndex && cell.col === colIndex);
  const borderColor = highlight ? highlight.borderColor : 'black';

  return (
    <div
      className="cell"
      onClick={() => onClick(rowIndex, colIndex, chipColor)}
      style={{
        width: '40px',
        height: '40px',
        border: `1px solid black`,
        backgroundColor: 'white',
      }}
    >
      {chipColor && <Chip color={chipColor} borderColor={borderColor} />}
    </div>
  );
};

export default Cell;
