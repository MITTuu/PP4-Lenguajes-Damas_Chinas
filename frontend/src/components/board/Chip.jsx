import React from 'react';

const Chip = ({ id, color, borderColor, onClick }) => {
  return (
    <button 
      className="chip" 
      id={`chip-${id}`} 
      style={{
        backgroundColor: color,
        width: '39px',
        height: '39px',
        borderRadius: '50%',
        border: `3px solid ${borderColor || 'black'}`, 
        cursor: 'pointer',
      }}
      onClick={onClick} 
    />
  );
};

export default Chip;
