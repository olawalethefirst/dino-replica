"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hasCollision } from "@/game/collision";
import {
  advanceObstacles,
  createObstacle,
  pruneObstacles,
  type Obstacle,
} from "@/game/obstacles";
import {
  createDino,
  DINO_HEIGHT,
  DINO_WIDTH,
  DINO_X,
  GROUND_OFFSET,
  jump,
  stepDino,
  type DinoState,
} from "@/game/physics";
import { updateScore } from "@/game/score";

type GameStatus = "idle" | "running" | "over";

type GameProps = {
  initialStatus?: GameStatus;
  initialScore?: number;
  initialHighScore?: number;
};

const actionKeyCodes = new Set(["Space", "ArrowUp", "Enter"]);
const GAME_SPEED = 0.25;
const MIN_SPAWN_MS = 900;
const MAX_SPAWN_MS = 1700;
const HIGH_SCORE_KEY = "dino-high-score";

export default function Game({
  initialStatus = "idle",
  initialScore = 0,
  initialHighScore,
}: GameProps) {
  const [status, setStatus] = useState<GameStatus>(initialStatus);
  const [dino, setDino] = useState<DinoState>(() => createDino());
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(initialScore);
  const [highScore, setHighScore] = useState(() => {
    if (typeof initialHighScore === "number") {
      return initialHighScore;
    }
    if (typeof window === "undefined") {
      return 0;
    }
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = stored ? Number(stored) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const lastTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const spawnAfterRef = useRef<number>(MIN_SPAWN_MS);
  const lastSpawnRef = useRef<number>(0);
  const obstacleIdRef = useRef(0);
  const dinoRef = useRef<DinoState>(createDino());
  const scoreRef = useRef(initialScore);

  const resetGame = useCallback(() => {
    const nextDino = createDino();
    dinoRef.current = nextDino;
    setDino(nextDino);
    setObstacles([]);
    setScore(0);
    scoreRef.current = 0;
    lastSpawnRef.current = 0;
    spawnAfterRef.current = MIN_SPAWN_MS;
  }, []);

  const handleAction = useCallback(() => {
    if (status === "idle") {
      setStatus("running");
      setDino((current) => {
        const next = jump(current);
        dinoRef.current = next;
        return next;
      });
      return;
    }
    if (status === "over") {
      resetGame();
      setStatus("running");
      setDino((current) => {
        const next = jump(current);
        dinoRef.current = next;
        return next;
      });
      return;
    }
    if (status === "running") {
      setDino((current) => {
        const next = jump(current);
        dinoRef.current = next;
        return next;
      });
    }
  }, [resetGame, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (actionKeyCodes.has(event.code)) {
        event.preventDefault();
        handleAction();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAction]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      setDino((current) => {
        const next = stepDino(current, dt);
        dinoRef.current = next;
        return next;
      });
      setScore((current) => {
        const next = updateScore(current, dt, GAME_SPEED);
        scoreRef.current = next;
        return next;
      });

      lastSpawnRef.current += dt;
      let obstacleToAdd: Obstacle | null = null;
      if (lastSpawnRef.current >= spawnAfterRef.current) {
        obstacleIdRef.current += 1;
        obstacleToAdd = createObstacle(`obstacle-${obstacleIdRef.current}`);
        lastSpawnRef.current = 0;
        spawnAfterRef.current =
          MIN_SPAWN_MS + Math.random() * (MAX_SPAWN_MS - MIN_SPAWN_MS);
      }

      setObstacles((current) => {
        const moved = pruneObstacles(advanceObstacles(current, dt, GAME_SPEED));
        const next = obstacleToAdd ? [...moved, obstacleToAdd] : moved;
        if (next.some((obstacle) => hasCollision(dinoRef.current.y, obstacle))) {
          const finalScore = Math.floor(scoreRef.current);
          setHighScore((previous) =>
            finalScore > previous ? finalScore : previous
          );
          setStatus("over");
        }
        return next;
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [status]);

  const statusMessage = useMemo(() => {
    if (status === "idle") {
      return "Press Space, Arrow Up, or tap to start";
    }
    if (status === "over") {
      return "Game over. Press Space or tap to restart";
    }
    return "Running";
  }, [status]);

  useEffect(() => {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
  }, [highScore]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-stone-500">
        <span>Dino Run</span>
        <div className="flex items-center gap-6">
          <span>Score {Math.floor(score)}</span>
          <span>Best {Math.floor(highScore)}</span>
        </div>
        <span aria-live="polite">{statusMessage}</span>
      </div>
      <div
        aria-label="Chrome dino game"
        className="relative h-[220px] w-full max-w-3xl overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-b from-stone-50 via-white to-stone-100 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
        onPointerDown={handleAction}
        onKeyDown={(event) => {
          if (actionKeyCodes.has(event.code)) {
            event.preventDefault();
            handleAction();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-x-6 bottom-6 h-[2px] bg-stone-300" />
        <div
          data-testid="dino"
          className="absolute rounded-lg bg-stone-800 shadow-[0_8px_18px_rgba(15,23,42,0.2)]"
          style={{
            width: `${DINO_WIDTH}px`,
            height: `${DINO_HEIGHT}px`,
            bottom: `${GROUND_OFFSET + dino.y}px`,
            left: `${DINO_X}px`,
          }}
        />
        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="absolute rounded-md bg-stone-700"
            style={{
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
              bottom: `${obstacle.bottom}px`,
              left: `${obstacle.x}px`,
            }}
          />
        ))}
        <div className="absolute right-6 top-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
          {status === "running" ? "Running" : status === "over" ? "Over" : "Idle"}
        </div>
        {status === "over" ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-stone-100/80 text-center backdrop-blur-sm"
            data-testid="game-over-overlay"
          >
            <div className="rounded-2xl border border-stone-200 bg-white/90 px-6 py-4 text-xs uppercase tracking-[0.3em] text-stone-500 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
              <span className="block text-lg font-semibold tracking-[0.1em] text-stone-800">
                Game Over
              </span>
              <span className="mt-2 block">Press Space or tap to restart</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
