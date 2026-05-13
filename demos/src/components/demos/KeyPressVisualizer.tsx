import { useState, useEffect } from 'react';

interface KeyPress {
  id: number;
  key: string;
  timestamp: number;
}

export function KeyPressVisualizer() {
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('Ctrl');
      if (event.metaKey) modifiers.push('⌘');
      if (event.altKey) modifiers.push('Alt');
      if (event.shiftKey) modifiers.push('Shift');

      const mainKey = event.key === ' ' ? 'Space' : event.key;
      const keyCombo =
        modifiers.length > 0 ? `${modifiers.join('+')}+${mainKey}` : mainKey;

      const newKeyPress: KeyPress = {
        id: Date.now(),
        key: keyCombo,
        timestamp: Date.now(),
      };

      setKeyPresses((prev) => [newKeyPress, ...prev.slice(0, 9)]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        ⌨️ Key Press Visualizer
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Press any key to see it appear below. This visualizer shows all keyboard
        inputs in real-time.
      </p>

      <div className="bg-muted/50 rounded-lg p-4 min-h-48 max-h-64 overflow-y-auto">
        {keyPresses.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">⌨️</div>
              <p>Press any key to start</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {keyPresses.map((keyPress, index) => (
              <div
                key={keyPress.id}
                className={`flex items-center justify-between p-3 bg-card rounded-lg border border-border transition-all duration-300 ${
                  index === 0 ? 'ring-2 ring-ring scale-105' : ''
                }`}
                style={{
                  opacity: 1 - index * 0.1,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <kbd className="px-3 py-2 bg-muted border border-border rounded-lg font-mono text-sm font-bold shadow-sm text-foreground">
                    {keyPress.key}
                  </kbd>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(keyPress.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {keyPresses.length > 0 && (
        <button
          onClick={() => setKeyPresses([])}
          className="mt-4 w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
        >
          Clear History
        </button>
      )}
    </div>
  );
}
