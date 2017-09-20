const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const $ = jQuery = require('jquery')
const _ = require('lodash')
const backbone = require('backbone')
const joint = require('jointjs')
const { Pokey } = require('./js/lib/pokey')
const { SimhubManagerTree } = require('./js/lib/simhubManagerTree')

var {PokeyShape} = require('./js/lib/pokeyShape')

var loaded = 'index.js'
log.info(`${loaded}`)

let pokeysConfig = []
let pokeys = []

ipc.on('api-data', function (event, val) {
  _.each(val, function (data) {
    pokeysConfig.push(data)
  })
})

ipc.send('get-api-data', {
  path: 'pokeys',
  from: 'index'
})

$(function () {
  let deviceTree = new SimhubManagerTree($('#jstree_demo_div'))

  _.each(pokeysConfig, function (pokey, pokeyIndex) {
    var device = new Pokey(pokey.name)
    device.setSerialNumber(pokey.serialNumber)

    if (pokey.pins !== undefined && pokey.pins.length > 0) {
      _.each(pokey.pins, (pin) => {
        var newPin = device.addPin(pin)
        if (newPin !== undefined) {
          // var pinNodeId = $deviceTree.jstree().create_node(pokeyTreePinParentNodeId, newPin.getTreeNode())
          // newPin.setNodeTreeId(pinNodeId)
        }
      })
    }

    if (pokey.encoders !== undefined && pokey.encoders.length > 0) {
      // var pokeyTreeEncoderParentNodeId = $deviceTree.jstree().create_node(
      //   pokeyTreeNodeId, {
      //     'text': `Encoders (${pokey.encoders.length}/8)`,
      //     'icon': 'images/rotarysIcon.png'
      //   })
      _.each(pokey.encoders, (encoder) => {
        var newEncoder = device.addEncoder(encoder)
      // if (newEncoder !== undefined) {
      //   var encoderNodeId = $deviceTree.jstree().create_node(pokeyTreeEncoderParentNodeId, newEncoder.getTreeNode())
      //   newEncoder.setNodeTreeId(encoderNodeId)
      // }
      })
    }

    pokeys.push(device)
  })

  deviceTree.render(pokeys)

  $('.topPanel').resizable({
    handleSelector: '.splitter',
    resizeHeight: true
  })

// $deviceTree.bind('loading.jstree', function (e, data) {
//   log.info('Device tree loading....')
// })
//   .bind('load_all.jstree', function (e, data) {
//     log.info('Device tree loaded')
//   })
//   .bind('ready.jstree', function (e, data) {
//     log.info('Device tree ready')
//   })
//   .bind('hover_node.jstree', function (e, data) {
//     console.log(data)
//     log.info('hovering')
//   })
})

var graph = new joint.dia.Graph

var paper = new joint.dia.Paper({
  el: $('#diagram'),
  width: '100%',
  height: '600',
  model: graph,
  gridSize: 1,
  defaultLink: new joint.dia.Link({
    attrs: {
      '.marker-target': {
        d: 'M 10 0 L 0 5 L 10 10 z'
      }
    }
  }),
  validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('port-group') === 'in') return false
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false
    // Prevent linking to input ports.
    return magnetT && magnetT.getAttribute('port-group') === 'in'
  },
  snapLinks: {
    radius: 75
  },
  markAvailable: true
})

// const shape = new PokeyShape({
//   name: 'pokey_2',
//   description: 'electrical Panel',
//   position: { x: 450, y: 100 }
// })

// const shape2 = new PokeyShape({
//   name: 'pokey_1',
//   description: 'electrical Panel',
//   position: { x: 450, y: 100 }
// })

// shape.addTo(graph)
//   .addPort({ name: '1', direction: 'in' })
//   .addPort({ name: '2', direction: 'in' })
//   .addPort({ name: '3', direction: 'in' })
//   .addPort({ name: 'out', direction: 'out' })
//   .addPort({ name: 'wee', direction: 'out' })
//   .addPort({ name: 'poo', direction: 'out' })
//   .addPort({ name: 'kaka', direction: 'out' })
//   .addPort({ name: 'poopoo', direction: 'out' })
//   .addPort({ name: 'kakaka', direction: 'out' })
//   .addPort({ name: 'weewee', direction: 'out' })
//   .addPort({ name: 'sasa', direction: 'out' })
//   .addPort({ name: 'a', direction: 'out' })
//   .addPort({ name: 'b', direction: 'out' })

// shape2.addTo(graph)
//   .addPort({ name: '1', direction: 'in' })
//   .addPort({ name: '2', direction: 'in' })
//   .addPort({ name: '3', direction: 'in' })
//   .addPort({ name: 'out', direction: 'out' })
//   .addPort({ name: 'wee', direction: 'out' })
//   .addPort({ name: 'poo', direction: 'out' })
//   .addPort({ name: 'kaka', direction: 'out' })
//   .addPort({ name: 'poopoo', direction: 'out' })
//   .addPort({ name: 'kakaka', direction: 'out' })
//   .addPort({ name: 'weewee', direction: 'out' })
//   .addPort({ name: 'sasa', direction: 'out' })
//   .addPort({ name: 'a', direction: 'out' })
//   .addPort({ name: 'b', direction: 'out' })
