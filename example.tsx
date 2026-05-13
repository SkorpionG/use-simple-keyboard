import React, { useState, useRef } from 'react';
import { useHotkey, useHotkeys } from './src';

// Example 1: Basic Text Editor with Hotkeys
function TextEditor() {
  const [content, setContent] = useState(
    'Type something and try the hotkeys...'
  );
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const save = () => {
    console.log('Saving content:', content);
    alert('Content saved!');
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
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
    'meta+s': save, // Mac support
    'ctrl+z': undo,
    'meta+z': undo, // Mac support
    'ctrl+y': redo,
    'ctrl+shift+z': redo,
    'meta+shift+z': redo, // Mac support
  });

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Text Editor Example</h2>
      <p>Try these hotkeys:</p>
      <ul>
        <li>
          <kbd>Ctrl+S</kbd> (or <kbd>Cmd+S</kbd> on Mac) - Save
        </li>
        <li>
          <kbd>Ctrl+Z</kbd> (or <kbd>Cmd+Z</kbd> on Mac) - Undo
        </li>
        <li>
          <kbd>Ctrl+Y</kbd> or <kbd>Ctrl+Shift+Z</kbd> - Redo
        </li>
      </ul>

      <textarea
        title="Text Editor"
        placeholder="Type something and try the hotkeys..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          addToHistory(e.target.value);
        }}
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      />

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        History: {historyIndex + 1} / {history.length}
      </div>
    </div>
  );
}

// Example 2: Modal with Escape Key
function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Global hotkey to open modal
  useHotkey(['ctrl', 'm'], () => setIsOpen(true), {
    enabled: !isOpen,
  });

  // Scoped hotkey to close modal (only when modal is focused)
  useHotkey('escape', () => setIsOpen(false), {
    enabled: isOpen,
    target: modalRef.current,
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Modal Example</h2>
      <p>
        Press <kbd>Ctrl+M</kbd> to open modal, <kbd>Escape</kbd> to close
      </p>

      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              minWidth: '300px',
              outline: 'none',
            }}
          >
            <h3>Modal Content</h3>
            <p>
              Press <kbd>Escape</kbd> to close this modal
            </p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 3: Navigation Hotkeys
function NavigationExample() {
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = ['Home', 'About', 'Services', 'Contact'];

  // Number key navigation
  useHotkey(['ctrl', '1'], () => setCurrentTab(0));
  useHotkey(['ctrl', '2'], () => setCurrentTab(1));
  useHotkey(['ctrl', '3'], () => setCurrentTab(2));
  useHotkey(['ctrl', '4'], () => setCurrentTab(3));

  // Arrow key navigation
  useHotkey('arrowleft', () => {
    setCurrentTab((prev) => (prev > 0 ? prev - 1 : tabs.length - 1));
  });

  useHotkey('arrowright', () => {
    setCurrentTab((prev) => (prev < tabs.length - 1 ? prev + 1 : 0));
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Navigation Example</h2>
      <p>
        Use <kbd>Ctrl+1-4</kbd> or <kbd>←</kbd>/<kbd>→</kbd> arrow keys to
        navigate
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(index)}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTab === index ? '#007bff' : '#f8f9fa',
              color: currentTab === index ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {tab} ({index + 1})
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          minHeight: '100px',
        }}
      >
        <h3>{tabs[currentTab]} Content</h3>
        <p>This is the content for the {tabs[currentTab]} tab.</p>
      </div>
    </div>
  );
}

// Example 4: Game Controls
function GameExample() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Game controls
  useHotkey('space', () => setIsPlaying(!isPlaying));

  // Movement (only when playing)
  useHotkey(
    'w',
    () => {
      setPosition((prev) => ({ ...prev, y: Math.max(0, prev.y - 10) }));
    },
    { enabled: isPlaying }
  );

  useHotkey(
    's',
    () => {
      setPosition((prev) => ({ ...prev, y: Math.min(90, prev.y + 10) }));
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'a',
    () => {
      setPosition((prev) => ({ ...prev, x: Math.max(0, prev.x - 10) }));
    },
    { enabled: isPlaying }
  );

  useHotkey(
    'd',
    () => {
      setPosition((prev) => ({ ...prev, x: Math.min(90, prev.x + 10) }));
    },
    { enabled: isPlaying }
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Game Controls Example</h2>
      <p>
        Press <kbd>Space</kbd> to {isPlaying ? 'pause' : 'start'}
      </p>
      {isPlaying && (
        <p>
          Use <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> to move
        </p>
      )}

      <div
        style={{
          position: 'relative',
          width: '400px',
          height: '300px',
          backgroundColor: '#f0f0f0',
          border: '2px solid #333',
          margin: '20px 0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            width: '20px',
            height: '20px',
            backgroundColor: isPlaying ? '#007bff' : '#6c757d',
            borderRadius: '50%',
            transition: 'all 0.1s ease',
          }}
        />
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        Position: ({Math.round(position.x)}, {Math.round(position.y)}) | Status:{' '}
        {isPlaying ? 'Playing' : 'Paused'}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', padding: '20px' }}>
        useSimpleKeyboard Hook Examples
      </h1>

      <TextEditor />
      <hr style={{ margin: '40px 20px' }} />

      <ModalExample />
      <hr style={{ margin: '40px 20px' }} />

      <NavigationExample />
      <hr style={{ margin: '40px 20px' }} />

      <GameExample />
    </div>
  );
}
