import { toPng } from 'html-to-image'

export async function exportAsPng(element, filename = 'code-export.png', scale = 2) {
  // Temporarily hide scrollbars for a clean export
  const pre = element.querySelector('pre')
  if (pre) {
    pre.style.overflow = 'hidden'
  }

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: scale,
      cacheBust: true,
    })

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    // Restore scrollbar
    if (pre) {
      pre.style.overflow = ''
    }
  }
}
