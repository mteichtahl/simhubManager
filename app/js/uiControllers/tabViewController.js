const APP_IPC = require('../ipc-messages.js')

const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const jQuery = $ = require('jquery')

class TabViewController {

  constructor () {
    console.log('tabViewController')
    this.APP_IPC = APP_IPC
  }

}

module.exports = TabViewController
