'use strict'
let APP_IPC = require('./js/ipc-messages.js')
let ipc = require('electron').ipcRenderer
let log = require('electron').remote.getGlobal('log')
let $ = require('jquery'), jQuery = $
let TabGroup = require('electron-tabs')

var loaded = 'index.js'
log.info(`${loaded}`)

$(function () {
  let tabGroup = new TabGroup()

  let configureTab = tabGroup.addTab({
    title: 'Configure',
    src: './configView.html',
    webviewAttributes: {
      'nodeintegration': true
    },
    icon: 'fa fa-cog',
    visible: true,
    closable: false,
    active: true,
    ready: tab => {
      let webview = tab.webview
      if (!!webview) {
        webview.addEventListener('dom-ready', () => {
          webview.openDevTools()
        })
      }
    }
  }).activate()

  let approachTab = tabGroup.addTab({
    title: 'Approach',
    src: 'http://www.google.com',
    visible: true
  })
})
