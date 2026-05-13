# useSimpleKeyboard

A simple library of React hooks for handling keyboard inputs and hotkeys across different platforms and languages.

[![npm version](https://img.shields.io/npm/v/use-simple-keyboard.svg)](https://www.npmjs.com/package/use-simple-keyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Cross-platform support** - Works consistently across Windows, macOS, and Linux
- 🌍 **Multi-language keyboard support** - Handles different keyboard layouts and languages
- ⚡ **Lightweight** - Zero dependencies (except React peer dependency)
- 🔧 **TypeScript support** - Full TypeScript definitions included
- 🎨 **Flexible API** - Support for single hotkeys and multiple hotkey combinations
- 🛡️ **Event handling** - Built-in preventDefault and stopPropagation options

## Installation

```bash
npm install use-simple-keyboard
```

## Quick Start

```tsx
import React from 'react';
import { useHotkey } from 'use-simple-keyboard';

function App() {
  // Simple hotkey
  useHotkey(['ctrl', 'c'], () => {
    console.log('Copy triggered!');
  });

  // Platform-specific hotkey (Cmd on Mac, Ctrl on others)
  useHotkey(['meta', 's'], () => {
    console.log('Save triggered!');
  });

  return <div>Press Ctrl+C or Cmd+S (Mac)</div>;
}
```

## API Reference

### `useHotkey(keys, callback, options?)`

The main hook for handling single hotkey combinations.

#### Parameters

- **keys**: `string | string[]` - The key combination to listen for
- **callback**: `(event: KeyboardEvent) => void` - Function to execute when hotkey is pressed
- **options**: `UseHotkeyOptions` - Optional configuration

#### Key Formats

You can specify keys in multiple formats:

```tsx
// Array format
useHotkey(['ctrl', 'c'], callback);
useHotkey(['ctrl', 'shift', 'z'], callback);

// String format with '+' separator
useHotkey('ctrl+c', callback);
useHotkey('ctrl+shift+z', callback);

// Single key
useHotkey('escape', callback);
useHotkey(['f1'], callback);
```

#### Supported Keys

**Modifier Keys:**

- `ctrl` / `control` - Control key
- `meta` / `cmd` / `command` - Command key (Mac) / Windows key
- `alt` - Alt key
- `shift` - Shift key

**Special Keys:**

- `enter` / `return`
- `escape` / `esc`
- `space` / `spacebar`
- `tab`
- `backspace`
- `delete` / `del`
- `insert`
- `home`, `end`
- `pageup`, `pagedown`
- `arrowup`, `arrowdown`, `arrowleft`, `arrowright` (or `up`, `down`, `left`, `right`)

**Function Keys:**

- `f1` through `f12`

**Regular Keys:**

- Any letter: `a`, `b`, `c`, etc.
- Any number: `1`, `2`, `3`, etc.
- Any symbol: `+`, `-`, `=`, etc.

#### Options

```tsx
interface UseHotkeyOptions {
  enabled?: boolean; // Default: true
  preventDefault?: boolean; // Default: true
  stopPropagation?: boolean; // Default: false
  target?: HTMLElement | Document | Window | null; // Default: document
  eventType?: 'keydown' | 'keyup' | 'keypress'; // Default: 'keydown'
}
```

### `useHotkeys(hotkeys, options?)`

Hook for handling multiple hotkeys at once.

```tsx
import { useHotkeys } from 'use-simple-keyboard';

function Editor() {
  useHotkeys({
    'ctrl+c': () => copy(),
    'ctrl+v': () => paste(),
    'ctrl+z': () => undo(),
    'ctrl+shift+z': () => redo(),
    'ctrl+s': () => save(),
    escape: () => closeModal(),
  });

  return <div>Text Editor</div>;
}
```

## Usage Examples

### Basic Hotkeys

```tsx
import { useHotkey } from 'use-simple-keyboard';

function BasicExample() {
  useHotkey(['ctrl', 'c'], () => alert('Copy!'));
  useHotkey(['ctrl', 'v'], () => alert('Paste!'));
  useHotkey('escape', () => alert('Escape pressed!'));

  return <div>Try Ctrl+C, Ctrl+V, or Escape</div>;
}
```

### Platform-Specific Hotkeys

```tsx
function PlatformExample() {
  // Use 'meta' for Cmd on Mac, Ctrl on others
  useHotkey(['meta', 's'], () => save());

  // Or handle both explicitly
  useHotkey(['ctrl', 's'], () => save()); // Windows/Linux
  useHotkey(['cmd', 's'], () => save()); // Mac

  return <div>Press Cmd+S (Mac) or Ctrl+S (Windows/Linux)</div>;
}
```

### Conditional Hotkeys

```tsx
function ConditionalExample() {
  const [isEditing, setIsEditing] = useState(false);

  useHotkey(['ctrl', 'e'], () => setIsEditing(true), {
    enabled: !isEditing,
  });

  useHotkey('escape', () => setIsEditing(false), {
    enabled: isEditing,
  });

  return (
    <div>
      {isEditing ? 'Editing mode - Press Escape' : 'Press Ctrl+E to edit'}
    </div>
  );
}
```

### Scoped Hotkeys

```tsx
function ScopedExample() {
  const modalRef = useRef<HTMLDivElement>(null);

  // Only listen for hotkeys within the modal
  useHotkey('escape', () => closeModal(), {
    target: modalRef.current,
  });

  return (
    <div ref={modalRef} tabIndex={-1}>
      Modal content - Press Escape to close
    </div>
  );
}
```

### Complex Combinations

```tsx
function ComplexExample() {
  // Multiple modifier keys
  useHotkey(['ctrl', 'shift', 'alt', 'r'], () => {
    console.log('Super reload!');
  });

  // Function keys
  useHotkey('f12', () => openDevTools());

  // Number keys
  useHotkey(['ctrl', '1'], () => switchToTab(1));
  useHotkey(['ctrl', '2'], () => switchToTab(2));

  return <div>Try various key combinations</div>;
}
```

### Global App Hotkeys

```tsx
function App() {
  useHotkeys({
    // File operations
    'ctrl+n': () => newFile(),
    'ctrl+o': () => openFile(),
    'ctrl+s': () => saveFile(),

    // Edit operations
    'ctrl+z': () => undo(),
    'ctrl+y': () => redo(),
    'ctrl+shift+z': () => redo(), // Alternative redo

    // Navigation
    'ctrl+f': () => openSearch(),
    'ctrl+g': () => findNext(),
    'ctrl+shift+g': () => findPrevious(),

    // Application
    f11: () => toggleFullscreen(),
    'ctrl+shift+i': () => openDevTools(),
  });

  return <YourAppContent />;
}
```

## Cross-Platform Considerations

The library automatically handles platform differences:

- **macOS**: Uses `meta` key (Cmd) for system shortcuts
- **Windows/Linux**: Uses `ctrl` key for system shortcuts
- **Key normalization**: Handles different key representations across browsers
- **Language support**: Works with different keyboard layouts and languages

## TypeScript Support

The library is written in TypeScript and includes full type definitions:

```tsx
import { useHotkey, UseHotkeyOptions, KeyEvent } from 'use-simple-keyboard';

const options: UseHotkeyOptions = {
  enabled: true,
  preventDefault: true,
  target: document.body,
};

useHotkey(
  ['ctrl', 'c'],
  (event: KeyboardEvent) => {
    // event is properly typed
    console.log(event.key);
  },
  options
);
```

## Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT
