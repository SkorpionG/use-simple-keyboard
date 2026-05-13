import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useKeySequence } from '../../src/hooks/useKeySequence';

// Test component for useKeySequence
const TestUseKeySequence: React.FC<{
  sequence: string[];
  callback: () => void;
  enabled?: boolean;
  timeout?: number;
  strict?: boolean;
  resetOnComplete?: boolean;
}> = ({ sequence, callback, enabled, timeout, strict, resetOnComplete }) => {
  const state = useKeySequence(sequence, callback, {
    enabled,
    timeout,
    strict,
    resetOnComplete,
  });

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

  it('should not trigger callback for incomplete sequence', () => {
    render(
      <TestUseKeySequence sequence={['a', 'b', 'c']} callback={mockCallback} />
    );

    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'b' });

    expect(mockCallback).not.toHaveBeenCalled();
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

    fireEvent.keyDown(document, { key: 'c' });
    expect(getByTestId('current-index')).toHaveTextContent('3');
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

  it('should not reset on complete when resetOnComplete is false', () => {
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
    expect(getByTestId('matched-keys')).toHaveTextContent('a,b');
    expect(getByTestId('current-index')).toHaveTextContent('2');
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
});
