export function generateStandaloneHtml(highlightedCode, options) {
  const {
    background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding = 64,
    fontSize = 14,
    windowTitle = '',
    shadow = true,
    themeBg = '#1e1e1e',
    windowStyle = 'solid',
    windowWidth = 680,
    wallpaperBase64 = null,
    watermark = true,
  } = options

  const isBlur = windowStyle === 'blur'

  const bodyBg = wallpaperBase64
    ? `background: url('${wallpaperBase64}') center/cover no-repeat; background-color: #111;`
    : `background: ${background};`

  const shadowCss = shadow
    ? 'box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);'
    : ''

  const frameBg = isBlur
    ? 'background: rgba(30, 30, 30, 0.55); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4); border: 1px solid rgba(255,255,255,0.1);'
    : ''

  const titlebarBg = isBlur
    ? 'background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06);'
    : `background: ${themeBg};`

  const preBgOverride = isBlur
    ? 'background: transparent !important;'
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(windowTitle || 'Code Export')}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    ${bodyBg}
    padding: ${padding}px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: relative;
  }
  .window-frame {
    width: ${windowWidth}px;
    border-radius: 12px;
    overflow: hidden;
    max-width: 100%;
    ${shadowCss}
    ${frameBg}
  }
  .window-titlebar {
    height: 40px;
    ${titlebarBg}
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;
  }
  .traffic-lights {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green { background: #28c840; }
  .window-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
  }
  .window-content pre {
    margin: 0;
    padding: 20px 24px;
    font-size: ${fontSize}px;
    line-height: 1.6;
    font-family: 'Fira Code', 'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
    overflow-x: auto;
    tab-size: 2;
    ${preBgOverride}
  }
  .watermark {
    position: absolute;
    bottom: 12px;
    right: 16px;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.12);
    letter-spacing: 0.02em;
    pointer-events: none;
    user-select: none;
  }
  .window-content pre code {
    font-family: inherit;
  }
</style>
</head>
<body>
  <div class="window-frame">
    <div class="window-titlebar">
      <div class="traffic-lights">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="window-title">${escapeHtml(windowTitle)}</span>
    </div>
    <div class="window-content">
      ${highlightedCode}
    </div>
  </div>
  ${watermark ? '<div class="watermark">garrik.design/code</div>' : ''}
</body>
</html>`
}

export function downloadHtml(html, filename = 'code-export.html') {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
