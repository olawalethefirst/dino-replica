import { hasCollision } from "@/game/collision";

describe("collision", () => {
  it("detects overlap with a nearby obstacle", () => {
    const hit = hasCollision(0, {
      id: "1",
      x: 70,
      width: 24,
      height: 32,
      bottom: 24,
    });
    expect(hit).toBe(true);
  });

  it("ignores obstacles that are too far away", () => {
    const hit = hasCollision(0, {
      id: "1",
      x: 300,
      width: 24,
      height: 32,
      bottom: 24,
    });
    expect(hit).toBe(false);
  });
});
