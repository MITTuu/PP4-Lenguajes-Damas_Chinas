import React from 'react';
import '../assets/Grid.css';

const Grid = () => {
  const rows = 17;
  const cols = 25;

  const circleCoordinates = [
    [0, 12], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11],
    [3, 13], [3, 15], [4, 0], [4, 2], [4, 4], [4, 6], [4, 8], [4, 10],
    [4, 12], [4, 14], [4, 16], [4, 18], [4, 20], [4, 22], [4, 24], [5, 1],
    [5, 3], [5, 5], [5, 7], [5, 9], [5, 11], [5, 13], [5, 15], [5, 17],
    [5, 19], [5, 21], [5, 23], [6, 2], [6, 4], [6, 6], [6, 8], [6, 10],
    [6, 12], [6, 14], [6, 16], [6, 18], [6, 20], [6, 22], [7, 3], [7, 5],
    [7, 7], [7, 9], [7, 11], [7, 13], [7, 15], [7, 17], [7, 19], [7, 21],
    [8, 4], [8, 6], [8, 8], [8, 10], [8, 12], [8, 14], [8, 16], [8, 18],
    [8, 20], [9, 3], [9, 5], [9, 7], [9, 9], [9, 11], [9, 13], [9, 15],
    [9, 17], [9, 19], [9, 21], [10, 2], [10, 4], [10, 6], [10, 8], [10, 10],
    [10, 12], [10, 14], [10, 16], [10, 18], [10, 20], [10, 22], [11, 1],
    [11, 3], [11, 5], [11, 7], [11, 9], [11, 11], [11, 13], [11, 15], [11, 17],
    [11, 19], [11, 21], [11, 23], [12, 0], [12, 2], [12, 4], [12, 6], [12, 8],
    [12, 10], [12, 12], [12, 14], [12, 16], [12, 18], [12, 20], [12, 22],
    [12, 24], [13, 9], [13, 11], [13, 13], [13, 15], [14, 10], [14, 12],
    [14, 14], [15, 11], [15, 13], [16, 12]
  ];

  //Fichas del juego segun sus coordenadas:

  //Fichas rojas:
  const redCoordinates = [
    [0, 12], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11], [3, 13], [3, 15]
  ];
  //Fichas amarillas:
  const yellowCoordinates = [
    [4, 0], [4, 2], [4, 4], [4, 6], [5, 1], [5, 3], [5, 5], [6, 2], [6, 4], [7, 3]
  ];
    //Fichas moradas:
  const purpleCoordinates = [
    [9, 3], [10, 2], [10, 4], [11, 1], [11, 3], [11, 5], [12, 0], [12, 2], [12, 4], [12, 6]
  ];
    //Fichas verdes:
  const greenCoordinates = [
    [13, 9], [13, 11], [13, 13], [13, 15], [14, 10], [14, 12], [14, 14], [15, 11], [15, 13], [16, 12]
  ];
    //Fichas azules:
  const blueCoordinates = [
    [9,21],[10,22], [11, 19], [11, 21], [11, 23], [10, 20], [11, 22], [12,18], [12, 20], [12, 22], [12, 24]
  ];
    //Fichas negras:
  const blackCoordinates = [
    [4, 18], [4, 20], [4, 22], [4, 24], [5, 19], [5, 21], [5, 23], [6, 20], [6, 22], [7, 21]
  ];
  //Funcion para asinarles el color a cada celda segun su x,y
  const getColorClass = (row, col) => {
    if (redCoordinates.some(([r, c]) => r === row && c === col)) return 'red-cell';
    if (yellowCoordinates.some(([r, c]) => r === row && c === col)) return 'yellow-cell';
    if (purpleCoordinates.some(([r, c]) => r === row && c === col)) return 'purple-cell';
    if (greenCoordinates.some(([r, c]) => r === row && c === col)) return 'green-cell';
    if (blueCoordinates.some(([r, c]) => r === row && c === col)) return 'blue-cell';
    if (blackCoordinates.some(([r, c]) => r === row && c === col)) return 'black-cell';
    return '';
  };

  const handleClick = (row, col) => {
    console.log(`Celda seleccionada: (${row}, ${col})`);
  };

  return (
    <div className="grid-container">
      <div className="header-cell"></div>
      {Array.from({ length: cols }, (_, index) => (
        <div 
          key={`col-header-${index}`} 
          className={`column-header ${index === 0 ? 'first-column' : ''}`}
        >
          {index}
        </div>
      ))}

      {Array.from({ length: rows }, (_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          <div 
            className={`row-header ${rowIndex === 0 ? 'first-row' : ''}`}
          >
            {rowIndex}
          </div>

          {Array.from({ length: cols }, (_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              className={`grid-cell ${getColorClass(rowIndex, colIndex)}`}
            >
              {circleCoordinates.some(([row, col]) => row === rowIndex && col === colIndex) && (
                <div className="circle"></div>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Grid;
