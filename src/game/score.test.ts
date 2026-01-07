import { updateScore } from "@/game/score";

describe("score", () => {
  it("accumulates based on speed and time", () => {
    const next = updateScore(10, 100, 0.25);
    expect(next).toBeCloseTo(35);
  });
});
