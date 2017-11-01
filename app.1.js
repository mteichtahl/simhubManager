'use strict'

const electron = require('electron')
const { remote } = require('electron')
let ipc = require('electron').ipcMain

const guid = require('guid')
const URL = require('url-parse')
const url = require('url')
const path = require('path')

const _ = require('underscore')
const util = require('util')

const MainViewController = require('./app/js/uiControllers/mainViewController')

global.log = require('electron-log')
log.transports.file.level = false
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}'

global.settings = require('electron-settings')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

settings.setPath('app/config/config.json')

/**
 * Main application view controller
 *
 * @class MainViewController
 * @extends {ApplicationViewController}
 */

let MainController = new MainViewController()
