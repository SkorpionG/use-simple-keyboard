# Testing Guide

This package uses Jest and React Testing Library for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in a dedicated `test/` directory at the root level, mirroring the source structure:

```text
test/
├── hooks/
│   └── useHotkey.test.tsx
├── utils/
│   └── keyUtils.test.ts
└── setupTests.ts

src/
├── hooks/
│   └── useHotkey.ts
└── utils/
    └── keyUtils.ts
```

## Writing Tests

### Testing Hooks

Use React Testing Library to test hooks in a component context:

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useHotkey } from '../../src/hooks/useHotkey';

const TestComponent: React.FC<{ callback: () => void }> = ({ callback }) => {
  useHotkey('ctrl+a', callback);
  return <div>Test</div>;
};

it('should trigger callback when hotkey is pressed', () => {
  const mockCallback = jest.fn();
  render(<TestComponent callback={mockCallback} />);

  fireEvent.keyDown(document, {
    key: 'a',
    ctrlKey: true,
  });

  expect(mockCallback).toHaveBeenCalledTimes(1);
});
```

### Testing Utilities

Test utility functions directly:

```tsx
import { normalizeKey } from '../../src/utils/keyUtils';

it('should normalize space key', () => {
  expect(normalizeKey(' ')).toBe('space');
  expect(normalizeKey('Space')).toBe('space');
});
```

## Coverage

The test coverage report is generated in the `coverage/` directory when running `npm run test:coverage`.

Current coverage targets:

- Statements: > 80%
- Branches: > 80%
- Functions: > 80%
- Lines: > 80%

## CI/CD Integration

Tests are automatically run before publishing via the `prepublishOnly` script:

```json
{
  "scripts": {
    "prepublishOnly": "npm run format && npm run lint && npm run test && npm run build"
  }
}
```
