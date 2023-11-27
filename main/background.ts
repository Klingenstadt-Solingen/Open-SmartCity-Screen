import { app } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { autoUpdater } from 'electron-updater'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1080,
    height: 720,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  if (isProd) {
    await mainWindow.loadURL('app://./dashboard.html')
    mainWindow.setFullScreen(true)
    const userPath = app.getPath('userData').replaceAll('\\', '/')
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("path", "${userPath}")`, true)
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("mode", "prod")`, true)

    autoUpdater.on('checking-for-update', () => {
      mainWindow.webContents.executeJavaScript(`console.log('Checking for update...')`)
    })
    autoUpdater.on('update-available', (info) => {
      mainWindow.webContents.executeJavaScript(`console.log('Update available.')`)
    })
    autoUpdater.on('update-not-available', (info) => {
      mainWindow.webContents.executeJavaScript(`console.log('Update not available.')`)
    })
    autoUpdater.on('error', (err) => {
      const a = 'Error in auto-updater, ' + JSON.stringify(err)
      mainWindow.webContents.executeJavaScript(`console.log('${a}')`)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = 'Download speed: ' + progressObj.bytesPerSecond
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
      log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      mainWindow.webContents.executeJavaScript(`console.log(${log_message})`)
    })
    autoUpdater.on('update-downloaded', (info) => {
      mainWindow.webContents.executeJavaScript(`console.log('Update downloaded')`)
    })

    autoUpdater.on('update-downloaded', () => {
      autoUpdater.quitAndInstall()
    })

    // Check for updates every 6 hours
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, /*21600000*/ 80000)
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/dashboard`)
    mainWindow.webContents.openDevTools()

    mainWindow.webContents.executeJavaScript(
      `localStorage.setItem("path", './renderer/public')`,
      true
    )
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("mode", "dev")`, true)
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})
