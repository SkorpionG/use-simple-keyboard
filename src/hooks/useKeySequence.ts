import { useEffect, useCallback, useRef, useState } from 'react';
import {
  matchesHotkey,
  parseHotkey,
  createKeyInfo,
  type KeyEvent,
} from '../utils/keyUtils';
import type { HotkeyInput, HotkeyCallback } from '../types/keys';

export interface UseKeySequenceOptions {
  /**
   * Whether the key sequence should be enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether to prevent the default browser behavior when keys in the sequence are triggered
   * @default true
   */
  preventDefault?: boolean;

  /**
   * Whether to stop event propagation when keys in the sequence are triggered
   * @default false
   */
  stopPropagation?: boolean;

  /**
   * Target element to attach the event listener to
   * @default document
   */
  target?: HTMLElement | Document | Window | null;

  /**
   * Event type to listen for
   * @default 'keydown'
   */
  eventType?: 'keydown' | 'keyup';

  /**
   * Time in milliseconds to wait for the next key in the sequence
   * If exceeded, the sequence resets
   * @default 1000
   */
  timeout?: number;

  /**
   * Whether to reset the sequence after successful completion
   * @default true
   */
  resetOnComplete?: boolean;

  /**
   * Whether to allow partial matches to continue the sequence
   * If false, any non-matching key will reset the sequence
   * @default false
   */
  strict?: boolean;
}

export interface KeySequenceState {
  currentIndex: number;
  isActive: boolean;
  matchedKeys: string[];
  timeoutId: number | null;
}

/**
 * Hook for handling key sequences (e.g., Konami code, custom shortcuts)
 *
 * @param sequence - Array of keys/hotkey combinations that must be pressed in order
 * @param callback - Function to call when the sequence is completed
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // Simple sequence: up, up, down, down
 * useKeySequence(['arrowup', 'arrowup', 'arrowdown', 'arrowdown'], () => {
 *   console.log('Konami code entered!');
 * });
 *
 * // Mixed sequence with hotkeys
 * useKeySequence(['ctrl+c', 'ctrl+v', 'enter'], () => {
 *   console.log('Copy-paste-enter sequence!');
 * });
 *
 * // With options
 * useKeySequence(['a', 'b', 'c'], handleSequence, {
 *   timeout: 2000,
 *   strict: true,
 *   resetOnComplete: false
 * });
 * ```
 */
export const useKeySequence = (
  sequence: HotkeyInput[],
  callback: HotkeyCallback,
  options: UseKeySequenceOptions = {}
): KeySequenceState => {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== 'undefined' ? document : null,
    eventType = 'keydown',
    timeout = 1000,
    resetOnComplete = true,
    strict = false,
  } = options;

  const [state, setState] = useState<KeySequenceState>({
    currentIndex: 0,
    isActive: false,
    matchedKeys: [],
    timeoutId: null,
  });

  const sequenceRef = useRef<string[][]>([]);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Parse and normalize sequence
  useEffect(() => {
    sequenceRef.current = sequence.map((keys) => {
      if (Array.isArray(keys)) {
        return keys.map((key) => key.toLowerCase().trim());
      } else if (typeof keys === 'string' && keys.includes('+')) {
        return parseHotkey(keys);
      } else {
        return [keys.toString().toLowerCase().trim()];
      }
    });
  }, [sequence]);

  const resetSequence = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      currentIndex: 0,
      isActive: false,
      matchedKeys: [],
      timeoutId: null,
    }));
  }, []);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      resetSequence();
    }, timeout);

    setState((prev) => ({
      ...prev,
      timeoutId: timeoutRef.current,
    }));
  }, [timeout, resetSequence]);

  const handleKeyEvent = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || sequenceRef.current.length === 0) return;

      const keyInfo = createKeyInfo(event);
      const keyEvent: KeyEvent = {
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
      };

      setState((prevState) => {
        const { currentIndex } = prevState;
        const expectedKeys = sequenceRef.current[currentIndex];

        if (!expectedKeys) {
          return prevState;
        }

        // Check if current key matches the expected key in sequence
        const isMatch = matchesHotkey(keyEvent, expectedKeys);

        if (isMatch) {
          const newIndex = currentIndex + 1;
          const newMatchedKeys = [
            ...prevState.matchedKeys,
            keyInfo.combination,
          ];

          // Prevent default and stop propagation if configured
          if (preventDefault) {
            event.preventDefault();
          }

          if (stopPropagation) {
            event.stopPropagation();
          }

          // Check if sequence is complete
          if (newIndex >= sequenceRef.current.length) {
            // Sequence completed!
            callbackRef.current(event, keyInfo);

            // Clear timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            // Reset or keep sequence based on options
            if (resetOnComplete) {
              return {
                currentIndex: 0,
                isActive: false,
                matchedKeys: [],
                timeoutId: null,
              };
            } else {
              return {
                currentIndex: newIndex,
                isActive: true,
                matchedKeys: newMatchedKeys,
                timeoutId: null,
              };
            }
          } else {
            // Continue sequence
            startTimeout();

            return {
              currentIndex: newIndex,
              isActive: true,
              matchedKeys: newMatchedKeys,
              timeoutId: timeoutRef.current,
            };
          }
        } else {
          // Key doesn't match
          if (strict || currentIndex === 0) {
            // Reset sequence in strict mode or if no progress made
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            return {
              currentIndex: 0,
              isActive: false,
              matchedKeys: [],
              timeoutId: null,
            };
          } else {
            // In non-strict mode, just continue without resetting
            return prevState;
          }
        }
      });
    },
    [
      enabled,
      preventDefault,
      stopPropagation,
      startTimeout,
      strict,
      resetOnComplete,
    ]
  );

  useEffect(() => {
    if (!target || !enabled) return;

    const element = target as EventTarget;
    element.addEventListener(eventType, handleKeyEvent as EventListener);

    return () => {
      element.removeEventListener(eventType, handleKeyEvent as EventListener);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [target, enabled, eventType, handleKeyEvent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return state;
};
