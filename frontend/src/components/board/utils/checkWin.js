// Definir las posiciones de ganar
export const winPositions = {
    red: [
      [13, 9], [13, 11], [13, 13], [13, 15], [14, 10], [14, 12], [14, 14],
      [15, 11], [15, 13], [16, 12]
    ],
    blue: [
      [9, 21], [10, 20], [10, 22], [11, 19], [11, 21], [11, 23], [12, 18],
      [12, 20], [12, 22], [12, 24]
    ],
    purple: [
      [4, 18], [4, 20], [4, 22], [4, 24], [5, 19], [5, 21], [5, 23], [6, 20],
      [6, 22], [7, 21]
    ],
    yellow: [
      [0, 12], [1, 11], [1, 13], [2, 10], [2, 12], [2, 14], [3, 9], [3, 11],
      [3, 13], [3, 15]
    ],
    orange: [
      [4, 0], [4, 2], [4, 4], [4, 6], [5, 1], [5, 3], [5, 5], [6, 2], [6, 4],
      [7, 3]
    ],
    green: [
      [9, 3], [10, 2], [10, 4], [11, 1], [11, 3], [11, 5], [12, 0], [12, 2],
      [12, 4], [12, 6]
    ]
  };
  
  // Función para verificar si un color ha ganado
  export const checkWinner = (positions) => {
    // Recorre cada color en winPositions
    for (const color in winPositions) {
      const winPos = winPositions[color];
      const playerPositions = positions[color] || [];
  
      // Contamos cuántas posiciones de ganancia están ocupadas por el color
      const winningCount = winPos.filter(([r, c]) => 
        playerPositions.some(([pr, pc]) => pr === r && pc === c)
      ).length;
  
      // Si tiene 9 o más fichas en las posiciones de ganancia, gana
      if (winningCount >= 9) {
        return color;
      }
    }
  
    return null; // Si no hay ganador
  };
  