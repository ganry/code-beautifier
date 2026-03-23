import './styles/main.css'
import './styles/preview.css'
import { initHighlighter, highlight, getThemeBg } from './highlighter.js'
import { buildPreviewHTML, getPreviewElement } from './preview.js'
import { initControls, getOptions } from './ui-controls.js'
import { generateStandaloneHtml, downloadHtml } from './export-html.js'
import { exportAsPng } from './export-image.js'
import { DEFAULT_CODE } from './themes.js'

let debounceTimer = null
let lastHighlightedHtml = ''

async function imageUrlToBase64(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

async function updatePreview() {
  const opts = getOptions()
  const themeBg = getThemeBg(opts.theme)

  try {
    lastHighlightedHtml = await highlight(opts.code, opts.lang, opts.theme)
    buildPreviewHTML(lastHighlightedHtml, { ...opts, themeBg })
  } catch (err) {
    console.error('Highlight error:', err)
  }
}

function debouncedUpdate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(updatePreview, 150)
}

async function handleExportHtml() {
  const opts = getOptions()
  const themeBg = getThemeBg(opts.theme)
  let wallpaperBase64 = null
  if (opts.wallpaperUrl) {
    wallpaperBase64 = await imageUrlToBase64(opts.wallpaperUrl)
  }
  const html = generateStandaloneHtml(lastHighlightedHtml, { ...opts, themeBg, wallpaperBase64 })
  downloadHtml(html)
}

async function handleExportPng() {
  const el = getPreviewElement()
  if (!el) return
  const opts = getOptions()
  const btn = document.getElementById('btn-export-png')
  btn.textContent = 'Exporting...'
  btn.disabled = true
  try {
    await exportAsPng(el, 'code-export.png', opts.exportScale)
  } catch (err) {
    console.error('PNG export error:', err)
  } finally {
    btn.textContent = 'Export PNG'
    btn.disabled = false
  }
}

async function handleCopyHtml() {
  const opts = getOptions()
  const themeBg = getThemeBg(opts.theme)
  let wallpaperBase64 = null
  if (opts.wallpaperUrl) {
    wallpaperBase64 = await imageUrlToBase64(opts.wallpaperUrl)
  }
  const html = generateStandaloneHtml(lastHighlightedHtml, { ...opts, themeBg, wallpaperBase64 })
  try {
    await navigator.clipboard.writeText(html)
    const btn = document.getElementById('btn-copy-html')
    const original = btn.textContent
    btn.textContent = 'Copied!'
    setTimeout(() => { btn.textContent = original }, 1500)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

async function init() {
  // Detect Electron and show custom title bar
  if (window.electronAPI?.isElectron) {
    document.body.classList.add('is-electron')
  }

  // Set default code
  document.getElementById('code-input').value = DEFAULT_CODE

  // Show loading
  document.getElementById('preview-container').innerHTML =
    '<span class="loading">Loading syntax highlighter...</span>'

  // Init Shiki
  await initHighlighter()

  // Init controls and wire events
  initControls(debouncedUpdate)

  // Wire export buttons
  document.getElementById('btn-export-html').addEventListener('click', handleExportHtml)
  document.getElementById('btn-export-png').addEventListener('click', handleExportPng)
  document.getElementById('btn-copy-html').addEventListener('click', handleCopyHtml)

  // Panel resizer
  initResizer()

  // Initial render
  await updatePreview()
}

function initResizer() {
  const resizer = document.getElementById('panel-resizer')
  const panel = document.querySelector('.controls-panel')
  let startX, startWidth

  resizer.addEventListener('mousedown', (e) => {
    startX = e.clientX
    startWidth = panel.offsetWidth
    resizer.classList.add('dragging')
    document.body.classList.add('resizing')

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX)
      const clamped = Math.min(600, Math.max(220, newWidth))
      panel.style.width = clamped + 'px'
      panel.style.minWidth = clamped + 'px'
    }

    const onMouseUp = () => {
      resizer.classList.remove('dragging')
      document.body.classList.remove('resizing')
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}

init().catch(console.error)
