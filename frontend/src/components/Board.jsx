import React, { useState } from 'react';
import Chip from './Chip';
import '../assets/Board.css';

const Board = ({ numPlayers }) => {
  const rows = 17;
  const cols = 25;

  const initialPositions = {
    red: [
      [0, 12], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11],
      [3, 13], [3, 15]
    ],
    blue: [
      [4, 0], [4, 2], [4, 4], [4, 6], [5, 1], [5, 3], [5, 5], [6, 2], [6, 4],
      [7, 3]
    ],
    purple: [
      [9, 3], [10, 2], [10, 4], [11, 1], [11, 3], [11, 5], [12, 0], [12, 2],
      [12, 4], [12, 6]
    ],
    yellow: [
      [13, 9], [13, 11], [13, 13], [13, 15], [14, 10], [14, 12], [14, 14],
      [15, 11], [15, 13], [16, 12]
    ],
    orange: [
      [9, 21], [10, 20], [10, 22], [11, 19], [11, 21], [11, 23], [12, 18],
      [12, 20], [12, 22], [12, 24]
    ],
    green: [
      [4, 18], [4, 20], [4, 22], [4, 24], [5, 19], [5, 21], [5, 23], [6, 20],
      [6, 22], [7, 21]
    ],
    white: [
      [4, 8], [4, 10], [4, 12], [4, 14], [4, 16], [5, 7], [5, 9], [5, 11],
      [5, 13], [5, 15], [5, 17], [6, 6], [6, 8], [6, 10], [6, 12], [6, 14],
      [6, 16], [6, 18], [7, 5], [7, 7], [7, 9], [7, 11], [7, 13], [7, 15],
      [7, 17], [7, 19], [8, 4], [8, 6], [8, 8], [8, 10], [8, 12], [8, 14],
      [8, 16], [8, 18], [8, 20], [9, 5], [9, 7], [9, 9], [9, 11], [9, 13],
      [9, 15], [9, 17], [9, 19], [10, 6], [10, 8], [10, 10], [10, 12], [10, 14],
      [10, 16], [10, 18], [11, 7], [11, 9], [11, 11], [11, 13], [11, 15],
      [11, 17], [12, 8], [12, 10], [12, 12], [12, 14], [12, 16]
    ]
  };

  // Función para adaptar las posiciones según la cantidad de jugadores
  const getAdjustedPositions = () => {
    const newPositions = { ...initialPositions };
  
    switch (3) {
      case 2:
        // Para 2 jugadores, convertimos las posiciones de azul, morado, naranja y verde a blanco
        newPositions.white = [
          ...newPositions.white,
          ...newPositions.blue,
          ...newPositions.purple,
          ...newPositions.orange,
          ...newPositions.green
        ];
        newPositions.blue = [];
        newPositions.purple = [];
        newPositions.orange = [];
        newPositions.green = [];
        break;
      case 3:
        // Para 3 jugadores, convertimos las posiciones de azul, amarillo y verde a blanco
        newPositions.white = [
          ...newPositions.white,
          ...newPositions.blue,
          ...newPositions.yellow,
          ...newPositions.green
        ];
        newPositions.blue = [];
        newPositions.yellow = [];
        newPositions.green = [];
        break;
      case 4:
        // Para 4 jugadores, convertimos las posiciones de rojo y amarillo a blanco
        newPositions.white = [
          ...newPositions.white,
          ...newPositions.red,
          ...newPositions.yellow
        ];
        newPositions.red = [];
        newPositions.yellow = [];
        break;
      case 6:
        // Para 6 jugadores, no cambiamos nada, mantenemos las posiciones originales
        break;
      default:
        // Todas las fichas blancas
        newPositions.white = [
          ...newPositions.white,
          ...newPositions.red,
          ...newPositions.yellow,
          ...newPositions.blue,
          ...newPositions.green,
          ...newPositions.orange,
          ...newPositions.purple
        ];
        newPositions.red = [];
        newPositions.yellow = []; 
        newPositions.blue = [];
        newPositions.green = [];
        newPositions.orange = [];
        newPositions.purple = [];
        break;
    }
  
    return newPositions;
  };

  // Estado para almacenar las posiciones actuales de las fichas
  const [positions, setPositions] = useState(getAdjustedPositions());
  const [selectedChip, setSelectedChip] = useState(null);

  //Estados estrictamente de movimientos
  const [validMoves, setValidMoves] = useState([]);
  const [validMovesJumping, setValidMovesJumping] = useState([]);


  // Funcion para calcular los saltos de fichas
  const getValidMovesJumping = (row, col) => {
    const jumps = [
      [row + 2, col + 2],   // abajo izquierda
      [row + 2, col - 2],   // abajo derecha
      [row - 2, col - 2],   // arriba izquierda
      [row - 2, col + 2],    // arriba derecha
      [row, col - 4],        // horizontal izquierda
      [row, col + 4]       // horizontal derecha

    ];
  
      // Filtra las posiciones que están dentro del tablero y son válidas para el salto
      return jumps.filter(([r, c], index) => {


        const intermediateRow = row + (jumps[index][0] - row) / 2;
        const intermediateCol = col + (jumps[index][1] - col) / 2;
        return (

          r >= 0 && r < rows && c >= 0 && c < cols && // Dentro del tablero
          !positions.white.some(([wr, wc]) => wr === intermediateRow && wc === intermediateCol) && // Posicion adyacente con ficha
          positions.white.some(([wr, wc]) => wr === r && wc === c) // Posicion de destino blanca
        );
      });
    };

  // Calcula movimientos válidos para una ficha seleccionada
  const getValidMoves = (row, col) => {
    const moves = [
      [row + 1, col + 1],   // abajo izquierda
      [row + 1, col - 1],   // abajo derecha
      [row - 1, col - 1],   // arriba izquierda
      [row - 1, col + 1],   // arriba derecha
      [row, col - 2],        // horizontal izquierda
      [row, col + 2]       // horizontal derecha
    ];
  
    // Filtra las posiciones que están dentro del tablero y libres (color 'white')
    return moves.filter(([r, c]) =>
      r >= 0 && r < rows && c >= 0 && c < cols &&
      positions.white.some(([wr, wc]) => wr === r && wc === c)
    );
  };
  
  // Maneja el clic en una celda con ficha
  const handleClick = (row, col, color) => {
    if (selectedChip) {
      // Verifica que la posición sea válida para moverse
      if (color === 'white' && (validMoves.some(([vr, vc]) => vr === row && vc === col) ||
                              validMovesJumping.some(([vr, vc]) => vr === row && vc === col))) {
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
        
        // Imprimir las posiciones de todas las fichas en la consola
        console.log("Posiciones actuales de las fichas:");
        Object.keys(newPositions).forEach(color => {
          console.log(`${color}: ${JSON.stringify(newPositions[color])}`);
        });
      }
      setSelectedChip(null);
    } else if (color !== 'white') {
      setSelectedChip({ row, col, color });
      setValidMoves(getValidMoves(row, col));
      setValidMovesJumping(getValidMovesJumping(row, col));  
    }
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
  
          {Array.from({ length: cols }, (_, colIndex) => {
            const chipColor = Object.keys(positions).find(color =>
              positions[color].some(([row, col]) => row === rowIndex && col === colIndex)
            );
  
            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                id={`cell-${rowIndex}-${colIndex}`}
                className="grid-cell"
              >
                {chipColor && (
                  <Chip 
                    id={`${rowIndex}-${colIndex}`} 
                    color={chipColor}
                    onClick={() => handleClick(rowIndex, colIndex, chipColor)}
                  />
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Board;
