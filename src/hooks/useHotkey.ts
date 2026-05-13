import { useEffect, useCallback, useRef } from 'react';
import {
  matchesHotkey,
  parseHotkey,
  createKeyInfo,
  type KeyEvent,
} from '../utils/keyUtils';
import type { HotkeyInput, HotkeysRecord, HotkeyCallback } from '../types/keys';

export interface UseHotkeyOptions {
  /**
   * Whether the hotkey should be enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether to prevent the default browser behavior when the hotkey is triggered
   * @default true
   */
  preventDefault?: boolean;

  /**
   * Whether to stop event propagation when the hotkey is triggered
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
  eventType?: 'keydown' | 'keyup' | 'keypress';
}

/**
 * React hook for handling keyboard shortcuts/hotkeys
 *
 * @param keys - Array of keys that should be pressed to trigger the callback
 * @param callback - Function to execute when the hotkey is pressed
 * @param options - Additional options for the hotkey behavior
 *
 * @example
 * ```tsx
 * // Simple hotkey
 * useHotkey(['ctrl', 'c'], () => console.log('Copy!'));
 *
 * // Multiple key combination
 * useHotkey(['ctrl', 'shift', 'z'], () => console.log('Redo!'));
 *
 * // Platform-specific (cmd on Mac, ctrl on others)
 * useHotkey(['meta', 's'], () => console.log('Save!'));
 *
 * // With options
 * useHotkey(['escape'], handleEscape, {
 *   preventDefault: false,
 *   enabled: isModalOpen
 * });
 * ```
 */
export const useHotkey = (
  keys: HotkeyInput,
  callback: HotkeyCallback,
  options: UseHotkeyOptions = {}
): void => {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== 'undefined' ? document : null,
    eventType = 'keydown',
  } = options;

  // Convert keys to array and normalize
  const normalizedKeys = useRef<string[]>([]);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Parse and normalize keys
  useEffect(() => {
    const keyArray = Array.isArray(keys) ? keys : [keys];

    // Handle empty string for all keys
    if (keyArray.length === 1 && keyArray[0] === '') {
      normalizedKeys.current = [''];
    }
    // If it's a single string with '+', parse it as a hotkey combination
    else if (keyArray.length === 1 && keyArray[0].includes('+')) {
      normalizedKeys.current = parseHotkey(keyArray[0]);
    } else {
      normalizedKeys.current = keyArray.map((key) => key.toLowerCase().trim());
    }
  }, [keys]);

  const handleKeyEvent = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keyInfo = createKeyInfo(event);

      // Check if this is a catch-all listener (empty string)
      const isCatchAll =
        normalizedKeys.current.length === 1 && normalizedKeys.current[0] === '';

      if (isCatchAll) {
        // Trigger for all key presses
        if (preventDefault) {
          event.preventDefault();
        }

        if (stopPropagation) {
          event.stopPropagation();
        }

        callbackRef.current(event, keyInfo);
      } else {
        // Normal hotkey matching
        const keyEvent: KeyEvent = {
          key: event.key,
          code: event.code,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
        };

        if (matchesHotkey(keyEvent, normalizedKeys.current)) {
          if (preventDefault) {
            event.preventDefault();
          }

          if (stopPropagation) {
            event.stopPropagation();
          }

          callbackRef.current(event, keyInfo);
        }
      }
    },
    [enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (!target || !enabled) return;

    const element = target as EventTarget;
    element.addEventListener(eventType, handleKeyEvent as EventListener);

    return () => {
      element.removeEventListener(eventType, handleKeyEvent as EventListener);
    };
  }, [target, enabled, eventType, handleKeyEvent]);
};

/**
 * Hook for handling multiple hotkeys at once
 *
 * @param hotkeys - Object mapping hotkey combinations to their callbacks
 * @param options - Global options applied to all hotkeys
 *
 * @example
 * ```tsx
 * useHotkeys({
 *   'ctrl+c': () => copy(),
 *   'ctrl+v': () => paste(),
 *   'ctrl+z': () => undo(),
 *   'ctrl+shift+z': () => redo(),
 *   'escape': () => closeModal()
 * });
 * ```
 */
export const useHotkeys = (
  hotkeys: HotkeysRecord,
  options: UseHotkeyOptions = {}
): void => {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== 'undefined' ? document : null,
    eventType = 'keydown',
  } = options;

  const hotkeysRef = useRef(hotkeys);

  // Update hotkeys ref when hotkeys change
  useEffect(() => {
    hotkeysRef.current = hotkeys;
  }, [hotkeys]);

  const handleKeyEvent = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keyInfo = createKeyInfo(event);
      const keyEvent: KeyEvent = {
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
      };

      // Check each hotkey combination
      for (const [keys, callback] of Object.entries(hotkeysRef.current)) {
        // Handle empty string for catch-all
        if (keys === '') {
          if (preventDefault) {
            event.preventDefault();
          }

          if (stopPropagation) {
            event.stopPropagation();
          }

          callback(event, keyInfo);
          break; // Only trigger the first matching hotkey
        } else {
          const keyArray = keys.includes('+') ? parseHotkey(keys) : [keys];

          if (matchesHotkey(keyEvent, keyArray)) {
            if (preventDefault) {
              event.preventDefault();
            }

            if (stopPropagation) {
              event.stopPropagation();
            }

            callback(event, keyInfo);
            break; // Only trigger the first matching hotkey
          }
        }
      }
    },
    [enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (!target || !enabled) return;

    const element = target as EventTarget;
    element.addEventListener(eventType, handleKeyEvent as EventListener);

    return () => {
      element.removeEventListener(eventType, handleKeyEvent as EventListener);
    };
  }, [target, enabled, eventType, handleKeyEvent]);
};

export default useHotkey;
