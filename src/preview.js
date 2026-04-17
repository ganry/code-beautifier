export function buildPreviewHTML(highlightedCode, options) {
  const {
    mode = 'code',
    background = 'linear-gradient(135deg, #f471b5 0%, #c0457a 100%)',
    padding = 64,
    fontSize = 14,
    windowTitle = '',
    shadow = true,
    themeBg = '#1e1e1e',
    windowStyle = 'solid',
    windowWidth = 680,
    wallpaperUrl = null,
    watermark = true,
    imageSrc = null,
    imageRadius = 12,
    imageScale = 100,
    imageFit = 'contain',
    imageFrame = true,
    canvasWidth = null,
    canvasHeight = null,
  } = options

  const container = document.getElementById('preview-container')
  if (!container) return

  const bgStyle = wallpaperUrl
    ? `background: url('${wallpaperUrl}') center/cover no-repeat;`
    : `background: ${background};`

  const canvasStyle = (canvasWidth && canvasHeight)
    ? `width: ${canvasWidth}px; height: ${canvasHeight}px; overflow: hidden;`
    : ''

  if (mode === 'image') {
    container.innerHTML = renderImagePreview({
      bgStyle, canvasStyle, padding, windowWidth, windowTitle, shadow, watermark,
      imageSrc, imageRadius, imageScale, imageFit, imageFrame,
    })
    return
  }

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
    <div class="preview-background${canvasStyle ? ' preview-background--fixed' : ''}" style="${bgStyle} padding: ${padding}px; ${canvasStyle}">
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

function renderImagePreview(opts) {
  const {
    bgStyle, canvasStyle = '', padding, windowWidth, windowTitle, shadow, watermark,
    imageSrc, imageRadius, imageScale, imageFit, imageFrame,
  } = opts

  const shadowCss = shadow
    ? 'box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);'
    : ''

  if (!imageSrc) {
    return `
    <div class="preview-background${canvasStyle ? ' preview-background--fixed' : ''}" style="${bgStyle} padding: ${padding}px; ${canvasStyle}">
      <div class="image-dropzone" style="width: ${windowWidth}px;">
        <div class="dropzone-icon">🖼️</div>
        <div class="dropzone-title">Drop a screenshot here</div>
        <div class="dropzone-sub">Click "Choose image" · drag &amp; drop · paste with Cmd+V</div>
      </div>
      ${watermark ? '<div class="watermark">garrik.design/code</div>' : ''}
    </div>
    `
  }

  const scalePct = Math.max(10, imageScale) / 100
  const imgInnerStyle = `display: block; width: 100%; height: auto; border-radius: ${imageRadius}px; transform: scale(${scalePct}); transform-origin: center center; object-fit: ${imageFit};`

  if (imageFrame) {
    return `
    <div class="preview-background${canvasStyle ? ' preview-background--fixed' : ''}" style="${bgStyle} padding: ${padding}px; ${canvasStyle}">
      <div class="window-frame" style="width: ${windowWidth}px; ${shadowCss} background: #1e1e1e;">
        <div class="window-titlebar" style="background: #1e1e1e;">
          <div class="traffic-lights">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="window-title">${escapeAttr(windowTitle)}</span>
          <div class="titlebar-spacer"></div>
        </div>
        <div class="window-content image-content">
          <img class="preview-image" src="${imageSrc}" alt="" style="${imgInnerStyle}">
        </div>
      </div>
      ${watermark ? '<div class="watermark">garrik.design/code</div>' : ''}
    </div>
    `
  }

  const frameOnlyStyle = `width: ${windowWidth}px; border-radius: ${imageRadius}px; overflow: hidden; ${shadowCss}`
  const noFrameImgStyle = `display: block; width: 100%; height: auto; transform: scale(${scalePct}); transform-origin: center center; object-fit: ${imageFit};`

  return `
    <div class="preview-background${canvasStyle ? ' preview-background--fixed' : ''}" style="${bgStyle} padding: ${padding}px; ${canvasStyle}">
      <div class="preview-image-wrap" style="${frameOnlyStyle}">
        <img class="preview-image preview-image--no-frame" src="${imageSrc}" alt="" style="${noFrameImgStyle}">
      </div>
      ${watermark ? '<div class="watermark">garrik.design/code</div>' : ''}
    </div>
  `
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function getPreviewElement() {
  return document.querySelector('.preview-background')
}
