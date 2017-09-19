const electron = require('electron')
const {app, Menu} = require('electron')
const settings = require('electron-settings')
var ipc = require('electron').ipcMain
let rp = require('request-promise')
let guid = require('guid')

global.log = require('electron-log')

let util = require('util')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

log.transports.file.level = false
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}'

function createWindow () {
  log.info('Creating main window')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  })
  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname + /app/, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    log.info('Closing main window')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log.info('Application is ready')
  log.info('api url - ' + settings.get('api.url'))
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  log.info('Application is quitting')

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

settings.setPath('app/config/config.json')
console.log('settings', settings.file())

ipc.on('get-api-data', function (event, arg) {
  var requestId = guid.raw()
  log.info(`[${requestId}] ${arg.from} fetching ${arg.path} from API `)

  var options = {
    uri: `${settings.get ('api.url')}:${settings.get ('api.port')}/${arg.path}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    requestId: requestId
  }

  rp(options)
    .then(function (data) {
      var self = this
      log.info(`[${options.requestId}] Completed fetch for ${arg.from} - ${options.uri} `)
      event.sender.send('api-data', data)
    })
    .catch(function (err) {
      // API call failed...
    }) // do child process or other data manipulation and name it manData
})
