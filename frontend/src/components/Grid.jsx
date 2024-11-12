import React from 'react';
import '../assets/Grid.css';

const Grid = () => {
  // Crear un array de 18 filas y 26 columnas
  const rows = 17;
  const cols = 25;

  // Función para manejar el clic en una celda
  const handleClick = (row, col) => {
    console.log(`Celda seleccionada: (${row}, ${col})`);
  };

  return (
    <div className="grid-container">
      {/* Encabezado de columnas (fila 0) */}
      <div className="header-cell"></div> {/* Esquina (0,0) vacía */}
      {Array.from({ length: cols }, (_, index) => (
        <div 
          key={`col-header-${index}`} 
          className={`column-header ${index === 0 ? 'first-column' : ''}`}
        >
          {index}
        </div>
      ))}

      {/* Filas del cuerpo de la cuadrícula */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {/* Encabezado de filas (columna 0) */}
          <div 
            className={`row-header ${rowIndex === 0 ? 'first-row' : ''}`}
          >
            {rowIndex}
          </div>

          {/* Celdas de la cuadrícula */}
          {Array.from({ length: cols }, (_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              className="grid-cell"
            >
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Grid;
