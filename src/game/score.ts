export const updateScore = (
  currentScore: number,
  dt: number,
  speed: number
): number => currentScore + dt * speed;
