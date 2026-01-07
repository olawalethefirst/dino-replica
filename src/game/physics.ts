export type DinoState = {
  y: number;
  vy: number;
  grounded: boolean;
};

export const GAME_HEIGHT = 220;
export const GAME_WIDTH = 720;
export const GROUND_OFFSET = 24;
export const DINO_HEIGHT = 48;
export const DINO_WIDTH = 44;
export const DINO_X = 64;

const GRAVITY = -0.003;
const JUMP_VELOCITY = 0.9;
const MAX_FALL_VELOCITY = -1.3;

export const createDino = (): DinoState => ({
  y: 0,
  vy: 0,
  grounded: true,
});

export const jump = (state: DinoState): DinoState => {
  if (!state.grounded) {
    return state;
  }
  return {
    y: state.y,
    vy: JUMP_VELOCITY,
    grounded: false,
  };
};

export const stepDino = (state: DinoState, dt: number): DinoState => {
  const nextVy = Math.max(state.vy + GRAVITY * dt, MAX_FALL_VELOCITY);
  const nextY = state.y + nextVy * dt;

  if (nextY <= 0) {
    return {
      y: 0,
      vy: 0,
      grounded: true,
    };
  }

  return {
    y: nextY,
    vy: nextVy,
    grounded: false,
  };
};
