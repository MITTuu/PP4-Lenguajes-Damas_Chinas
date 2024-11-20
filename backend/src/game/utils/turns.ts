export const getNextTurn = (currentTurn: string, players: { color: string }[]): string => {
  // Obtiene los colores de los jugadores en el orden definido
  const playerColors = players.map(player => player.color);

  // Encuentra el índice del turno actual
  const currentIndex = playerColors.indexOf(currentTurn);

  // Calcula el índice del siguiente turno (circular)
  const nextIndex = (currentIndex + 1) % playerColors.length;

  return playerColors[nextIndex];
};

