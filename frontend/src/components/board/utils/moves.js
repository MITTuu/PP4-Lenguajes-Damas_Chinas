// Función para calcular los saltos de fichas
export const getValidMovesJumping = (row, col, rows, cols, positions) => {
  const jumps = [
      [row + 2, col + 2],   // abajo izquierda
      [row + 2, col - 2],   // abajo derecha
      [row - 2, col - 2],   // arriba izquierda
      [row - 2, col + 2],   // arriba derecha
      [row, col - 4],       // horizontal izquierda
      [row, col + 4]        // horizontal derecha
  ];

  return jumps.filter(([r, c], index) => {
      const intermediateRow = row + (jumps[index][0] - row) / 2;
      const intermediateCol = col + (jumps[index][1] - col) / 2;
      return (
          r >= 0 && r < rows && c >= 0 && c < cols && // Dentro del tablero
          !positions.white.some(([wr, wc]) => wr === intermediateRow && wc === intermediateCol) && // Posición adyacente con ficha
          positions.white.some(([wr, wc]) => wr === r && wc === c) // Posición de destino blanca
      );
  });
};

// Calcula movimientos válidos para una ficha seleccionada
export const getValidMoves = (row, col, rows, cols, positions) => {
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