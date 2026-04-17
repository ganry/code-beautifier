# Screenshot & Code Beautifier

Export beautiful screenshots and code snippets as images or self-contained HTML. Perfect for App Store assets, social posts, and docs.

**[Try it online](https://garrik.design/code/app.html)** | **[GitHub](https://github.com/ganry/code-beautifier)**

## Features

### Two modes, one tool
- **Code mode** — 200+ languages via Shiki (VS Code TextMate grammars), 17 syntax themes
- **Image mode** — Drop in any screenshot and wrap it in a polished frame

### Image inputs (three ways)
- **File picker** — Choose image from disk
- **Drag & drop** — Drop any image onto the preview
- **Paste with Cmd+V** — Paste screenshots straight from the macOS clipboard

### Canvas & output sizing
Pick an exact pixel canvas so exports match App Store / store-listing specs:
- **Mac App Store** — 1280×800, 1440×900, 2560×1600, 2880×1800
- **iPhone App Store** — 1290×2796 (6.7"), 1320×2868 (6.9")
- **iPad App Store** — 2064×2752, 2048×2732
- **Custom** — any width × height
- **Fit to content** — classic mode, canvas auto-sizes

### Styling controls
- **macOS window chrome** — Traffic lights, title bar, rounded corners (toggle on/off in Image mode)
- **Glass & Solid** window styles for code
- **Rounded corners**, **scale**, and **fit** (contain/cover) for images
- **25+ backgrounds** — gradient presets, solid colors, wallpaper images, or build your own gradient
- **Padding**, **window width**, **font size**, **shadow**, **watermark** — all adjustable
- **Retina PNG export** — 1×, 2× HD, or 4× 4K resolution
- **Self-contained HTML export** — All styles inlined, works offline
- **Resizable panels** — Drag the splitter to resize controls vs. preview

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
- `/app.html` — Beautifier app

```
index.html              # Landing page
app.html                # App entry point
src/
  main.js               # App initialization
  highlighter.js        # Shiki syntax highlighting
  preview.js            # Preview rendering (code + image)
  export-html.js        # Self-contained HTML export
  export-image.js       # PNG export
  ui-controls.js        # UI controls, mode switch, drop/paste, canvas size
  themes.js             # Background presets & wallpapers
  landing/              # Landing page assets
  styles/               # CSS
  wallpapers/           # Background images
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
