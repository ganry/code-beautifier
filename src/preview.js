export function buildPreviewHTML(highlightedCode, options) {
  const {
    background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding = 64,
    fontSize = 14,
    windowTitle = '',
    shadow = true,
    themeBg = '#1e1e1e',
    windowStyle = 'solid',
    windowWidth = 680,
    wallpaperUrl = null,
    watermark = true,
  } = options

  const container = document.getElementById('preview-container')
  if (!container) return

  const isBlur = windowStyle === 'blur'

  const frameShadow = shadow
    ? 'box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);'
    : ''

  const frameStyle = isBlur
    ? `${frameShadow} background: rgba(30, 30, 30, 0.55); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4); border: 1px solid rgba(255,255,255,0.1);`
    : frameShadow

  const titlebarStyle = isBlur
    ? 'background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06);'
    : `background: ${themeBg};`

  const contentBgOverride = isBlur
    ? ' background: transparent !important;'
    : ''

  container.innerHTML = `
    <div class="preview-background" style="${wallpaperUrl ? `background: url('${wallpaperUrl}') center/cover no-repeat;` : `background: ${background};`} padding: ${padding}px;">
      <div class="window-frame${isBlur ? ' window-frame--blur' : ''}" style="width: ${windowWidth}px; ${frameStyle}">
        <div class="window-titlebar" style="${titlebarStyle}">
          <div class="traffic-lights">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="window-title">${windowTitle}</span>
          <div class="titlebar-spacer"></div>
        </div>
        <div class="window-content" style="font-size: ${fontSize}px;${contentBgOverride}">
          ${highlightedCode}
        </div>
      </div>
      ${watermark ? '<div class="watermark">garrik.design/code</div>' : ''}
    </div>
  `

  // For blur mode, make Shiki's <pre> background transparent
  if (isBlur) {
    const pre = container.querySelector('.window-content pre')
    if (pre) {
      pre.style.background = 'transparent'
    }
  }
}

export function getPreviewElement() {
  return document.querySelector('.preview-background')
}
