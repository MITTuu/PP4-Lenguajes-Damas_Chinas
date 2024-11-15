export const getDynamicTurnOrder = (positions) => {
  return Object.keys(positions).filter(
    (color) => color !== 'white' && positions[color].length > 0
  );
};

export const getNextTurn = (currentTurn, positions) => {
  const turnOrder = getDynamicTurnOrder(positions);
  const currentIndex = turnOrder.indexOf(currentTurn);
  return turnOrder[(currentIndex + 1) % turnOrder.length];
};
