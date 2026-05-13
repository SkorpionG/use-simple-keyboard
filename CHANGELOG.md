# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-05-13

### Added

- `useHotkey` hook — listen for a single key or key combination (`ctrl+c`, `meta+s`, `escape`, etc.)
- `useHotkeys` hook — register multiple hotkeys at once via a key→callback record
- `useKeySequence` hook — detect sequential key presses (e.g. Konami code), with configurable timeout, strict mode, and reset-on-complete
- Full TypeScript definitions including `UseHotkeyOptions`, `UseKeySequenceOptions`, `KeySequenceState`, `HotkeyCallback`, `KeyInfo`, and all key types
- Cross-platform key normalization (`normalizeKey`, `parseHotkey`, `matchesHotkey`, `keysToHotkey`, `createKeyInfo`)
- `getPlatformModifier` utility to detect Cmd (macOS) vs Ctrl (Windows/Linux)
- Support for `keydown`, `keyup`, and `keypress` event types
- `enabled` option to conditionally activate/deactivate hooks without unmounting
- `preventDefault` and `stopPropagation` options per hook
- Custom `target` element support (defaults to `document`)
- Catch-all listener via empty string key (`""`)
- Zero runtime dependencies — only a React peer dependency (`>=16.8.0`)
- Comprehensive test suite (72 tests, ~95% line coverage)
- Interactive demo application (`demos/`)

[0.0.1]: https://github.com/SkorpionG/use-simple-keyboard/releases/tag/v0.0.1
