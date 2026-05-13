import { useState } from 'react';
import { useHotkey } from '../../../../src/hooks/useHotkey';

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  // Global hotkey to open modal
  useHotkey(['ctrl', 'm'], () => setIsOpen(true), {
    enabled: !isOpen,
  });

  // Global hotkey to close modal when open
  useHotkey('escape', () => setIsOpen(false), {
    enabled: isOpen,
  });

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        🪟 Modal Controls
      </h2>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-muted-foreground">Keyboard shortcuts:</p>
        <div className="flex flex-wrap gap-2 items-center">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+M
          </kbd>
          <span className="text-muted-foreground text-sm">- Open modal</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Escape
          </kbd>
          <span className="text-muted-foreground text-sm">- Close modal</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div
            tabIndex={-1}
            className="bg-card rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">
                Modal Window
              </h3>
              <button
                title="Close modal"
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-muted-foreground mb-6">
              Press{' '}
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
                Escape
              </kbd>{' '}
              to close this modal, or click the button below.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
