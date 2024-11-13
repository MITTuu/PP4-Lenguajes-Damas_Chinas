import React from 'react';

const Chip = ({ id, color, onClick }) => {
  return (
    <button 
      className="chip" 
      id={`chip-${id}`} 
      style={{
        backgroundColor: color,
        width: '39px',
        height: '39px',
        borderRadius: '50%',
        border: '2px solid black',
        cursor: 'pointer',
      }}
      onClick={onClick} 
    >
    </button>
  );
};

export default Chip;
