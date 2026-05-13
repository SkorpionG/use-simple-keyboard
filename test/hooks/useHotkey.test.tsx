import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useHotkey, useHotkeys } from '../../src/hooks/useHotkey';

// ─── useHotkey ────────────────────────────────────────────────────────────────

const HotkeyComponent: React.FC<{
  keys: string | string[];
  callback: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  eventType?: 'keydown' | 'keyup' | 'keypress';
}> = ({
  keys,
  callback,
  enabled = true,
  preventDefault,
  stopPropagation,
  eventType,
}) => {
  useHotkey(keys, callback, {
    enabled,
    preventDefault,
    stopPropagation,
    eventType,
  });
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

  it('should not trigger callback when wrong key is pressed', () => {
    render(<HotkeyComponent keys="ctrl+a" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not trigger when modifier does not match', () => {
    render(<HotkeyComponent keys="ctrl+a" callback={mockCallback} />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: false });
    expect(mockCallback).not.toHaveBeenCalled();
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
});

// ─── useHotkeys ───────────────────────────────────────────────────────────────

const HotkeysComponent: React.FC<{
  hotkeys: Record<string, () => void>;
  enabled?: boolean;
}> = ({ hotkeys, enabled }) => {
  useHotkeys(hotkeys, { enabled });
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

  it('should not trigger callback for non-matching keys', () => {
    render(<HotkeysComponent hotkeys={{ 'ctrl+c': copyCallback }} />);
    fireEvent.keyDown(document, { key: 'x', ctrlKey: true });
    expect(copyCallback).not.toHaveBeenCalled();
  });
});
