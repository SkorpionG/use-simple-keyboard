import { useState } from 'react';
import { useHotkey } from '../../../../src/hooks/useHotkey';

const tabs = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    content: 'Welcome to the home page!',
  },
  { id: 'about', name: 'About', icon: 'ℹ️', content: 'Learn more about us.' },
  {
    id: 'services',
    name: 'Services',
    icon: '⚙️',
    content: 'Explore our services.',
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '📧',
    content: 'Get in touch with us.',
  },
];

export function NavigationDemo() {
  const [currentTab, setCurrentTab] = useState(0);

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
    <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        🧭 Tab Navigation
      </h2>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-muted-foreground">Navigate with keyboard:</p>
        <div className="flex flex-wrap gap-2 items-center">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            Ctrl+1-4
          </kbd>
          <span className="text-muted-foreground text-sm">- Jump to tab</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-foreground">
            ← →
          </kbd>
          <span className="text-muted-foreground text-sm">- Navigate tabs</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(index)}
            className={`
              px-4 py-2 font-medium transition-all duration-200 border-b-2 -mb-px
              ${
                currentTab === index
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
            <span className="ml-2 text-xs text-muted-foreground">
              ({index + 1})
            </span>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-8 min-h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">{tabs[currentTab].icon}</div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {tabs[currentTab].name}
          </h3>
          <p className="text-muted-foreground">{tabs[currentTab].content}</p>
        </div>
      </div>
    </div>
  );
}
