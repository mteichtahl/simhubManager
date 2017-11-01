const APP_IPC = require('../ipc-messages.js')
const APP = require('../app-messages.js')

let ipc = require('electron').ipcMain
const electron = require('electron')

const guid = require('guid')
const URL = require('url-parse')
const url = require('url')
const path = require('path')

const _ = require('underscore')
const util = require('util')

const ApplicationViewController = require('./applicationViewController')

const BrowserWindow = electron.BrowserWindow

class MainViewController extends ApplicationViewController {
  /**
   * Creates an instance of MainViewController.
   * @memberof MainViewController
   */
  constructor () {
    super()
    this.app = require('electron').app

    this.quickStartWindow = null

    ipc.on(APP_IPC.IPCMSG_CLOSE_QUICKSTART, this.onIPCCloseQuickStartEvent.bind(this))
    ipc.on(APP_IPC.IPCMSG_OPEN_QUICK_START, this.onIPCOpenQuickStartDialog.bind(this))
    ipc.on(APP_IPC.IPCMSG_OPEN_SIMHUB_CONFIG_URL, this.onIPCSimhubURLGoButton.bind(this))
    ipc.on(APP_IPC.IPCMSG_CREATE_SIMHUB_CONFIG, this.onIPCSimhubCreateNewButton.bind(this))
    ipc.on(APP_IPC.IPCMSG_UPDATE_PROPERTIES, this.onUpdateProperties.bind(this))

    this.app.on(APP.READY, this.appReady.bind(this))
    this.app.on(APP.ACTIVATE, this.onElectronAppActivate.bind(this))
    this.app.on(APP.WINDOWS_ALL_CLOSED, this.onElectronAppWindowsAllClosed.bind(this))
  }

  /**
   * udates MRU configuration data 
   * @param {any} data fds fdsa
   * @return {(Array)} ordered list of time stamped MRU itemd
   * @memberof MainViewController fdsa fdsa
   */
  addToRecent (data) {
    const recent = settings.get('recent')
    if (recent.length <= 3) {
      recent.push(data)
    } else {
      recent[0] = data
    }
    return _.sortBy(recent, 'ts')
  }

  /**
   * Handle device tree property changes
   *
   * @param {any} event trigger event 
   * @param {any} node Node selected
   * @memberof MainViewController
   */
  onUpdateProperties (event, node) {
    const type = (node.data.type).toUpperCase()

    if (type == 'DIGITAL_INPUT' || type == 'DIGITAL_OUTPUT') {
      event.sender.send(APP_IPC.IPCMSG_RENDER_DIO_PROPERTIES, node.data)
    }
    if (type == 'FAST' || type == 'NORMAL' || type == 'UFAST') {
      event.sender.send(APP_IPC.IPCMSG_RENDER_ENCODER_PROPERTIES, node.data)
    }
    if (type == 'MICRODRIVER') {
      event.sender.send(APP_IPC.IPCMSG_RENDER_DISPLAY_PROPERTIES, node.data)
    }
    if (type == 'ANALOG') {
      event.sender.send(APP_IPC.IPCMSG_RENDER_SERVO_PROPERTIES, node.data)
    }
  }

  /**
   * (re-)create the main quick start window
   *
   * @return {(BrowserWindow)} Browser window
   * @memberof MainViewController
   */
  openQuickStartDialog () {
    let result = new BrowserWindow({
      'width': 750,
      'height': 500,
      'min-width': 500,
      'min-height': 200,
      'accept-first-mouse': true,
      'title-bar-style': 'hidden',
      'resize': false,
      'parent': null,
      'minimizable': false,
      'maximizable': false,
      'frame': true
    })

    result.webContents.openDevTools()

    // and load the index.html of the app.
    result.loadURL(url.format({
      pathname: path.join(__dirname + '/../../', 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    result.on('closed', function () {
      log.info('Closing quick start window')
      result = null
    })

    return result
  }

  // -- event handlers

  // called when the config retrieval from the simhub instance has completed
  onSimhubOpenURLDone (callbackArg, apiData) {
    let documentWindow = this.createDocumentWindow()
    this.documentWindows.push(documentWindow)

    // wait till the dom has loaded before telling it to load the given
    // configuration
    documentWindow.webContents
      .on('dom-ready',
        function () {
          documentWindow.webContents.send(
            APP_IPC.IPCMSG_CONFIG_URL_DATA, apiData)
        })

    // hide the quickstart window
    this.quickStartWindow.close()
  }

  onIPCSimhubCreateNewButton (event) {
    this.documentWindows.push(this.createDocumentWindow())
    this.quickStartWindow.close()
  }

  onIPCSimhubURLGoButton (event, arg) {
    // const requestId = guid.raw()
    const parsedURL = new URL(arg)
    const url = parsedURL.protocol + '//' + parsedURL.hostname
    const port = parsedURL.port != '' ? parsedURL.port : 3000
    const host = url + ':' + port

    settings.set('api.url', url, {prettify: true})
      .set('api.port', port, {prettify: true})

    // request the configuration data from the given simhub instance
    this.callAPI(
      {from: 'app', host: host, path: 'configuration'},
      this.onSimhubOpenURLDone.bind(this), event)

    settings.set(
      'recent',
      this.addToRecent({type: 'url', data: host, ts: new Date().getTime()}))
  }

  onIPCCloseQuickStartEvent () {
    this.quickStartWindow.close()
  }

  onIPCOpenQuickStartDialog (event, arg) {
    this.quickStartWindow = this.openQuickStartDialog()
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  appReady () {
    log.info('Application is ready')
    log.info('api url - ' + settings.get('api.url'))

    if (settings.get('quickStart', true)) {
      log.info('Using quickStart')
      this.quickStartWindow = this.openQuickStartDialog()
    }
  }

  onElectronAppActivate () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (this.quickStartWindow === null) {
      this.quickStartWindow = this.openQuickStartDialog()
    }
  }

  onElectronAppWindowsAllClosed () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    console.log('quitting')
    this.app.quit()
  }
}

module.exports = MainViewController
