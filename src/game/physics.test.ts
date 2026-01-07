import { createDino, jump, stepDino } from "@/game/physics";

describe("dino physics", () => {
  it("starts grounded", () => {
    const dino = createDino();
    expect(dino.grounded).toBe(true);
    expect(dino.y).toBe(0);
  });

  it("jumps only when grounded", () => {
    const grounded = createDino();
    const jumped = jump(grounded);
    expect(jumped.grounded).toBe(false);
    expect(jumped.vy).toBeGreaterThan(0);

    const airborne = { ...jumped, grounded: false };
    const ignored = jump(airborne);
    expect(ignored.vy).toBe(airborne.vy);
  });

  it("falls back to the ground", () => {
    const airborne = { y: 30, vy: -0.5, grounded: false };
    const landed = stepDino(airborne, 200);
    expect(landed.y).toBe(0);
    expect(landed.grounded).toBe(true);
  });
});
