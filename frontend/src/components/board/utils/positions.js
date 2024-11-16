// Posiciones iniciales
export const initialPositions = {
    red: [
      [0, 12], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11],
      [3, 13], [3, 15]
    ],
    green: [
      [4, 18], [4, 20], [4, 22], [4, 24], [5, 19], [5, 21], [5, 23], [6, 20],
      [6, 22], [7, 21]
    ],
    orange: [
      [9, 21], [10, 20], [10, 22], [11, 19], [11, 21], [11, 23], [12, 18],
      [12, 20], [12, 22], [12, 24]
    ],
    yellow: [
      [13, 9], [13, 11], [13, 13], [13, 15], [14, 10], [14, 12], [14, 14],
      [15, 11], [15, 13], [16, 12]
    ],
    purple: [
      [9, 3], [10, 2], [10, 4], [11, 1], [11, 3], [11, 5], [12, 0], [12, 2],
      [12, 4], [12, 6]
    ],
    blue: [
      [4, 0], [4, 2], [4, 4], [4, 6], [5, 1], [5, 3], [5, 5], [6, 2], [6, 4],
      [7, 3]
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
  export const getAdjustedPositions = (numPlayers) => {
    const newPositions = { ...initialPositions };
  
    switch (numPlayers) {
      case 2:
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
        newPositions.white = [
          ...newPositions.white,
          ...newPositions.red,
          ...newPositions.yellow
        ];
        newPositions.red = [];
        newPositions.yellow = [];
        break;
      case 6:
        break;
      default:
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
  