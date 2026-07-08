export type KeyboardEventTarget = HTMLElement | Document | Window | null;

export const getDefaultTarget = (): Document | null =>
  /* istanbul ignore next -- SSR fallback is not reachable in the jsdom test environment */
  typeof document !== 'undefined' ? document : null;
