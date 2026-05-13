import { CodeExample } from './CodeExample';

const singleHotkeyCode = `import { useHotkey } from 'use-simple-keyboard';

function MyComponent() {
  useHotkey(['ctrl', 's'], () => {
    console.log('Save triggered!');
  });
  
  return <div>Press Ctrl+S</div>;
}`;

const multipleHotkeysCode = `import { useHotkeys } from 'use-simple-keyboard';

function MyComponent() {
  useHotkeys({
    'ctrl+c': () => copy(),
    'ctrl+v': () => paste(),
    'ctrl+z': () => undo(),
    'escape': () => closeModal()
  });
  
  return <div>Try the shortcuts!</div>;
}`;

export function CodeExamplesSection() {
  return (
    <section className="mt-12 bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        💻 Quick Start
      </h2>
      <div className="space-y-4">
        <CodeExample title="Single Hotkey" code={singleHotkeyCode} />
        <CodeExample title="Multiple Hotkeys" code={multipleHotkeysCode} />
      </div>
    </section>
  );
}
