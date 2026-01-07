## Chrome Dino Replica

## What the app is
Chrome Dino Replica is a browser-based clone of the classic offline Chrome dinosaur runner game, built as a small interactive web app.

## How it was built
- Built as a Next.js app using the App Router.
- UI is styled with Tailwind CSS.
- Game logic and UI are implemented in client components for immediate interactivity.
- Development is assisted by AI agents with project-specific rules for consistency and quality.

## Framework used
- Next.js (React + App Router)
- Tailwind CSS for styling

## AI agents in development
- Project instructions for AI agents live in `agents.md` and are treated as the source of truth.
- AI agents follow constraints like client-only components, Tailwind-only styling, and tests for every feature.
- Workflow automation is enforced via Husky pre-commit hooks to run linting and tests.

## Run locally
1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.
