// Main exports
export {
  useHotkey,
  useHotkeys,
  type UseHotkeyOptions,
} from './hooks/useHotkey';
export {
  useKeySequence,
  type UseKeySequenceOptions,
  type KeySequenceState,
} from './hooks/useKeySequence';

// Type exports
export type {
  ModifierKey,
  SpecialKey,
  ArrowKey,
  LetterKey,
  NumberKey,
  FunctionKey,
  SymbolKey,
  SupportedKey,
  HotkeyString,
  HotkeyInput,
  HotkeysRecord,
  KeyInfo,
  HotkeyCallback,
} from './types/keys';

// Utility exports for advanced usage
export {
  normalizeKey,
  getPlatformModifier,
  parseHotkey,
  matchesHotkey,
  keysToHotkey,
  createKeyInfo,
  type KeyEvent,
} from './utils/keyUtils';

// Re-export default
export { default } from './hooks/useHotkey';
