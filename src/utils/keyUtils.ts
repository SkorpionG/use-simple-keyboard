/**
 * Utility functions for normalizing keyboard events across different platforms and languages
 */

export interface KeyEvent {
  key: string;
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

/**
 * Normalize key names to handle cross-platform differences
 */
export const normalizeKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    // Handle different representations of common keys
    Control: 'ctrl',
    Meta: 'meta',
    Alt: 'alt',
    Shift: 'shift',
    Enter: 'enter',
    Return: 'enter',
    Escape: 'escape',
    Esc: 'escape',
    Space: 'space',
    ' ': 'space',
    Spacebar: 'space',
    Tab: 'tab',
    Backspace: 'backspace',
    Delete: 'delete',
    Del: 'delete',
    Insert: 'insert',
    Home: 'home',
    End: 'end',
    PageUp: 'pageup',
    PageDown: 'pagedown',
    ArrowUp: 'arrowup',
    ArrowDown: 'arrowdown',
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
    Up: 'arrowup',
    Down: 'arrowdown',
    Left: 'arrowleft',
    Right: 'arrowright',
  };

  // Convert to lowercase for consistent comparison
  const normalizedKey = key.toLowerCase();

  // Return mapped key or original normalized key
  return keyMap[key] || normalizedKey;
};

/**
 * Get the platform-specific modifier key (Cmd on Mac, Ctrl on others)
 */
export const getPlatformModifier = (): string => {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  return isMac ? 'meta' : 'ctrl';
};

/**
 * Parse a hotkey string into normalized components
 * Examples: "ctrl+c", "cmd+shift+z", "alt+f4"
 */
export const parseHotkey = (hotkey: string): string[] => {
  return hotkey
    .toLowerCase()
    .split('+')
    .map((key) => key.trim())
    .map((key) => {
      // Handle platform-specific aliases
      if (key === 'cmd') return 'meta';
      if (key === 'command') return 'meta';
      if (key === 'control') return 'ctrl';
      return normalizeKey(key);
    });
};

/**
 * Check if the current key event matches the target hotkey combination
 */
export const matchesHotkey = (
  event: KeyEvent,
  targetKeys: string[]
): boolean => {
  const normalizedEventKey = normalizeKey(event.key);
  const normalizedTargetKeys = targetKeys.map((key) => normalizeKey(key));

  // Check if all modifier keys match
  const hasCtrl = event.ctrlKey;
  const hasMeta = event.metaKey;
  const hasAlt = event.altKey;
  const hasShift = event.shiftKey;

  const expectedCtrl = normalizedTargetKeys.includes('ctrl');
  const expectedMeta = normalizedTargetKeys.includes('meta');
  const expectedAlt = normalizedTargetKeys.includes('alt');
  const expectedShift = normalizedTargetKeys.includes('shift');

  // Modifier keys must match exactly
  if (
    hasCtrl !== expectedCtrl ||
    hasMeta !== expectedMeta ||
    hasAlt !== expectedAlt ||
    hasShift !== expectedShift
  ) {
    return false;
  }

  // Find the non-modifier key
  const nonModifierKeys = normalizedTargetKeys.filter(
    (key) => !['ctrl', 'meta', 'alt', 'shift'].includes(key)
  );

  // Should have exactly one non-modifier key
  if (nonModifierKeys.length !== 1) {
    return false;
  }

  // Check if the main key matches
  return normalizedEventKey === nonModifierKeys[0];
};

/**
 * Convert array of keys to a normalized hotkey string
 */
export const keysToHotkey = (keys: string[]): string => {
  const normalizedKeys = keys.map((key) => normalizeKey(key));

  // Sort modifiers in a consistent order
  const modifiers: string[] = [];
  const nonModifiers: string[] = [];

  for (const key of normalizedKeys) {
    if (['ctrl', 'meta', 'alt', 'shift'].includes(key)) {
      modifiers.push(key);
    } else {
      nonModifiers.push(key);
    }
  }

  // Sort modifiers in standard order
  const sortedModifiers = modifiers.sort((a, b) => {
    const order = ['ctrl', 'meta', 'alt', 'shift'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return [...sortedModifiers, ...nonModifiers].join('+');
};

/**
 * Create KeyInfo object from a keyboard event
 */
export const createKeyInfo = (event: KeyboardEvent) => {
  const normalizedKey = normalizeKey(event.key);

  const modifiers = {
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    shift: event.shiftKey,
  };

  // Build combination string
  const modifierKeys: string[] = [];
  if (modifiers.ctrl) modifierKeys.push('ctrl');
  if (modifiers.meta) modifierKeys.push('meta');
  if (modifiers.alt) modifierKeys.push('alt');
  if (modifiers.shift) modifierKeys.push('shift');

  const combination =
    modifierKeys.length > 0
      ? `${modifierKeys.join('+')}+${normalizedKey}`
      : normalizedKey;

  return {
    key: event.key,
    code: event.code,
    normalizedKey,
    modifiers,
    combination,
  };
};
