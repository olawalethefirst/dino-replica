import {
  advanceObstacles,
  createObstacle,
  pruneObstacles,
} from "@/game/obstacles";

describe("obstacles", () => {
  it("creates obstacles within size bounds", () => {
    const rng = () => 0.5;
    const obstacle = createObstacle("obs-1", rng);
    expect(obstacle.id).toBe("obs-1");
    expect(obstacle.width).toBeGreaterThanOrEqual(18);
    expect(obstacle.width).toBeLessThanOrEqual(32);
    expect(obstacle.height).toBeGreaterThanOrEqual(26);
    expect(obstacle.height).toBeLessThanOrEqual(44);
  });

  it("moves obstacles based on speed and dt", () => {
    const moved = advanceObstacles(
      [{ id: "1", x: 200, width: 20, height: 30, bottom: 24 }],
      100,
      0.25
    );
    expect(moved[0].x).toBeCloseTo(175);
  });

  it("prunes obstacles that exit the screen", () => {
    const pruned = pruneObstacles([
      { id: "1", x: -30, width: 20, height: 30, bottom: 24 },
      { id: "2", x: 10, width: 20, height: 30, bottom: 24 },
    ]);
    expect(pruned).toHaveLength(1);
    expect(pruned[0].id).toBe("2");
  });
});
