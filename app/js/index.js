const APP_IPC = require('./ipc-messages.js')

const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const $ = jQuery = require('jquery')
const _ = require('lodash')
const backbone = require('backbone')
const joint = require('jointjs')
const {Pokey} = require('./js/lib/pokey')
const {SimhubManagerTree} = require('./js/lib/simhubManagerTree')
const { PokeyShape } = require('./js/lib/pokeyShape')
const {PinEditableTable} = require('./js/lib/pinEditableTable')
const {EncoderEditableTable} = require('./js/lib/encoderEditableTable')

var loaded = 'index.js'
log.info(`${loaded}`)

let pokeysConfig = []
let pokeys = []
let deviceTree = undefined

/**
 *  Configure the system based on the URL provided
 *  and create the main UI deviceTree and expand it
 */
ipc.on(APP_IPC.IPCMSG_CONFIG_URL_DATA, function (event, val) {
  log.info('index - on[api-data]')
  deviceTree =
    new SimhubManagerTree({el: $('#jstree_demo_div'), name: 'simhub'})

  pokeysConfig = []
  _.each(val, function (data) {
    pokeysConfig.push(data)
  })

  loadConfig(pokeysConfig)
  deviceTree.render(pokeys)
  deviceTree.expand('#')
})

/**
 *  Render out the digital input and digital output (pins)
 *  into the properties section of the main config screen
 */
ipc.on(APP_IPC.IPCMSG_RENDER_DIO_PROPERTIES, function (event, node) {
  var pinEditableTable = new PinEditableTable(node, pokeys[node.pokeyIndex])
  $('#properties').html(pinEditableTable.render())
  $('.isEditable').editable()
})

ipc.on(APP_IPC.IPCMSG_RENDER_ENCODER_PROPERTIES, function (event, node) {
  var encoderEditableTable = new EncoderEditableTable(node, pokeys[node.pokeyIndex])
  $('#properties').html(encoderEditableTable.render())
  $('.isEditable').editable()
})

$(function () {
  // Tell x-editable to use inline
  $.fn.editable.defaults.mode = 'inline'

  $('#indexOpenButton').on('click', function (e) {
    ipc.send(APP_IPC.IPCMSG_OPEN_QUICK_START, {from: 'index'})
  })

  $('.topPanel').resizable({ handleSelector: '.splitter', resizeHeight: true })

  // var paper = Raphael(222, 0, 1000, 1000)
  // var rect = paper.rect(50, 50, 100, 100)

// var c = paper.image('images/pokey57E.jpg', 50, 50, 120, 280)
})

/**
 * Load the system configuration from the JSON config supplied
 *
 * @param {*} config 
 */
function loadConfig (config) {
  _.each(config, function (pokey, pokeyIndex) {
    var device = new Pokey(pokey.name, pokeyIndex)
    device.setSerialNumber(pokey.serialNumber)

    if (pokey.pins !== undefined && pokey.pins.length > 0) {
      _.each(pokey.pins, function (pin, index) {
        var newPin = device.addPin(pin)
      })
    }

    if (pokey.encoders !== undefined && pokey.encoders.length > 0) {
      _.each(pokey.encoders, function (encoder, index) {
        var newEncoder = device.addEncoder(encoder)
      })
    }

    if (pokey.displays !== undefined && pokey.displays.length > 0) {
      _.each(pokey.displays, (display, index) => {
        var newDisplay = device.addDisplay(display, index)})
    }

    pokeys.push(device)
  })
}
