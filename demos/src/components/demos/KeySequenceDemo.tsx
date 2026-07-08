import { useState } from 'react';
import { useKeySequence } from '../../../../src/hooks/useKeySequence';

const sequences = [
  {
    id: 'konami',
    name: 'Konami Code',
    keys: [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ],
    description: '↑ ↑ ↓ ↓ ← → ← → B A',
    reward: '🎮 30 Lives Unlocked!',
  },
  {
    id: 'secret',
    name: 'Secret Code',
    keys: ['s', 'e', 'c', 'r', 'e', 't'],
    description: 'S E C R E T',
    reward: '🔓 Secret Feature Activated!',
  },
  {
    id: 'hotkey',
    name: 'Hotkey Sequence',
    keys: ['ctrl+c', 'ctrl+v', 'enter'],
    description: 'Ctrl+C → Ctrl+V → Enter',
    reward: '📋 Copy-Paste Master!',
  },
  {
    id: 'quick',
    name: 'Quick Sequence',
    keys: ['q', 'u', 'i', 'c', 'k'],
    description: 'Q U I C K',
    reward: '⚡ Speed Demon!',
  },
];

export function KeySequenceDemo() {
  const [completedSequences, setCompletedSequences] = useState<string[]>([]);
  const [lastCompleted, setLastCompleted] = useState<string>('');
  const [showReward, setShowReward] = useState(false);

  const handleSequenceComplete = (sequence: (typeof sequences)[0]) => {
    if (!completedSequences.includes(sequence.id)) {
      setCompletedSequences((prev) => [...prev, sequence.id]);
    }
    setLastCompleted(sequence.reward);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  // Track each sequence
  const konamiState = useKeySequence(
    sequences[0].keys,
    () => handleSequenceComplete(sequences[0]),
    { timeout: 2000, resetOnComplete: true }
  );

  const secretState = useKeySequence(
    sequences[1].keys,
    () => handleSequenceComplete(sequences[1]),
    { timeout: 1500, resetOnComplete: true }
  );

  const hotkeyState = useKeySequence(
    sequences[2].keys,
    () => handleSequenceComplete(sequences[2]),
    { timeout: 3000, resetOnComplete: true }
  );

  const quickState = useKeySequence(
    sequences[3].keys,
    () => handleSequenceComplete(sequences[3]),
    { timeout: 800, resetOnComplete: true, strict: true }
  );

  const states = [konamiState, secretState, hotkeyState, quickState];

  const getProgress = (sequenceIndex: number) => {
    const state = states[sequenceIndex];
    const sequence = sequences[sequenceIndex];
    return {
      current: state.currentIndex,
      total: sequence.keys.length,
      percentage: (state.currentIndex / sequence.keys.length) * 100,
      isActive: state.isActive,
    };
  };

  const renderKeySequence = (
    keys: string[],
    currentIndex: number,
    isActive: boolean
  ) => {
    return keys.map((key, index) => {
      let displayKey: string;

      // Format display for special keys
      if (key.startsWith('arrow')) {
        const arrows = {
          arrowup: '↑',
          arrowdown: '↓',
          arrowleft: '←',
          arrowright: '→',
        };
        displayKey = arrows[key as keyof typeof arrows] || key;
      } else if (key.includes('+')) {
        displayKey = key.replace('ctrl', 'Ctrl').replace('meta', '⌘');
      } else {
        displayKey = key.toUpperCase();
      }

      const isCompleted = index < currentIndex;
      const isCurrent = index === currentIndex && isActive;

      return (
        <kbd
          key={index}
          className={`
            inline-block px-2 py-1 mx-1 text-xs font-mono rounded border transition-all duration-200
            ${
              isCompleted
                ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                : isCurrent
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 animate-pulse'
                  : 'bg-muted border-border text-muted-foreground'
            }
          `}
        >
          {displayKey}
        </kbd>
      );
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        🔢 Key Sequences
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">
          Try entering these key sequences to unlock rewards:
        </p>
        <div className="text-xs text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded mr-2"></span>
          Completed
          <span className="inline-block w-3 h-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded mr-2 ml-4 animate-pulse"></span>
          Current
          <span className="inline-block w-3 h-3 bg-muted border border-border rounded mr-2 ml-4"></span>
          Pending
        </div>
      </div>

      {/* Reward Display */}
      {showReward && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-bold text-yellow-800 dark:text-yellow-200">
              {lastCompleted}
            </p>
          </div>
        </div>
      )}

      {/* Sequences */}
      <div className="space-y-6">
        {sequences.map((sequence, index) => {
          const progress = getProgress(index);
          const isCompleted = completedSequences.includes(sequence.id);

          return (
            <div
              key={sequence.id}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : progress.isActive
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                      : 'bg-muted/30 border-border'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">
                    {sequence.name}
                  </h3>
                  {isCompleted && (
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {progress.current}/{progress.total}
                </div>
              </div>

              <div className="mb-3">
                {renderKeySequence(
                  sequence.keys,
                  progress.current,
                  progress.isActive
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {sequence.description}
                </p>
                <div className="w-24 bg-muted rounded-full h-2">
                  <div
                    className={`
                      h-2 rounded-full transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-green-500'
                          : progress.isActive
                            ? 'bg-blue-500'
                            : 'bg-muted-foreground/30'
                      }
                    `}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Sequences Completed: {completedSequences.length}/{sequences.length}
          </span>
          {completedSequences.length === sequences.length && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              🏆 Sequence Master!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
