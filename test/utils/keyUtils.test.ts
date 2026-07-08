import {
  normalizeKey,
  getPlatformModifier,
  parseHotkey,
  matchesHotkey,
  keysToHotkey,
  createKeyInfo,
  type KeyEvent,
} from '../../src/utils/keyUtils';

describe('keyUtils', () => {
  describe('normalizeKey', () => {
    it('should normalize space key variants', () => {
      expect(normalizeKey(' ')).toBe('space');
      expect(normalizeKey('Space')).toBe('space');
      expect(normalizeKey('Spacebar')).toBe('space');
    });

    it('should normalize letter keys to lowercase', () => {
      expect(normalizeKey('a')).toBe('a');
      expect(normalizeKey('A')).toBe('a');
      expect(normalizeKey('Z')).toBe('z');
    });

    it('should normalize escape key variants', () => {
      expect(normalizeKey('Escape')).toBe('escape');
      expect(normalizeKey('Esc')).toBe('escape');
    });

    it('should normalize modifier keys', () => {
      expect(normalizeKey('Control')).toBe('ctrl');
      expect(normalizeKey('Meta')).toBe('meta');
      expect(normalizeKey('Alt')).toBe('alt');
      expect(normalizeKey('Shift')).toBe('shift');
    });

    it('should normalize arrow keys', () => {
      expect(normalizeKey('ArrowUp')).toBe('arrowup');
      expect(normalizeKey('ArrowDown')).toBe('arrowdown');
      expect(normalizeKey('ArrowLeft')).toBe('arrowleft');
      expect(normalizeKey('ArrowRight')).toBe('arrowright');
      // Legacy aliases
      expect(normalizeKey('Up')).toBe('arrowup');
      expect(normalizeKey('Down')).toBe('arrowdown');
      expect(normalizeKey('Left')).toBe('arrowleft');
      expect(normalizeKey('Right')).toBe('arrowright');
    });

    it('should normalize navigation keys', () => {
      expect(normalizeKey('Enter')).toBe('enter');
      expect(normalizeKey('Return')).toBe('enter');
      expect(normalizeKey('Tab')).toBe('tab');
      expect(normalizeKey('Backspace')).toBe('backspace');
      expect(normalizeKey('Delete')).toBe('delete');
      expect(normalizeKey('Del')).toBe('delete');
      expect(normalizeKey('Insert')).toBe('insert');
      expect(normalizeKey('Home')).toBe('home');
      expect(normalizeKey('End')).toBe('end');
      expect(normalizeKey('PageUp')).toBe('pageup');
      expect(normalizeKey('PageDown')).toBe('pagedown');
    });

    it('should return lowercase for unmapped keys', () => {
      expect(normalizeKey('F1')).toBe('f1');
      expect(normalizeKey('F12')).toBe('f12');
    });
  });

  describe('getPlatformModifier', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return "meta" on macOS', () => {
      Object.defineProperty(global, 'navigator', {
        value: { platform: 'MacIntel' },
        writable: true,
      });
      expect(getPlatformModifier()).toBe('meta');
    });

    it('should return "ctrl" on Windows', () => {
      Object.defineProperty(global, 'navigator', {
        value: { platform: 'Win32' },
        writable: true,
      });
      expect(getPlatformModifier()).toBe('ctrl');
    });

    it('should return "ctrl" on Linux', () => {
      Object.defineProperty(global, 'navigator', {
        value: { platform: 'Linux x86_64' },
        writable: true,
      });
      expect(getPlatformModifier()).toBe('ctrl');
    });

    it('should return "ctrl" when navigator is undefined (SSR)', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      });
      expect(getPlatformModifier()).toBe('ctrl');
    });
  });

  describe('parseHotkey', () => {
    it('should parse simple key combinations', () => {
      expect(parseHotkey('ctrl+c')).toEqual(['ctrl', 'c']);
      expect(parseHotkey('alt+f4')).toEqual(['alt', 'f4']);
    });

    it('should parse three-key combinations', () => {
      expect(parseHotkey('ctrl+shift+z')).toEqual(['ctrl', 'shift', 'z']);
    });

    it('should normalize cmd to meta', () => {
      expect(parseHotkey('cmd+s')).toEqual(['meta', 's']);
      expect(parseHotkey('command+s')).toEqual(['meta', 's']);
    });

    it('should normalize control to ctrl', () => {
      expect(parseHotkey('control+c')).toEqual(['ctrl', 'c']);
    });

    it('should handle single key', () => {
      expect(parseHotkey('escape')).toEqual(['escape']);
    });

    it('should handle keys with spaces (trimming)', () => {
      expect(parseHotkey('ctrl + c')).toEqual(['ctrl', 'c']);
    });

    it('should convert to lowercase', () => {
      expect(parseHotkey('CTRL+A')).toEqual(['ctrl', 'a']);
    });
  });

  describe('matchesHotkey', () => {
    const baseEvent: KeyEvent = {
      key: 'a',
      code: 'KeyA',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
    };

    it('should match a simple key press', () => {
      expect(matchesHotkey(baseEvent, ['a'])).toBe(true);
    });

    it('should not match wrong key', () => {
      expect(matchesHotkey(baseEvent, ['b'])).toBe(false);
    });

    it('should match ctrl+a combination', () => {
      const event: KeyEvent = { ...baseEvent, ctrlKey: true };
      expect(matchesHotkey(event, ['ctrl', 'a'])).toBe(true);
    });

    it('should not match if modifier is pressed but not expected', () => {
      const event: KeyEvent = { ...baseEvent, ctrlKey: true };
      expect(matchesHotkey(event, ['a'])).toBe(false);
    });

    it('should not match if modifier is expected but not pressed', () => {
      expect(matchesHotkey(baseEvent, ['ctrl', 'a'])).toBe(false);
    });

    it('should match meta key', () => {
      const event: KeyEvent = { ...baseEvent, key: 's', metaKey: true };
      expect(matchesHotkey(event, ['meta', 's'])).toBe(true);
    });

    it('should match alt key', () => {
      const event: KeyEvent = { ...baseEvent, key: 'f', altKey: true };
      expect(matchesHotkey(event, ['alt', 'f'])).toBe(true);
    });

    it('should match shift key', () => {
      const event: KeyEvent = { ...baseEvent, key: 'z', shiftKey: true };
      expect(matchesHotkey(event, ['shift', 'z'])).toBe(true);
    });

    it('should return false when no non-modifier key is provided', () => {
      const event: KeyEvent = { ...baseEvent, ctrlKey: true };
      expect(matchesHotkey(event, ['ctrl'])).toBe(false);
    });

    it('should return false when multiple non-modifier keys are provided', () => {
      const event: KeyEvent = { ...baseEvent };
      expect(matchesHotkey(event, ['a', 'b'])).toBe(false);
    });

    it('should match space key', () => {
      const event: KeyEvent = { ...baseEvent, key: ' ' };
      expect(matchesHotkey(event, ['space'])).toBe(true);
    });
  });

  describe('keysToHotkey', () => {
    it('should join keys into a hotkey string', () => {
      expect(keysToHotkey(['ctrl', 'c'])).toBe('ctrl+c');
    });

    it('should sort modifiers in standard order', () => {
      expect(keysToHotkey(['shift', 'ctrl', 'a'])).toBe('ctrl+shift+a');
      expect(keysToHotkey(['alt', 'meta', 'x'])).toBe('meta+alt+x');
    });

    it('should normalize keys before joining', () => {
      expect(keysToHotkey(['Control', 'a'])).toBe('ctrl+a');
    });

    it('should handle single key', () => {
      expect(keysToHotkey(['escape'])).toBe('escape');
    });
  });

  describe('createKeyInfo', () => {
    const makeKeyboardEvent = (overrides: Partial<KeyboardEvent>) =>
      ({
        key: 'a',
        code: 'KeyA',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false,
        ...overrides,
      }) as KeyboardEvent;

    it('should create key info for a plain key press', () => {
      const event = makeKeyboardEvent({ key: 'a', code: 'KeyA' });
      const info = createKeyInfo(event);
      expect(info.key).toBe('a');
      expect(info.code).toBe('KeyA');
      expect(info.normalizedKey).toBe('a');
      expect(info.combination).toBe('a');
      expect(info.modifiers).toEqual({
        ctrl: false,
        meta: false,
        alt: false,
        shift: false,
      });
    });

    it('should create key info with modifier keys', () => {
      const event = makeKeyboardEvent({ key: 's', ctrlKey: true });
      const info = createKeyInfo(event);
      expect(info.combination).toBe('ctrl+s');
      expect(info.modifiers.ctrl).toBe(true);
    });

    it('should include all active modifiers in combination', () => {
      const event = makeKeyboardEvent({
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        metaKey: true,
        altKey: true,
      });
      const info = createKeyInfo(event);
      expect(info.combination).toBe('ctrl+meta+alt+shift+z');
      expect(info.modifiers).toEqual({
        ctrl: true,
        meta: true,
        alt: true,
        shift: true,
      });
    });

    it('should normalize special keys in the combination', () => {
      const event = makeKeyboardEvent({ key: ' ', code: 'Space' });
      const info = createKeyInfo(event);
      expect(info.normalizedKey).toBe('space');
      expect(info.combination).toBe('space');
    });
  });
});
