const electron = require('electron')
const {remote} = require('electron')
const {app, Menu} = require('electron')

const URL = require('url-parse')
let rp = require('request-promise')
let guid = require('guid')
let ipc = require('electron').ipcMain
let _ = require('underscore')

global.log = require('electron-log')
global.settings = require('electron-settings')

let util = require('util')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let quickStartWindow

log.transports.file.level = false
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}'

function createWindow () {
  log.info('Creating main window')
  global.settings = settings

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 800,
    center: true,
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

function openQuickStartDialog () {
  quickStartWindow = new BrowserWindow({
    width: 750,
    height: 500,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    resize: false,
    parent: mainWindow,
    minimizable: false,
    maximizable: false,
    frame: false
  })

  quickStartWindow.webContents.openDevTools()

  // and load the index.html of the app.
  quickStartWindow.loadURL(
    url.format({
      pathname: path.join(__dirname + /app/, 'quickStart.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  quickStartWindow.on('closed', function () {
    log.info('Closing quick start window')
    quickStartWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log.info('Application is ready')
  log.info('api url - ' + settings.get('api.url'))
  createWindow()

  if (settings.get('quickStart', true)) {
    log.info('Using quickStart')
    openQuickStartDialog()
  }
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

// ipc.on('open-config-dialog', function (event, arg) {
//   log.info('Opening config window')
//   var configWindow = new BrowserWindow({
//     parent: mainWindow,
//     frame: true,
//     // modal: true,
//     width: 650,
//     height: 500,
//     'min-width': 500,
//     'min-height': 200,
//     'accept-first-mouse': true,
//     'title-bar-style': 'hidden'
//   })
//   configWindow.webContents.openDevTools()

//   configWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname + /app/, 'configDialog.html'),
//       protocol: 'file:',
//       slashes: true
//     })
//   )

//   // Emitted when the window is closed.
//   configWindow.on('closed', function () {
//     log.info('Closing config window')
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// })

ipc.on('close-quick-start', (event, arg) => {
  quickStartWindow.close()
})

ipc.on('openQuickStartDialog', (event, arg) => {
  openQuickStartDialog()
})

function addToRecent (data) {
  var recent = settings.get('recent')
  if (recent.length <= 3)
    recent.push(data)
  else
    recent[0] = data

  return _.sortBy(recent, 'ts')
}

function callAPI (params, cb) {
  console.log(params)
  var requestId = guid.raw()
  log.info(`[${requestId}] ${params.from} fetching ${params.path} from API `)

  var options = {
    uri: `${params.host}/${params.path}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    requestId: requestId,
    from: params.from,
    host: params.host,
    path: params.path
  }

  rp(options)
    .then(function (data) {
      var self = this
      log.info(
        `[${options.requestId}] Completed fetch for ${options.from} - ${options.uri} `
      )
      cb(data)
    })
    .catch(function (err) {
      console.log('FAILED', err)
    }) // 
}

ipc.on('simhubUrlGoButton', function (event, data) {
  var self = this
  var requestId = guid.raw()
  var parsedURL = new URL(data)
  var url = parsedURL.protocol + '//' + parsedURL.hostname
  var port = parsedURL.port != '' ? parsedURL.port : 3000
  var host = url + ':' + port

  settings
    .set('api.url', url, {prettify: true})
    .set('api.port', port, { prettify: true })

  callAPI({ from: 'app', host: host, path: 'pokeys' },
    function (apiData) {
      event.sender.send('api-data', apiData)
      settings.set('recent', addToRecent({
        type: 'url',
        data: data,
        ts: new Date().getTime()
      }))
      quickStartWindow.close()
      mainWindow.webContents.send('api-data', apiData)
    })
})
