/**
 * Type definitions for supported keyboard keys
 */

// Modifier keys
export type ModifierKey =
  'ctrl' | 'meta' | 'alt' | 'shift' | 'cmd' | 'command' | 'control';

// Special keys
export type SpecialKey =
  | 'enter'
  | 'return'
  | 'escape'
  | 'esc'
  | 'space'
  | 'spacebar'
  | 'tab'
  | 'backspace'
  | 'delete'
  | 'del'
  | 'insert'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown';

// Arrow keys
export type ArrowKey =
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'up'
  | 'down'
  | 'left'
  | 'right';

// Letter keys
export type LetterKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

// Number keys
export type NumberKey =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

// Function keys
export type FunctionKey =
  | 'f1'
  | 'f2'
  | 'f3'
  | 'f4'
  | 'f5'
  | 'f6'
  | 'f7'
  | 'f8'
  | 'f9'
  | 'f10'
  | 'f11'
  | 'f12';

// Symbol keys
export type SymbolKey =
  | '`'
  | '~'
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '*'
  | '('
  | ')'
  | '-'
  | '_'
  | '='
  | '+'
  | '['
  | '{'
  | ']'
  | '}'
  | '\\'
  | '|'
  | ';'
  | ':'
  | "'"
  | '"'
  | ','
  | '<'
  | '.'
  | '>'
  | '/'
  | '?';

// All supported keys
export type SupportedKey =
  | ModifierKey
  | SpecialKey
  | ArrowKey
  | LetterKey
  | NumberKey
  | FunctionKey
  | SymbolKey;

// Enhanced callback with key information
export interface KeyInfo {
  key: string;
  code: string;
  normalizedKey: string;
  modifiers: {
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
  };
  combination: string;
}

export type HotkeyCallback = (event: KeyboardEvent, keyInfo: KeyInfo) => void;

// Hotkey combination string (e.g., "ctrl+s", "meta+shift+z", "" for all keys)
export type HotkeyString = `${string}+${string}` | SupportedKey | '';

// Hotkey can be a single key or an array of keys, or empty string for all keys
export type HotkeyInput =
  SupportedKey | SupportedKey[] | string | string[] | '';

// Type for useHotkeys record - keys are hotkey combinations, values are callbacks
export type HotkeysRecord =
  Record<HotkeyString, HotkeyCallback> | Record<string, HotkeyCallback>;
