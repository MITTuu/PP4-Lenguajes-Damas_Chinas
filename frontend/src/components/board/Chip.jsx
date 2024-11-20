import React from 'react';
import styles from '../../assets/Chip.module.css';

const Chip = ({ id, color, borderColor, onClick }) => {
  return (
    <button 
      className={styles.chip} 
      id={`chip-${id}`} 
      style={{
        backgroundColor: color,
        border: `3px solid ${borderColor || 'black'}`, 
      }}
      onClick={onClick} 
    />
  );
};

export default Chip;
