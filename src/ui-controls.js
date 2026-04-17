import { getAvailableLanguages, getAvailableThemes } from './highlighter.js'
import { BACKGROUND_PRESETS, WALLPAPER_PRESETS } from './themes.js'

// Track the currently active wallpaper URL (for base64 export)
let activeWallpaperUrl = null

// Image mode state
let currentMode = 'code'
let currentImageSrc = null
let currentImageName = ''

export function initControls(onChange) {
  populateLanguages()
  populateThemes()
  populateBackgroundPresets()
  populateWallpaperPresets()
  initModeSwitch(onChange)
  initImageInput(onChange)
  initDropZone(onChange)
  initPasteHandler(onChange)
  initCanvasSize(onChange)
  wireEvents(onChange)
  // Reflect initial mode on <body>
  document.body.dataset.mode = currentMode
}

function populateLanguages() {
  const select = document.getElementById('lang-select')
  const langs = getAvailableLanguages()
  select.innerHTML = langs.map(l =>
    `<option value="${l}" ${l === 'javascript' ? 'selected' : ''}>${l}</option>`
  ).join('')
}

function populateThemes() {
  const select = document.getElementById('theme-select')
  const themes = getAvailableThemes()
  select.innerHTML = themes.map(t =>
    `<option value="${t}" ${t === 'vitesse-dark' ? 'selected' : ''}>${t}</option>`
  ).join('')
}

function populateBackgroundPresets() {
  const container = document.getElementById('bg-presets')
  container.innerHTML = BACKGROUND_PRESETS.map((p, i) =>
    `<button class="bg-preset-btn ${i === 0 ? 'active' : ''}" data-bg="${p.value}" title="${p.name}" style="background: ${p.value}; ${p.value === 'transparent' ? 'border: 2px dashed #555;' : ''}"></button>`
  ).join('')

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.bg-preset-btn')
    if (!btn) return
    deactivateAllBgButtons()
    btn.classList.add('active')
    activeWallpaperUrl = null
    document.getElementById('bg-custom').value = btn.dataset.bg
  })
}

function populateWallpaperPresets() {
  const container = document.getElementById('wp-presets')
  container.innerHTML = WALLPAPER_PRESETS.map(wp =>
    `<button class="bg-preset-btn wp-preset-btn" data-wp-url="${wp.url}" title="${wp.name}" style="background: url('${wp.url}') center/cover;"></button>`
  ).join('')

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.wp-preset-btn')
    if (!btn) return
    deactivateAllBgButtons()
    btn.classList.add('active')
    activeWallpaperUrl = btn.dataset.wpUrl
    document.getElementById('bg-custom').value = `url('${btn.dataset.wpUrl}') center/cover`
  })
}

function deactivateAllBgButtons() {
  document.querySelectorAll('.bg-preset-btn').forEach(b => b.classList.remove('active'))
}

function initModeSwitch(onChange) {
  const sw = document.getElementById('mode-switch')
  if (!sw) return
  sw.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-btn')
    if (!btn) return
    setMode(btn.dataset.mode, onChange)
  })
}

function setMode(mode, onChange) {
  if (mode !== 'code' && mode !== 'image') return
  if (currentMode === mode) return
  currentMode = mode
  document.body.dataset.mode = mode
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode)
  })
  if (onChange) onChange()
}

function initImageInput(onChange) {
  const fileInput = document.getElementById('image-input')
  const chooseBtn = document.getElementById('btn-image-choose')
  const clearBtn = document.getElementById('btn-image-clear')

  if (chooseBtn) {
    chooseBtn.addEventListener('click', () => fileInput.click())
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0]
      if (file) loadImageFile(file, onChange)
      fileInput.value = ''
    })
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentImageSrc = null
      currentImageName = ''
      updateImageStatus()
      if (onChange) onChange()
    })
  }
}

function loadImageFile(file, onChange) {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    currentImageSrc = reader.result
    currentImageName = file.name || 'pasted-image'
    updateImageStatus()
    if (currentMode !== 'image') setMode('image', onChange)
    else if (onChange) onChange()
  }
  reader.readAsDataURL(file)
}

function updateImageStatus() {
  const status = document.getElementById('image-status')
  const name = document.getElementById('image-name')
  if (!status || !name) return
  if (currentImageSrc) {
    status.hidden = false
    name.textContent = currentImageName
  } else {
    status.hidden = true
    name.textContent = ''
  }
}

function initDropZone(onChange) {
  const container = document.getElementById('preview-container')
  if (!container) return

  const onDragEnter = (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types).includes('Files')) return
    e.preventDefault()
    container.classList.add('drag-over')
  }
  const onDragOver = (e) => {
    if (!e.dataTransfer || !Array.from(e.dataTransfer.types).includes('Files')) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  const onDragLeave = (e) => {
    if (e.target === container) container.classList.remove('drag-over')
  }
  const onDrop = (e) => {
    const files = e.dataTransfer && e.dataTransfer.files
    if (!files || !files.length) return
    const file = Array.from(files).find(f => f.type.startsWith('image/'))
    if (!file) return
    e.preventDefault()
    container.classList.remove('drag-over')
    loadImageFile(file, onChange)
  }

  container.addEventListener('dragenter', onDragEnter)
  container.addEventListener('dragover', onDragOver)
  container.addEventListener('dragleave', onDragLeave)
  container.addEventListener('drop', onDrop)
}

function initPasteHandler(onChange) {
  document.addEventListener('paste', (e) => {
    // If the user is pasting into the code textarea, don't hijack it
    const target = e.target
    if (target && target.tagName === 'TEXTAREA') return

    const items = e.clipboardData && e.clipboardData.items
    if (!items) return
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          e.preventDefault()
          loadImageFile(file, onChange)
          return
        }
      }
    }
  })
}

function initCanvasSize(onChange) {
  const preset = document.getElementById('canvas-preset')
  const customWrap = document.getElementById('canvas-custom')
  const widthEl = document.getElementById('canvas-width')
  const heightEl = document.getElementById('canvas-height')
  const info = document.getElementById('canvas-info')
  if (!preset || !customWrap || !widthEl || !heightEl || !info) return

  const updateInfo = () => {
    const dims = getCanvasDims()
    if (dims) {
      info.textContent = `Output: ${dims.width} × ${dims.height} px (1×)`
    } else {
      info.textContent = 'Output: fit to content'
    }
  }

  preset.addEventListener('change', () => {
    const val = preset.value
    if (val === 'custom') {
      customWrap.hidden = false
    } else if (val === 'fit') {
      customWrap.hidden = true
    } else {
      const [w, h] = val.split('x').map(Number)
      widthEl.value = w
      heightEl.value = h
      customWrap.hidden = true
    }
    updateInfo()
    onChange()
  })

  widthEl.addEventListener('input', () => { updateInfo(); onChange() })
  heightEl.addEventListener('input', () => { updateInfo(); onChange() })

  updateInfo()
}

export function getCanvasDims() {
  const preset = document.getElementById('canvas-preset')
  if (!preset || preset.value === 'fit') return null
  let w, h
  if (preset.value === 'custom') {
    w = parseInt(document.getElementById('canvas-width').value, 10)
    h = parseInt(document.getElementById('canvas-height').value, 10)
  } else {
    [w, h] = preset.value.split('x').map(Number)
  }
  if (!w || !h || w < 50 || h < 50) return null
  return { width: w, height: h }
}

function wireEvents(onChange) {
  const inputs = ['code-input', 'lang-select', 'theme-select', 'bg-custom',
    'padding-slider', 'width-slider', 'fontsize-slider', 'window-title', 'shadow-toggle', 'watermark-toggle',
    'img-radius-slider', 'img-scale-slider', 'img-frame-toggle']

  inputs.forEach(id => {
    const el = document.getElementById(id)
    if (!el) return
    const event = el.type === 'checkbox' ? 'change' : 'input'
    el.addEventListener(event, onChange)
  })

  document.getElementById('bg-presets').addEventListener('click', (e) => {
    if (e.target.closest('.bg-preset-btn')) {
      setTimeout(onChange, 0)
    }
  })

  document.getElementById('wp-presets').addEventListener('click', (e) => {
    if (e.target.closest('.wp-preset-btn')) {
      setTimeout(onChange, 0)
    }
  })

  // Gradient builder
  const updateGradientPreview = () => {
    const c1 = document.getElementById('grad-color1').value
    const c2 = document.getElementById('grad-color2').value
    const angle = document.getElementById('grad-angle').value
    document.getElementById('gradient-preview-bar').style.background =
      `linear-gradient(${angle}deg, ${c1}, ${c2})`
  }
  document.getElementById('grad-color1').addEventListener('input', updateGradientPreview)
  document.getElementById('grad-color2').addEventListener('input', updateGradientPreview)
  document.getElementById('grad-angle').addEventListener('change', updateGradientPreview)
  updateGradientPreview()

  document.getElementById('btn-apply-gradient').addEventListener('click', () => {
    const c1 = document.getElementById('grad-color1').value
    const c2 = document.getElementById('grad-color2').value
    const angle = document.getElementById('grad-angle').value
    const gradient = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`
    deactivateAllBgButtons()
    document.getElementById('bg-custom').value = gradient
    onChange()
  })

  // Window style picker
  document.getElementById('window-style-picker').addEventListener('click', (e) => {
    const btn = e.target.closest('.window-style-btn')
    if (!btn) return
    document.querySelectorAll('.window-style-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    setTimeout(onChange, 0)
  })

  // Quality picker (export quality; NOT the image-fit picker)
  const qualityPicker = document.querySelector('.quality-picker:not(#img-fit-picker)')
  if (qualityPicker) {
    qualityPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('.quality-btn')
      if (!btn) return
      qualityPicker.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  }

  // Image fit picker
  const fitPicker = document.getElementById('img-fit-picker')
  if (fitPicker) {
    fitPicker.addEventListener('click', (e) => {
      const btn = e.target.closest('.quality-btn')
      if (!btn) return
      fitPicker.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      setTimeout(onChange, 0)
    })
  }

  // Update slider value displays
  document.getElementById('padding-slider').addEventListener('input', (e) => {
    document.getElementById('padding-value').textContent = e.target.value + 'px'
  })
  document.getElementById('width-slider').addEventListener('input', (e) => {
    document.getElementById('width-value').textContent = e.target.value + 'px'
  })
  document.getElementById('fontsize-slider').addEventListener('input', (e) => {
    document.getElementById('fontsize-value').textContent = e.target.value + 'px'
  })
  const radius = document.getElementById('img-radius-slider')
  if (radius) {
    radius.addEventListener('input', (e) => {
      document.getElementById('img-radius-value').textContent = e.target.value + 'px'
    })
  }
  const scale = document.getElementById('img-scale-slider')
  if (scale) {
    scale.addEventListener('input', (e) => {
      document.getElementById('img-scale-value').textContent = e.target.value + '%'
    })
  }
}

export function getOptions() {
  const exportQualityBtn = document.querySelector('.quality-picker:not(#img-fit-picker) .quality-btn.active')
  const exportScale = parseInt(exportQualityBtn?.dataset.scale || '2', 10)
  const canvas = getCanvasDims()

  return {
    mode: currentMode,
    canvasWidth: canvas?.width || null,
    canvasHeight: canvas?.height || null,
    code: document.getElementById('code-input').value,
    lang: document.getElementById('lang-select').value,
    theme: document.getElementById('theme-select').value,
    background: document.getElementById('bg-custom').value || BACKGROUND_PRESETS[0].value,
    padding: parseInt(document.getElementById('padding-slider').value, 10),
    fontSize: parseInt(document.getElementById('fontsize-slider').value, 10),
    windowWidth: parseInt(document.getElementById('width-slider').value, 10),
    windowTitle: document.getElementById('window-title').value,
    shadow: document.getElementById('shadow-toggle').checked,
    watermark: document.getElementById('watermark-toggle').checked,
    windowStyle: document.querySelector('.window-style-btn.active')?.dataset.style || 'solid',
    exportScale,
    wallpaperUrl: activeWallpaperUrl,
    imageSrc: currentImageSrc,
    imageRadius: parseInt(document.getElementById('img-radius-slider')?.value || '12', 10),
    imageScale: parseInt(document.getElementById('img-scale-slider')?.value || '100', 10),
    imageFit: document.querySelector('#img-fit-picker .quality-btn.active')?.dataset.fit || 'contain',
    imageFrame: document.getElementById('img-frame-toggle')?.checked ?? true,
  }
}
