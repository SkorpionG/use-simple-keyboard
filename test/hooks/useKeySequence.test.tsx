import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useKeySequence } from '../../src/hooks/useKeySequence';
import { HotkeyInput } from '../../src/types/keys';

// Test component for useKeySequence
const TestUseKeySequence: React.FC<{
  sequence: HotkeyInput[];
  callback: () => void;
  enabled?: boolean;
  timeout?: number;
  strict?: boolean;
  resetOnComplete?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  eventType?: 'keydown' | 'keyup';
  target?: HTMLElement | Document | Window | null;
  useDefaultOptions?: boolean;
}> = ({
  sequence,
  callback,
  enabled,
  timeout,
  strict,
  resetOnComplete,
  preventDefault,
  stopPropagation,
  eventType,
  target,
  useDefaultOptions = false,
}) => {
  // Build options without undefined values so hook defaults are not overridden
  const options = useDefaultOptions
    ? undefined
    : Object.fromEntries(
        Object.entries({
          enabled,
          timeout,
          strict,
          resetOnComplete,
          preventDefault,
          stopPropagation,
          eventType,
          target,
        }).filter(([, v]) => v !== undefined)
      );

  const state = useKeySequence(sequence, callback, options);

  return (
    <div data-testid="test-component">
      <div data-testid="current-index">{state.currentIndex}</div>
      <div data-testid="is-active">{state.isActive.toString()}</div>
      <div data-testid="matched-keys">{state.matchedKeys.join(',')}</div>
    </div>
  );
};

describe('useKeySequence', () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should trigger callback when sequence is completed', () => {
    render(
      <TestUseKeySequence sequence={['a', 'b', 'c']} callback={mockCallback} />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    fireEvent.keyDown(document, { key: 'c' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should work without options argument', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        useDefaultOptions={true}
      />
    );
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger callback for incomplete sequence', () => {
    render(
      <TestUseKeySequence sequence={['a', 'b', 'c']} callback={mockCallback} />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not attach listener when target is null', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    render(
      <TestUseKeySequence
        sequence={['a']}
        callback={mockCallback}
        target={null}
      />
    );
    fireEvent.keyDown(window, { key: 'a' });
    expect(mockCallback).not.toHaveBeenCalled();
    addEventListenerSpy.mockRestore();
  });

  it('should track current index correctly', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        resetOnComplete={false}
      />
    );

    expect(getByTestId('current-index')).toHaveTextContent('0');

    fireEvent.keyDown(document, { key: 'a' });
    expect(getByTestId('current-index')).toHaveTextContent('1');

    fireEvent.keyDown(document, { key: 'b' });
    expect(getByTestId('current-index')).toHaveTextContent('2');

    // After completion with resetOnComplete=false, currentIndex resets to 0
    // so the sequence can be re-triggered.
    fireEvent.keyDown(document, { key: 'c' });
    expect(getByTestId('current-index')).toHaveTextContent('0');
  });

  it('should track matched keys correctly', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        resetOnComplete={false}
      />
    );

    expect(getByTestId('matched-keys')).toHaveTextContent('');

    fireEvent.keyDown(document, { key: 'a' });
    expect(getByTestId('matched-keys')).toHaveTextContent('a');

    fireEvent.keyDown(document, { key: 'b' });
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b');

    fireEvent.keyDown(document, { key: 'c' });
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b,c');
  });

  it('should reset sequence on timeout', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        timeout={1000}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId('matched-keys')).toHaveTextContent('');
    expect(getByTestId('current-index')).toHaveTextContent('0');
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle strict mode correctly - reset on wrong key', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        strict={true}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    expect(getByTestId('matched-keys')).toHaveTextContent('a');

    fireEvent.keyDown(document, { key: 'x' }); // Wrong key in strict mode
    expect(getByTestId('matched-keys')).toHaveTextContent('');
    expect(getByTestId('current-index')).toHaveTextContent('0');

    fireEvent.keyDown(document, { key: 'b' });
    fireEvent.keyDown(document, { key: 'c' });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle non-strict mode correctly - ignore wrong keys', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        strict={false}
        resetOnComplete={false}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'x' }); // Wrong key in non-strict mode
    fireEvent.keyDown(document, { key: 'b' });
    fireEvent.keyDown(document, { key: 'c' });

    expect(getByTestId('matched-keys')).toHaveTextContent('a,b,c');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should respect enabled option', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        enabled={false}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });

    expect(getByTestId('matched-keys')).toHaveTextContent('');
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call stopPropagation and preventDefault in useKeySequence', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        stopPropagation={true}
        preventDefault={true}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should listen on keyup when eventType is keyup in useKeySequence', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        eventType="keyup"
      />
    );
    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).not.toHaveBeenCalled();

    fireEvent.keyUp(document, { key: 'a' });
    fireEvent.keyUp(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener on unmount in useKeySequence', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <TestUseKeySequence sequence={['a']} callback={mockCallback} />
    );
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
    removeEventListenerSpy.mockRestore();
  });

  it('should reset on complete when resetOnComplete is true', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        resetOnComplete={true}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(getByTestId('matched-keys')).toHaveTextContent('');
    expect(getByTestId('current-index')).toHaveTextContent('0');
  });

  it('should not reset matchedKeys on complete when resetOnComplete is false', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        resetOnComplete={false}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    // matchedKeys are preserved for history
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b');
    // But currentIndex resets to 0 so the sequence can be re-entered
    expect(getByTestId('current-index')).toHaveTextContent('0');
  });

  it('should allow re-triggering when resetOnComplete is false', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        resetOnComplete={false}
      />
    );

    // First completion
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Re-entering the sequence should fire the callback again
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should handle single key sequence', () => {
    render(<TestUseKeySequence sequence={['a']} callback={mockCallback} />);

    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle empty sequence gracefully', () => {
    render(<TestUseKeySequence sequence={[]} callback={mockCallback} />);

    fireEvent.keyDown(document, { key: 'a' });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle array of keys in sequence', () => {
    render(
      <TestUseKeySequence
        sequence={[['ctrl', 'c'], 'v']}
        callback={mockCallback}
      />
    );

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'v' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle mixed sequence with hotkey strings', () => {
    render(
      <TestUseKeySequence sequence={['ctrl+c', 'v']} callback={mockCallback} />
    );

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'v' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle special keys in sequence', () => {
    render(
      <TestUseKeySequence
        sequence={['Space', 'Enter', 'Escape']}
        callback={mockCallback}
      />
    );

    fireEvent.keyDown(document, { key: ' ' });
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle arrow keys in sequence', () => {
    render(
      <TestUseKeySequence
        sequence={['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown']}
        callback={mockCallback}
      />
    );

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle repeated keys in sequence', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'a', 'a']}
        callback={mockCallback}
        resetOnComplete={false}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'a' });

    expect(getByTestId('matched-keys')).toHaveTextContent('a,a,a');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should clean up timers on unmount', () => {
    const { unmount } = render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        timeout={1000}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should handle case insensitive keys', () => {
    render(
      <TestUseKeySequence sequence={['a', 'b', 'c']} callback={mockCallback} />
    );

    fireEvent.keyDown(document, { key: 'A' });
    fireEvent.keyDown(document, { key: 'B' });
    fireEvent.keyDown(document, { key: 'C' });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should update isActive state correctly', () => {
    const { getByTestId } = render(
      <TestUseKeySequence sequence={['a', 'b', 'c']} callback={mockCallback} />
    );

    expect(getByTestId('is-active')).toHaveTextContent('false');

    fireEvent.keyDown(document, { key: 'a' });
    expect(getByTestId('is-active')).toHaveTextContent('true');

    fireEvent.keyDown(document, { key: 'b' });
    expect(getByTestId('is-active')).toHaveTextContent('true');

    fireEvent.keyDown(document, { key: 'c' });
    // After completion with resetOnComplete=true (default), should be false
    expect(getByTestId('is-active')).toHaveTextContent('false');
  });

  it('should restart timeout on each key press', () => {
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        timeout={1000}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.keyDown(document, { key: 'b' });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should not have timed out yet because timer restarted
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b');

    fireEvent.keyDown(document, { key: 'c' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call preventDefault when false during a sequence match', () => {
    // Gap F: covers the `if (preventDefault)` false-branch during a match
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        preventDefault={false}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    fireEvent(document, event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should not call stopPropagation when false during a sequence match', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        stopPropagation={false}
      />
    );
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    fireEvent(document, event);
    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });

  it('should work with window as target', () => {
    render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        target={window}
      />
    );
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should re-attach listener when enabled changes from false to true', () => {
    const { getByTestId, rerender } = render(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        enabled={false}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).not.toHaveBeenCalled();
    expect(getByTestId('matched-keys')).toHaveTextContent('');

    rerender(
      <TestUseKeySequence
        sequence={['a', 'b']}
        callback={mockCallback}
        enabled={true}
      />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should reset on wrong key at index 0 even in non-strict mode', () => {
    // In non-strict mode, a wrong key at currentIndex===0 still resets
    // (because `strict || currentIndex === 0` is true).
    const { getByTestId } = render(
      <TestUseKeySequence
        sequence={['a', 'b', 'c']}
        callback={mockCallback}
        strict={false}
      />
    );

    // Press wrong key before any progress has been made (index 0)
    fireEvent.keyDown(document, { key: 'x' });
    expect(getByTestId('current-index')).toHaveTextContent('0');
    expect(getByTestId('matched-keys')).toHaveTextContent('');

    // Sequence should still work from the beginning
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });
    fireEvent.keyDown(document, { key: 'c' });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
