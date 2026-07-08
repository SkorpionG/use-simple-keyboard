import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHotkey, useHotkeys } from '../../src/hooks/useHotkey';

// ─── useHotkey ────────────────────────────────────────────────────────────────

const HotkeyComponent: React.FC<{
  keys: string | string[];
  callback: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  eventType?: 'keydown' | 'keyup' | 'keypress';
  target?: HTMLElement | Document | Window | null;
  useDefaultOptions?: boolean;
}> = ({
  keys,
  callback,
  enabled,
  preventDefault,
  stopPropagation,
  eventType,
  target,
  useDefaultOptions = false,
}) => {
  // Use a single hook call with conditionally constructed options to satisfy Rules of Hooks
  const options = useDefaultOptions
    ? undefined
    : {
        enabled,
        preventDefault,
        stopPropagation,
        eventType,
        target,
      };

  useHotkey(keys, callback, options);

  return <div data-testid="test-component">Test Component</div>;
};

describe('useHotkey', () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger callback when hotkey is pressed', () => {
    render(<HotkeyComponent keys="ctrl+a" callback={mockCallback} />);
    fireEvent.keyDown(document, {
      key: 'a',
      ctrlKey: true,
      altKey: false,
      shiftKey: false,
      metaKey: false,
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should work without options argument', () => {
    render(
      <HotkeyComponent
        keys="ctrl+a"
        callback={mockCallback}
        useDefaultOptions={true}
      />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger callback when wrong key is pressed', () => {
    render(<HotkeyComponent keys="ctrl+a" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work with target as window', () => {
    render(
      <HotkeyComponent keys="a" callback={mockCallback} target={window} />
    );
    fireEvent.keyDown(window, { key: 'a' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not attach listener when target is null', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    render(<HotkeyComponent keys="a" callback={mockCallback} target={null} />);
    expect(mockCallback).not.toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
  });

  it('should respect enabled=false option', () => {
    render(
      <HotkeyComponent keys="ctrl+a" callback={mockCallback} enabled={false} />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should re-attach listener when enabled changes', () => {
    const { rerender } = render(
      <HotkeyComponent keys="ctrl+a" callback={mockCallback} enabled={false} />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).not.toHaveBeenCalled();

    rerender(
      <HotkeyComponent keys="ctrl+a" callback={mockCallback} enabled={true} />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle special keys (space)', () => {
    render(<HotkeyComponent keys="space" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: ' ' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle escape key', () => {
    render(<HotkeyComponent keys="escape" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle three-key combinations', () => {
    render(<HotkeyComponent keys="ctrl+shift+z" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle array of keys format', () => {
    render(<HotkeyComponent keys={['ctrl', 'c']} callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should parse single-element array with plus sign identical to string', () => {
    // Regression for Bug 2: ['ctrl+c'] should be functionally equivalent to 'ctrl+c'
    render(<HotkeyComponent keys={['ctrl+c']} callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should listen on keyup when eventType is keyup', () => {
    render(
      <HotkeyComponent
        keys="ctrl+a"
        callback={mockCallback}
        eventType="keyup"
      />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).not.toHaveBeenCalled();

    fireEvent.keyUp(document, { key: 'a', ctrlKey: true });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should call stopPropagation when option is set', () => {
    render(
      <HotkeyComponent
        keys="a"
        callback={mockCallback}
        stopPropagation={true}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    fireEvent(document, event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault when preventDefault is false', () => {
    render(
      <HotkeyComponent
        keys="a"
        callback={mockCallback}
        preventDefault={false}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should call stopPropagation for catch-all hotkey', () => {
    render(
      <HotkeyComponent keys="" callback={mockCallback} stopPropagation={true} />
    );
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    fireEvent(document, event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault for catch-all when false', () => {
    render(
      <HotkeyComponent keys="" callback={mockCallback} preventDefault={false} />
    );
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <HotkeyComponent keys="a" callback={mockCallback} />
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it('should trigger callback for all keys when empty string is used', () => {
    render(<HotkeyComponent keys="" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should pass KeyboardEvent and KeyInfo to callback', () => {
    render(<HotkeyComponent keys="a" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).toHaveBeenCalledWith(
      expect.any(KeyboardEvent),
      expect.objectContaining({
        key: 'a',
        normalizedKey: 'a',
        combination: 'a',
      })
    );
  });

  it('should listen on keypress when eventType is keypress', () => {
    render(
      <HotkeyComponent keys="a" callback={mockCallback} eventType="keypress" />
    );
    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).not.toHaveBeenCalled();

    fireEvent.keyPress(document, { key: 'a' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should use the latest callback without re-attaching the listener', () => {
    // Verifies the callbackRef pattern: the listener is not re-created when
    // only the callback function reference changes.
    const callbackV2 = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    const { rerender } = render(
      <HotkeyComponent keys="a" callback={mockCallback} />
    );
    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender(<HotkeyComponent keys="a" callback={callbackV2} />);
    // Listener count should not have increased — no re-attach happened
    expect(addEventListenerSpy.mock.calls.length).toBe(initialCallCount);

    // But the new callback is used
    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).not.toHaveBeenCalled();
    expect(callbackV2).toHaveBeenCalledTimes(1);

    addEventListenerSpy.mockRestore();
  });
});

// ─── useHotkeys ───────────────────────────────────────────────────────────────

const HotkeysComponent: React.FC<{
  hotkeys: Record<string, () => void>;
  enabled?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  useDefaultOptions?: boolean;
}> = ({
  hotkeys,
  enabled,
  stopPropagation,
  preventDefault,
  useDefaultOptions = false,
}) => {
  // Filter out undefined so hook defaults (e.g. preventDefault:true) are not overridden
  const options = useDefaultOptions
    ? undefined
    : Object.fromEntries(
        Object.entries({ enabled, stopPropagation, preventDefault }).filter(
          ([, v]) => v !== undefined
        )
      );

  useHotkeys(hotkeys, options);

  return <div data-testid="test-component">Test Component</div>;
};

describe('useHotkeys', () => {
  let copyCallback: jest.Mock;
  let pasteCallback: jest.Mock;
  let undoCallback: jest.Mock;

  beforeEach(() => {
    copyCallback = jest.fn();
    pasteCallback = jest.fn();
    undoCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger correct callback for each hotkey', () => {
    render(
      <HotkeysComponent
        hotkeys={{
          'ctrl+c': copyCallback,
          'ctrl+v': pasteCallback,
          'ctrl+z': undoCallback,
        }}
      />
    );

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(copyCallback).toHaveBeenCalledTimes(1);
    expect(pasteCallback).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'v', ctrlKey: true });
    expect(pasteCallback).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    expect(undoCallback).toHaveBeenCalledTimes(1);
  });

  it('should work without options argument in useHotkeys', () => {
    render(
      <HotkeysComponent
        hotkeys={{ 'ctrl+c': copyCallback }}
        useDefaultOptions={true}
      />
    );
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(copyCallback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger any callback when disabled', () => {
    render(
      <HotkeysComponent hotkeys={{ 'ctrl+c': copyCallback }} enabled={false} />
    );
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(copyCallback).not.toHaveBeenCalled();
  });

  it('should not call other callbacks when one hotkey matches', () => {
    render(
      <HotkeysComponent
        hotkeys={{
          'ctrl+a': copyCallback,
          'ctrl+b': pasteCallback,
        }}
      />
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(copyCallback).toHaveBeenCalledTimes(1);
    expect(pasteCallback).not.toHaveBeenCalled();
  });

  it('should trigger catch-all hotkey for empty string key', () => {
    render(
      <HotkeysComponent
        hotkeys={{
          '': copyCallback,
        }}
      />
    );
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(copyCallback).toHaveBeenCalledTimes(2);
  });

  it('should call stopPropagation in useHotkeys', () => {
    render(
      <HotkeysComponent
        hotkeys={{ 'ctrl+c': copyCallback }}
        stopPropagation={true}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    fireEvent(document, event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should call stopPropagation for catch-all in useHotkeys', () => {
    render(
      <HotkeysComponent hotkeys={{ '': copyCallback }} stopPropagation={true} />
    );
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    fireEvent(document, event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should call preventDefault for catch-all in useHotkeys by default', () => {
    render(<HotkeysComponent hotkeys={{ '': copyCallback }} />);
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault for catch-all in useHotkeys when false', () => {
    render(
      <HotkeysComponent hotkeys={{ '': copyCallback }} preventDefault={false} />
    );
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should not call preventDefault in useHotkeys when false', () => {
    render(
      <HotkeysComponent
        hotkeys={{ 'ctrl+c': copyCallback }}
        preventDefault={false}
      />
    );
    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      cancelable: true,
    });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should not trigger callback for non-matching keys', () => {
    render(<HotkeysComponent hotkeys={{ 'ctrl+c': copyCallback }} />);
    fireEvent.keyDown(document, { key: 'x', ctrlKey: true });
    expect(copyCallback).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount for useHotkeys', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <HotkeysComponent hotkeys={{ 'ctrl+c': copyCallback }} />
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle single-key hotkeys (no + sign) in useHotkeys', () => {
    // Covers the `[keys]` branch when the hotkey string has no '+'
    render(<HotkeysComponent hotkeys={{ escape: copyCallback }} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(copyCallback).toHaveBeenCalledTimes(1);
  });

  it('should fire specific hotkey even when catch-all is defined first', () => {
    // Regression for Bug 1: catch-all must NOT intercept events that have a
    // specific matching hotkey, regardless of insertion order in the record.
    render(
      <HotkeysComponent
        hotkeys={{
          '': undoCallback, // catch-all defined first
          'ctrl+c': copyCallback,
        }}
      />
    );
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    expect(copyCallback).toHaveBeenCalledTimes(1);
    expect(undoCallback).not.toHaveBeenCalled();
  });

  it('should fire catch-all when no specific hotkey matches', () => {
    // Catch-all should still work as a fallback.
    render(
      <HotkeysComponent
        hotkeys={{
          'ctrl+c': copyCallback,
          '': undoCallback,
        }}
      />
    );
    // This key does not match 'ctrl+c', so the catch-all fires.
    fireEvent.keyDown(document, { key: 'x', ctrlKey: true });
    expect(copyCallback).not.toHaveBeenCalled();
    expect(undoCallback).toHaveBeenCalledTimes(1);
  });
});
