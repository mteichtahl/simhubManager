const APP_IPC = require('./app/ipc-messages.js');

const electron = require('electron');
const {remote} = require('electron');

const URL = require('url-parse');
let rp = require('request-promise');
let guid = require('guid');
let ipc = require('electron').ipcMain;
let _ = require('underscore');

global.log = require('electron-log');
global.settings = require('electron-settings');

let util = require('util');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const url = require('url');
const path = require('path');

log.transports.file.level = false;
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}';

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

settings.setPath('app/config/config.json');

function createDocumentWindow() {
  log.info('Creating document window');
  global.settings = settings;

  // Create the browser window
  let documentWindow = new BrowserWindow({
    width: 1350,
    height: 800,
    center: true,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  documentWindow.webContents.openDevTools();



  // and load the index.html of the app.
  documentWindow.loadURL(url.format({
    pathname: path.join(__dirname + /app/, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  documentWindow.on(
      'closed',
      function() {
        log.info('Closing document window')
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        documentWindow = null
      })

      return documentWindow;
}

/**
 * This basic view controller class serves to provide shared
 * controller functionality between the application controller
 * and the various document controllers used by the pokey config
 * editor application
 */

class ConfigurationViewController {
  /**
   * Invokes REST endpoint configured by @param
   * @param {*} endpoint parameters (host, path)
   * @param {*} function to invoke when REST request complete
   * @param {*} argument to pass through to completion callback
   */
  callAPI(params, cb, callbackArg) {
    var requestId = guid.raw()
    log.info(`[${requestId}] ${params.from} fetching ${params.path} from API `);

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
            .then(function(data) {
              log.info(
                  `[${
                      options.requestId
                    }] Completed fetch for ${options.from} - ${options.uri} `);
              cb(callbackArg, data);
            })
            .catch(function(err) {
              console.log('FAILED', err);
            })
  }
}

class PokeyConfigurationEditorController extends ConfigurationViewController {
  constructor() {
    super();
    this.app = require('electron').app;

    this.documentWindows = new Array();
    this.quickStartWindow = null;

    ipc.on(
        APP_IPC.IPCMSG_CLOSE_QUICKSTART, this.onIPCCloseQuickStart.bind(this));
    ipc.on(
        APP_IPC.IPCMSG_OPEN_QUICK_START,
        this.onIPCOpenQuickStartDialog.bind(this));
    ipc.on(
        APP_IPC.IPCMSG_OPEN_SIMHUB_CONFIG_URL,
        this.onIPCSimhubURLGoButton.bind(this));
    ipc.on(
        APP_IPC.IPCMSG_CREATE_SIMHUB_CONFIG,
        this.onIPCSimhubCreateNewButton.bind(this));

    this.app.on('ready', this.onElectronAppReady.bind(this));
    this.app.on('activate', this.onElectronAppActivate.bind(this));
    this.app.on(
        'window-all-closed', this.onElectronAppWindowsAllClosed.bind(this));
  }

  // udates MRU configuration data (used in quickstart jumpscreen)
  addToRecent(data) {
    var recent = settings.get('recent');
    if (recent.length <= 3) {
      recent.push(data);
    } else {
      recent[0] = data;
    }

    return _.sortBy(recent, 'ts');
  }

  // -- (re-)create the main quick start window
  openQuickStartDialog() {
    let result = new BrowserWindow({
      width: 750,
      height: 500,
      'min-width': 500,
      'min-height': 200,
      'accept-first-mouse': true,
      'title-bar-style': 'hidden',
      resize: false,
      parent: null,
      minimizable: false,
      maximizable: false,
      frame: false
    });

    // and load the index.html of the app.
    result.loadURL(url.format({
      pathname: path.join(__dirname + /app/, 'quickStart.html'),
      protocol: 'file:',
      slashes: true
    }));

    result.on('closed', function() {
      log.info('Closing quick start window');
      result = null;
    });

    return result
  }

  // -- event handlers

  // called when the config retrieval from the simhub instance has completed
  onSimhubOpenURLDone(callbackArg, apiData) {
    let documentWindow = createDocumentWindow();
    this.documentWindows.push(documentWindow)

    // wait till the dom has loaded before telling it to load the given
    // configuration
    documentWindow.webContents
        .on('dom-ready',
            function() {
              documentWindow.webContents.send(
                  APP_IPC.IPCMSG_CONFIG_URL_DATA, apiData);
            })

        // hide the quickstart window
        this.quickStartWindow.close()
  }

  onIPCSimhubCreateNewButton(event) {
    this.documentWindows.push(createDocumentWindow());
    this.quickStartWindow.close()
  }

  onIPCSimhubURLGoButton(event, arg) {
    var requestId = guid.raw();
    var parsedURL = new URL(arg);
    var url = parsedURL.protocol + '//' + parsedURL.hostname;
    var port = parsedURL.port != '' ? parsedURL.port : 3000;
    var host = url + ':' + port;

    settings.set('api.url', url, {prettify: true})
        .set('api.port', port, {prettify: true})

        // request the configuration data from the given simhub instance
        this.callAPI(
            {from: 'app', host: host, path: 'pokeys'},
            this.onSimhubOpenURLDone.bind(this), event);

    settings.set(
        'recent',
        this.addToRecent({type: 'url', data: host, ts: new Date().getTime()}));
  }

  onIPCCloseQuickStart(event) {
    this.quickStartWindow.close();
  }

  onIPCOpenQuickStartDialog(event, arg) {
    this.quickStartWindow = this.openQuickStartDialog();
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  onElectronAppReady() {
    log.info('Application is ready');
    log.info('api url - ' + settings.get('api.url'));

    if (settings.get('quickStart', true)) {
      log.info('Using quickStart');
      this.quickStartWindow = this.openQuickStartDialog();
    }
  }

  onElectronAppActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (this.quickStartWindow === null) {
      this.quickStartWindow = openQuickStartDialog();
    }
  }

  onElectronAppWindowsAllClosed() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    this.app.quit();
    console.log('quitting');
  }
}

let ApplicationController = new PokeyConfigurationEditorController()
