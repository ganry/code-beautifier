# Code Beautifier

Export beautiful code snippets as images or self-contained HTML.

**[Try it online](https://garrik.design/code/app.html)**

## Features

- **200+ Languages** — Syntax highlighting powered by Shiki with VS Code TextMate grammars
- **Self-Contained HTML Export** — All styles inlined, works offline, zero external dependencies
- **Retina PNG Export** — 1x, 2x HD, or 4x 4K resolution
- **macOS Window Chrome** — Realistic traffic light dots, title bar, rounded corners
- **Glass & Solid Modes** — Frosted glassmorphism or classic solid window styles
- **Custom Backgrounds** — 25+ gradient presets, solid colors, wallpaper images, or build your own gradient
- **Watermark** — Optional garrik.design/code watermark on exports
- **Resizable Panels** — Drag to resize the controls and preview panels

## Tech Stack

- [Vite](https://vite.dev) — Build tool
- [Shiki](https://shiki.style) — Syntax highlighting
- [html-to-image](https://github.com/bubkoo/html-to-image) — PNG export
- [Electron](https://www.electronjs.org) — Desktop app (coming soon)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Development

The project is a Vite multi-page app:

- `/` — Landing page (`index.html`)
- `/app.html` — Code Beautifier app

```
index.html              # Landing page
app.html                # App entry point
src/
  main.js               # App initialization
  highlighter.js         # Shiki syntax highlighting
  preview.js             # Preview rendering
  export-html.js         # Self-contained HTML export
  export-image.js        # PNG export
  ui-controls.js         # UI controls
  themes.js              # Background presets & wallpapers
  landing/               # Landing page assets
  styles/                # CSS
  wallpapers/            # Background images
electron/               # Electron desktop wrapper
build/                  # App icons
```

## Desktop App (Coming Soon)

```bash
# Dev with Electron
npm run electron:dev

# Build for macOS
npm run electron:build:mac

# Build for Windows
npm run electron:build:win

# Build for both
npm run electron:build:all
```

## License

MIT License - Copyright (c) 2026 [garrik.design](https://garrik.design)

See [LICENSE](LICENSE) for details.
