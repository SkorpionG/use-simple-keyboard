import { TextEditorDemo } from './components/demos/TextEditorDemo';
import { ModalDemo } from './components/demos/ModalDemo';
import { NavigationDemo } from './components/demos/NavigationDemo';
import { GameDemo } from './components/demos/GameDemo';
import { KeyPressVisualizer } from './components/demos/KeyPressVisualizer';
import { KeySequenceDemo } from './components/demos/KeySequenceDemo';
import { ThemeToggle } from './components/theme-toggle';
import { Tabs } from './components/Tabs';
import { CodeExamplesSection } from './components/CodeExamplesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CodeBlock } from './components/CodeBlock';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ⌨️ useSimpleKeyboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                A simple library of React hooks for handling keyboard inputs and hotkeys
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="https://github.com/SkorpionG/use-simple-keyboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Installation Section */}
        <section className="mb-12 bg-card rounded-lg shadow-lg p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            📦 Installation
          </h2>
          <CodeBlock code="npm install use-simple-keyboard" language="bash" />
          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> Each demo tab below is interactive!
              Switch between tabs to try different keyboard shortcuts. Press{' '}
              <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">
                Ctrl+Shift+T
              </kbd>{' '}
              to toggle theme!
            </p>
          </div>
        </section>

        {/* Interactive Demos */}
        <Tabs
          defaultTab="text-editor"
          items={[
            {
              id: 'text-editor',
              label: 'Text Editor',
              icon: '📝',
              content: <TextEditorDemo />,
            },
            {
              id: 'modal',
              label: 'Modal Controls',
              icon: '🪟',
              content: <ModalDemo />,
            },
            {
              id: 'navigation',
              label: 'Tab Navigation',
              icon: '🧭',
              content: <NavigationDemo />,
            },
            {
              id: 'game',
              label: 'Game Controls',
              icon: '🎮',
              content: <GameDemo />,
            },
            {
              id: 'visualizer',
              label: 'Key Visualizer',
              icon: '⌨️',
              content: <KeyPressVisualizer />,
            },
            {
              id: 'sequences',
              label: 'Key Sequences',
              icon: '🔢',
              content: <KeySequenceDemo />,
            },
          ]}
        />

        {/* Code Example Section */}
        <CodeExamplesSection />

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Built with ❤️ using React and TypeScript</p>
            <p className="text-sm">
              <a href="#" className="text-primary hover:text-primary/80">
                Documentation
              </a>
              {' • '}
              <a href="#" className="text-primary hover:text-primary/80">
                GitHub
              </a>
              {' • '}
              <a href="#" className="text-primary hover:text-primary/80">
                NPM
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
