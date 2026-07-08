# use-simple-keyboard

A lightweight, zero-dependency library of React hooks for handling keyboard inputs and hotkeys across different platforms and languages.

## Project Overview

- **Type:** React Library (Hooks)
- **Main Technologies:** React (>=16.8.0), TypeScript, Jest, ESLint, Prettier.
- **Architecture:**
  - `src/hooks`: Contains the main hooks (`useHotkey`, `useHotkeys`, `useKeySequence`).
  - `src/utils`: Key normalization and matching logic.
  - `src/types`: TypeScript definitions for keys and hotkeys.
  - `src/index.ts`: Public API entry point.

## Building and Running

- **Build:** `npm run build` (runs `tsc`)
- **Development:** `npm run dev` (runs `tsc --watch`)
- **Typecheck:** `npm run typecheck`; use `npm run typecheck:all` to also check `demos/`
- **Lint:** `npm run lint` / `npm run lint:fix`; use `npm run lint:all` or `npm run lint:fix:all` to include `demos/`
- **Format:** `npm run format` / `npm run format:check`; use `npm run format:all` or `npm run format:check:all` to include `demos/`
- **Test:** `npm run test` (runs `jest` with `ts-jest`)
- **Test Watch:** `npm run test:watch`
- **Coverage:** `npm run test:coverage`; use `npm run test:coverage:text` for text-only coverage output
- **Prepublish Gate:** `npm run prepublishOnly` runs format, typecheck, lint, test, and build for the root package
- **Demo App:** run demo commands with `npm --prefix demos run <script>` (for example, `dev`, `build`, `typecheck`, `lint`, `format:check`)

## Development Conventions

- **Hooks First:** Logic is encapsulated in custom React hooks.
- **TypeScript:** Strict typing is used throughout the project. Types are centralized in `src/types/keys.ts`.
- **Normalization:** Keyboard events are normalized to handle cross-platform (macOS/Windows/Linux) and cross-browser differences. See `src/utils/keyUtils.ts`.
- **Testing:**
  - Comprehensive unit testing with `jest` and `@testing-library/react`.
  - Tests are located in the `test/` directory, mirroring the `src/` structure.
  - Every new hook or utility should have corresponding tests.
- **Code Style:** Enforced by ESLint and Prettier.
- **Git Hooks:** `husky` and `lint-staged` are used to run linting and formatting on commit.
- **Local Notes:** `TODO.md` is ignored by git and can be used for local task tracking.

## Key APIs

- **`useHotkey(keys, callback, options?)`**: Listen for a specific hotkey combination.
- **`useHotkeys(hotkeys, options?)`**: Listen for multiple hotkey combinations simultaneously.
- **`useKeySequence(sequence, callback, options?)`**: Listen for a sequence of keys (e.g., Konami code).

## Implementation Details

- **Event Listeners:** Hooks attach listeners to `document` by default, but this can be overridden via `options.target`.
- **Cleanup:** `useEffect` is used to ensure event listeners are properly removed when components unmount or dependencies change.
- **Platform Modifiers:** The library automatically handles platform-specific modifiers (e.g., `meta` for Cmd on Mac, `ctrl` on others) when using `meta` in hotkey strings.
