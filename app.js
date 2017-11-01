const MainViewController = require('./app/js/uiControllers/mainViewController')

global.log = require('electron-log')
global.settings = require('electron-settings')

log.transports.file.level = false
log.transports.console.format = '{h}:{i}:{s}:{ms} [{level}] {text}'

settings.setPath('app/config/config.json')

/**
 * Main application view controller
 *
 * @class MainViewController
 * @extends {ApplicationViewController}
 */

let MainController = new MainViewController()
