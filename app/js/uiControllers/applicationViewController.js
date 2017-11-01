let rp = require('request-promise')
let guid = require('guid')
const electron = require('electron')
const url = require('url')
const path = require('path')

/**
 * This basic view controller class serves to provide shared
 * controller functionality between the application controller
 * and the various document controllers used by the pokey config
 * editor application
 */

class ApplicationViewController {

  constructor () {
    this.documentWindows = []
    this.BrowserWindow = electron.BrowserWindow
  }

  /**
 * createDocumentWindows
 *
 * Creates the main document window
 *
 * @return {BrowserWindow} documentWindow
 */
  createDocumentWindow () {
    log.info('Creating document window')
    global.settings = settings

    // Create the browser window
    let documentWindow = new electron.BrowserWindow({
      'width': 1350,
      'height': 800,
      'center': true,
      'min-width': 500,
      'min-height': 200,
      'accept-first-mouse': true,
      'title-bar-style': 'hidden'
    })

    documentWindow.webContents.openDevTools()

    // and load the index.html of the app.
    documentWindow.loadURL(url.format({
      pathname: path.join(__dirname + '/../../', 'quickStart.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Emitted when the window is closed.
    documentWindow.on('closed', function () {
      log.info('Closing document window')
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      documentWindow = null
    })

    return documentWindow
  }
  /**
   * Invokes REST endpoint configured by @param
   * @param {*} endpoint parameters (host, path)
   * @param {*} function to invoke when REST request complete
   * @param {*} argument to pass through to completion callback
   */
  callAPI (params, cb, callbackArg) {
    console.log('ApplicationViewController::callAPI')
    var requestId = guid.raw()
    log.info(`[${requestId}] ${params.from} fetching ${params.path} from API `)

    var options =
    {
      uri: `${params.host}/${params.path}`,
      headers: {'User-Agent': 'Request-Promise'},
      json: true,
      requestId: requestId,
      from: params.from,
      host: params.host,
      path: params.path
    }

    rp(options)
      .then(function (data) {
        log.info(
          `[${options.requestId}] Completed fetch for ${options.from} - ${options.uri} `)
        cb(callbackArg, data)
      })
      .catch(function (err) {
        console.log('FAILED', err)
      })
  }
}

module.exports = ApplicationViewController
