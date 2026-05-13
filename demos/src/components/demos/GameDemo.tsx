import { useState } from 'react';
import { useHotkey } from '../../../../src/hooks/useHotkey';

export function GameDemo() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // Game controls
  useHotkey('space', () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setScore(0);
    }
  });

  // Movement (only when playing)
  useHotkey(
    'w',
    () => {
      setPosition((prev) => {
        const newY = Math.max(0, prev.y - 5);
        if (newY !== prev.y) setScore((s) => s + 1);
        return { ...prev, y: newY };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    's',
    () => {
      setPosition((prev) => {
        const newY = Math.min(90, prev.y + 5);
        if (newY !== prev.y) setScore((s) => s + 1);
        return { ...prev, y: newY };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'a',
    () => {
      setPosition((prev) => {
        const newX = Math.max(0, prev.x - 5);
        if (newX !== prev.x) setScore((s) => s + 1);
        return { ...prev, x: newX };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'd',
    () => {
      setPosition((prev) => {
        const newX = Math.min(90, prev.x + 5);
        if (newX !== prev.x) setScore((s) => s + 1);
        return { ...prev, x: newX };
      });
    },
    { enabled: isPlaying }
  );

  // Arrow keys as alternative
  useHotkey(
    'arrowup',
    () => {
      setPosition((prev) => {
        const newY = Math.max(0, prev.y - 5);
        if (newY !== prev.y) setScore((s) => s + 1);
        return { ...prev, y: newY };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'arrowdown',
    () => {
      setPosition((prev) => {
        const newY = Math.min(90, prev.y + 5);
        if (newY !== prev.y) setScore((s) => s + 1);
        return { ...prev, y: newY };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'arrowleft',
    () => {
      setPosition((prev) => {
        const newX = Math.max(0, prev.x - 5);
        if (newX !== prev.x) setScore((s) => s + 1);
        return { ...prev, x: newX };
      });
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'arrowright',
    () => {
      setPosition((prev) => {
        const newX = Math.min(90, prev.x + 5);
        if (newX !== prev.x) setScore((s) => s + 1);
        return { ...prev, x: newX };
      });
    },
    { enabled: isPlaying }
  );

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        🎮 Game Controls
      </h2>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Press{' '}
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Space
          </kbd>{' '}
          to {isPlaying ? 'pause' : 'start'}
        </p>
        {isPlaying && (
          <div className="flex flex-wrap gap-2 items-center">
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
              W A S D
            </kbd>
            <span className="text-muted-foreground">or</span>
            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
              ↑ ← ↓ →
            </kbd>
            <span className="text-muted-foreground text-sm">- Move</span>
          </div>
        )}
      </div>

      <div className="relative w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-border overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-white font-bold text-lg">
                Press Space to Start
              </p>
            </div>
          </div>
        )}

        <div
          className={`absolute w-8 h-8 rounded-full transition-all duration-100 ${
            isPlaying ? 'bg-primary shadow-lg' : 'bg-muted-foreground'
          }`}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-ping" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          Position: ({Math.round(position.x)}, {Math.round(position.y)})
        </div>
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground">
            Score: <span className="font-bold text-primary">{score}</span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isPlaying
                ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isPlaying ? '▶ Playing' : '⏸ Paused'}
          </div>
        </div>
      </div>
    </div>
  );
}
