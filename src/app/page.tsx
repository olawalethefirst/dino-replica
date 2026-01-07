"use client";

import Game from "@/components/game/Game";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-16 text-stone-900">
      <section className="flex w-full max-w-4xl flex-col items-center gap-10">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-stone-400">
            Chrome Dino Replica
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Dash, jump, and dodge the desert
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
            Press space or tap to start. Keep the dino above the ground while
            obstacles start rolling in.
          </p>
        </header>
        <Game />
      </section>
    </main>
  );
}
