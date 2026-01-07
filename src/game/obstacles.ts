import { GAME_WIDTH, GROUND_OFFSET } from "@/game/physics";

export type Obstacle = {
  id: string;
  x: number;
  width: number;
  height: number;
  bottom: number;
};

export const OBSTACLE_MIN_WIDTH = 18;
export const OBSTACLE_MAX_WIDTH = 32;
export const OBSTACLE_MIN_HEIGHT = 26;
export const OBSTACLE_MAX_HEIGHT = 44;

export const createObstacle = (
  id: string,
  rng: () => number = Math.random
): Obstacle => {
  const width =
    OBSTACLE_MIN_WIDTH +
    Math.floor(rng() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH + 1));
  const height =
    OBSTACLE_MIN_HEIGHT +
    Math.floor(rng() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT + 1));

  return {
    id,
    x: GAME_WIDTH + width,
    width,
    height,
    bottom: GROUND_OFFSET,
  };
};

export const advanceObstacles = (
  obstacles: Obstacle[],
  dt: number,
  speed: number
): Obstacle[] =>
  obstacles.map((obstacle) => ({
    ...obstacle,
    x: obstacle.x - speed * dt,
  }));

export const pruneObstacles = (obstacles: Obstacle[]): Obstacle[] =>
  obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
