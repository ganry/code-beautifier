const { app, BrowserWindow, shell, nativeTheme } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'

// Force dark mode for the title bar
nativeTheme.themeSource = 'dark'

function createWindow() {
  const windowOptions = {
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Code Beautifier',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  }

  if (isMac) {
    // macOS: hidden title bar with custom traffic light positions
    windowOptions.titleBarStyle = 'hidden'
    windowOptions.trafficLightPosition = { x: 12, y: 10 }
  } else if (isWin) {
    // Windows: use titleBarOverlay for native window controls on a custom title bar
    windowOptions.titleBarStyle = 'hidden'
    windowOptions.titleBarOverlay = {
      color: '#181818',
      symbolColor: '#e5e5e5',
      height: 36,
    }
  }

  const win = new BrowserWindow(windowOptions)

  if (isDev) {
    win.loadURL('http://localhost:5173/app.html')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'app.html'))
  }

  // Open external links in browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
