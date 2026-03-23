import { getAvailableLanguages, getAvailableThemes } from './highlighter.js'
import { BACKGROUND_PRESETS, WALLPAPER_PRESETS } from './themes.js'

// Track the currently active wallpaper URL (for base64 export)
let activeWallpaperUrl = null

export function initControls(onChange) {
  populateLanguages()
  populateThemes()
  populateBackgroundPresets()
  populateWallpaperPresets()
  wireEvents(onChange)
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
    // Deactivate all bg + wallpaper presets
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

function wireEvents(onChange) {
  const inputs = ['code-input', 'lang-select', 'theme-select', 'bg-custom',
    'padding-slider', 'width-slider', 'fontsize-slider', 'window-title', 'shadow-toggle', 'watermark-toggle']

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

  // Quality picker
  document.querySelector('.quality-picker').addEventListener('click', (e) => {
    const btn = e.target.closest('.quality-btn')
    if (!btn) return
    document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  })

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
}

export function getOptions() {
  return {
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
    exportScale: parseInt(document.querySelector('.quality-btn.active')?.dataset.scale || '2', 10),
    wallpaperUrl: activeWallpaperUrl,
  }
}
