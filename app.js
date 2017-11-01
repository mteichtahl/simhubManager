'use strict';


const electron = require('electron');
const { remote } = require('electron');

const MainViewController = require('./app/js/uiControllers/mainViewController');

global.log = require('electron-log');
log.transports.file.level = false;
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}';

/**
 * Main application view controller
 *
 * @class MainViewController
 * @extends {ApplicationViewController}
 */

let MainController = new MainViewController();
