import { createHighlighter, bundledLanguages, bundledThemes } from 'shiki'

let highlighter = null

const INITIAL_THEMES = [
  'vitesse-dark', 'vitesse-light', 'nord', 'dracula',
  'github-dark', 'github-light', 'one-dark-pro', 'monokai',
  'tokyo-night', 'catppuccin-mocha', 'catppuccin-latte',
  'solarized-dark', 'solarized-light', 'min-dark', 'min-light',
  'rose-pine', 'night-owl', 'synthwave-84',
]

const INITIAL_LANGS = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'java',
  'c', 'cpp', 'csharp', 'html', 'css', 'json', 'markdown',
  'bash', 'sql', 'ruby', 'php', 'swift', 'kotlin', 'yaml', 'toml',
  'jsx', 'tsx', 'vue', 'svelte', 'lua', 'zig', 'elixir', 'dart',
]

export async function initHighlighter() {
  highlighter = await createHighlighter({
    themes: INITIAL_THEMES,
    langs: INITIAL_LANGS,
  })
  return highlighter
}

export async function highlight(code, lang, theme) {
  if (!highlighter) throw new Error('Highlighter not initialized')

  const loadedLangs = highlighter.getLoadedLanguages()
  if (!loadedLangs.includes(lang)) {
    if (lang in bundledLanguages) {
      await highlighter.loadLanguage(lang)
    } else {
      lang = 'text'
    }
  }

  return highlighter.codeToHtml(code, { lang, theme })
}

export function getThemeBg(theme) {
  if (!highlighter) return '#1e1e1e'
  try {
    return highlighter.getTheme(theme).bg
  } catch {
    return '#1e1e1e'
  }
}

export function getAvailableLanguages() {
  return Object.keys(bundledLanguages).sort()
}

export function getAvailableThemes() {
  return INITIAL_THEMES
}
