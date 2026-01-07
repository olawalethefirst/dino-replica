import {
  DINO_HEIGHT,
  DINO_WIDTH,
  DINO_X,
  GROUND_OFFSET,
} from "@/game/physics";
import type { Obstacle } from "@/game/obstacles";

export const hasCollision = (dinoY: number, obstacle: Obstacle): boolean => {
  const dinoLeft = DINO_X;
  const dinoRight = DINO_X + DINO_WIDTH;
  const dinoBottom = GROUND_OFFSET + dinoY;
  const dinoTop = dinoBottom + DINO_HEIGHT;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleBottom = obstacle.bottom;
  const obstacleTop = obstacle.bottom + obstacle.height;

  const overlapsX = dinoLeft < obstacleRight && dinoRight > obstacleLeft;
  const overlapsY = dinoBottom < obstacleTop && dinoTop > obstacleBottom;

  return overlapsX && overlapsY;
};
