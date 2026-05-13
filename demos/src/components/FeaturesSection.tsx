import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: '🌍',
    title: 'Cross-Platform',
    description: 'Works on Windows, macOS, and Linux',
  },
  {
    icon: '⚡',
    title: 'Lightweight',
    description: 'Zero dependencies except React',
  },
  {
    icon: '📘',
    title: 'TypeScript',
    description: 'Full TypeScript support included',
  },
  {
    icon: '🎯',
    title: 'Flexible API',
    description: 'Single or multiple hotkey support',
  },
  {
    icon: '🔧',
    title: 'Configurable',
    description: 'preventDefault, stopPropagation, and more',
  },
  {
    icon: '🌐',
    title: 'Multi-Language',
    description: 'Handles different keyboard layouts',
  },
];

export function FeaturesSection() {
  return (
    <section className="mt-12 bg-card rounded-lg shadow-lg p-6 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">✨ Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
