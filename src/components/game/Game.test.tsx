import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Game from "@/components/game/Game";

describe("Game", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the idle prompt on load", () => {
    render(<Game />);
    const status = screen.getByText(/press space, arrow up, or tap to start/i);
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText(/score 0/i)).toBeInTheDocument();
    expect(screen.getByText(/best 0/i)).toBeInTheDocument();
  });

  it("starts running when space is pressed", async () => {
    render(<Game />);
    fireEvent.keyDown(window, { code: "Space" });
    expect(screen.getAllByText(/running/i).length).toBeGreaterThan(0);
  });

  it("starts running when the playfield is tapped", async () => {
    render(<Game />);
    const playfield = screen.getByRole("button", { name: /chrome dino game/i });
    await userEvent.click(playfield);
    expect(screen.getAllByText(/running/i).length).toBeGreaterThan(0);
  });

  it("renders a game over overlay when status is over", () => {
    render(
      <Game initialStatus="over" initialScore={123} initialHighScore={150} />
    );
    const overlay = screen.getByTestId("game-over-overlay");
    expect(within(overlay).getByText("Game Over")).toBeInTheDocument();
    expect(
      within(overlay).getByText(/press space or tap to restart/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/score 123/i)).toBeInTheDocument();
    expect(screen.getByText(/best 150/i)).toBeInTheDocument();
  });

  it("restarts when the playfield is clicked after game over", async () => {
    render(<Game initialStatus="over" />);
    const playfield = screen.getByRole("button", { name: /chrome dino game/i });
    await userEvent.click(playfield);
    expect(screen.getAllByText(/running/i).length).toBeGreaterThan(0);
  });
});
