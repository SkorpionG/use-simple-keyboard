import { useState } from 'react';
import { cn } from '../lib/utils';
import type { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ items, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const activeItem = items.find((item) => item.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-lg mb-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm',
              activeTab === item.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            {item.icon && <span className="text-base">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeItem && (
          <div key={activeTab} className="animate-in fade-in duration-200">
            {activeItem.content}
          </div>
        )}
      </div>
    </div>
  );
}
