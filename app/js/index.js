const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const TabGroup = require('electron-tabs')

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
