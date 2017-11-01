'use strict';


const electron = require('electron');
const { remote } = require('electron');
let ipc = require('electron').ipcMain;

const guid = require('guid');
const URL = require('url-parse');
const url = require('url');
const path = require('path');

const _ = require('underscore');
const util = require('util')

const MainViewController = require('./app/js/uiControllers/mainViewController');

global.log = require('electron-log');
log.transports.file.level = false;
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}';


global.settings = require('electron-settings');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

settings.setPath('app/config/config.json');

/**
 * createDocumentWindows
 *
 * Creates the main document window
 *
 * @return {BrowserWindow} documentWindow
 */
function createDocumentWindow() {
  log.info('Creating document window');
  global.settings = settings;

  // Create the browser window
  let documentWindow = new BrowserWindow({
    'width': 1350,
    'height': 800,
    'center': true,
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
  }));

  // Emitted when the window is closed.
  documentWindow.on('closed', function() {
      log.info('Closing document window');
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      documentWindow = null;
    });

  return documentWindow;
}
/**
 * Main application view controller
 *
 * @class MainViewController
 * @extends {ApplicationViewController}
 */


let MainController = new MainViewController();
