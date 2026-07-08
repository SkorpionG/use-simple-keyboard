# useSimpleKeyboard Demo Application

This is an interactive demo application showcasing the features of the `useSimpleKeyboard` React hooks library.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. First, build the main package:

```bash
cd ..
npm install
npm run build
```

2. Then install demo dependencies:

```bash
cd demos
npm install
```

### Running the Demo

Start the development server:

```bash
npm run dev
```

The demo will be available at `http://localhost:5173`

## 📋 What's Included

The demo application includes 5 interactive examples:

### 1. 📝 Text Editor Demo

- **Ctrl+S / ⌘+S**: Save content
- **Ctrl+Z / ⌘+Z**: Undo changes
- **Ctrl+Y / Ctrl+Shift+Z**: Redo changes
- Features a full history system

### 2. 🪟 Modal Controls Demo

- **Ctrl+M**: Open modal
- **Escape**: Close modal
- Demonstrates scoped hotkey handling

### 3. 🧭 Tab Navigation Demo

- **Ctrl+1-4**: Jump to specific tabs
- **← →**: Navigate between tabs
- Shows keyboard-driven navigation patterns

### 4. 🎮 Game Controls Demo

- **Space**: Start/pause game
- **W A S D** or **Arrow Keys**: Move the player
- Real-time keyboard input handling

### 5. ⌨️ Key Press Visualizer

- Displays all keyboard inputs in real-time
- Shows modifier keys (Ctrl, Alt, Shift, ⌘)
- Useful for testing and debugging

## 🎨 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **useSimpleKeyboard** - Keyboard input handling

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔧 Development

The demo uses Vite's hot module replacement (HMR) for instant updates during development. Simply edit any file and see the changes immediately in your browser.

## 📝 Code Structure

```
demos/
├── src/
│   ├── components/
│   │   ├── TextEditorDemo.tsx
│   │   ├── ModalDemo.tsx
│   │   ├── NavigationDemo.tsx
│   │   ├── GameDemo.tsx
│   │   └── KeyPressVisualizer.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

## 💡 Tips

- All demos are fully interactive - try the keyboard shortcuts!
- The Key Press Visualizer is great for testing custom hotkeys
- Check the browser console for additional debug information
- All components use Tailwind CSS for styling

## 🐛 Troubleshooting

If you encounter issues:

1. Make sure the parent package is built: `cd .. && npm run build`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Clear Vite cache: `rm -rf node_modules/.vite`

## 📚 Learn More

- [useSimpleKeyboard Documentation](../README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
