import { useState } from 'react';
import { useHotkeys } from '../../../../src/hooks/useHotkey';

export function TextEditorDemo() {
  const [content, setContent] = useState(
    'Type something and try the hotkeys...'
  );
  const [history, setHistory] = useState<string[]>([
    'Type something and try the hotkeys...',
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string>('');

  const save = () => {
    setLastAction('💾 Content saved!');
    setTimeout(() => setLastAction(''), 2000);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setLastAction('↶ Undo');
      setTimeout(() => setLastAction(''), 2000);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      setLastAction('↷ Redo');
      setTimeout(() => setLastAction(''), 2000);
    }
  };

  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Global hotkeys for the editor
  useHotkeys({
    'ctrl+s': save,
    'meta+s': save,
    'ctrl+z': undo,
    'meta+z': undo,
    'ctrl+y': redo,
    'ctrl+shift+z': redo,
    'meta+shift+z': redo,
  });

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        📝 Text Editor
      </h2>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-muted-foreground">Try these hotkeys:</p>
        <div className="flex flex-wrap gap-2">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+S
          </kbd>
          <span className="text-muted-foreground">or</span>
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            ⌘+S
          </kbd>
          <span className="text-muted-foreground text-sm">- Save</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+Z
          </kbd>
          <span className="text-muted-foreground">or</span>
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            ⌘+Z
          </kbd>
          <span className="text-muted-foreground text-sm">- Undo</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+Y
          </kbd>
          <span className="text-muted-foreground">or</span>
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+Shift+Z
          </kbd>
          <span className="text-muted-foreground text-sm">- Redo</span>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          addToHistory(e.target.value);
        }}
        className="w-full h-48 p-4 border border-border rounded-lg font-mono text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        placeholder="Start typing..."
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          History: {historyIndex + 1} / {history.length}
        </div>
        {lastAction && (
          <div className="text-green-600 dark:text-green-400 font-medium animate-pulse">
            {lastAction}
          </div>
        )}
      </div>
    </div>
  );
}
