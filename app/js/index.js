const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const $ = jQuery = require('jquery')
const _ = require('lodash')
const backbone = require('backbone')
const joint = require('jointjs')

var {PokeyShape} = require('./js/lib/pokeyShape')

var loaded = 'index.js'
log.info(`${loaded}`)

let pokeys = []

ipc.on('api-data', function (event, val) {
  _.each(val, function (data) {
    pokeys.push(data)
  })
})

ipc.send('get-api-data', {
  path: 'pokeys',
  from: 'index'
})

$(function () {
  let $deviceTree = $('#jstree_demo_div')

  $deviceTree.jstree({
    'core': {
      'check_callback': true,
      'multiple': false,
      'animation': 0,
      'themes': {
        'responsive': false
      }
      // 'data': [
      //   {
      //     'text': 'Pro-Sim',
      //     'icon': 'images/simIcon.png'
      //   },
      //   {
      //     'text': 'Elec (pokey_2)',
      //     'icon': 'images/pokeyIcon.png',
      //     'children': [
      //       {
      //         'text': 'Digital IO (3/55)',
      //         'icon': 'images/ioIcon.png',
      //         children: [
      //           {
      //             'text': 'Lights On (1)',
      //             'icon': 'images/switchIcon.png',
      //             'children': [
      //               {
      //                 'text': 'Pin 1',
      //                 'icon': 'images/inputIcon.png'
      //               },
      //               {
      //                 'text': 'Default On',
      //                 'icon': 'images/defaultIcon.png'
      //               },
      //               {
      //                 'text': 'Default On',
      //                 'icon': 'images/defaultIcon.png'
      //               }
      //             ]
      //           },
      //           {
      //             'text': 'LED 1 (1)',
      //             'icon': 'images/outputIcon.png',
      //             'children': [
      //               {
      //                 'text': 'Pin 2',
      //                 'icon': 'images/outputIcon.png'
      //               },
      //               {
      //                 'text': 'Default Off',
      //                 'icon': 'images/defaultIcon.png'
      //               }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         'text': 'Displays (1)',
      //         'icon': 'images/displaysIcon.png',
      //         'children': [
      //           {
      //             'text': 'EGT',
      //             'icon': 'images/displayIcon.png'
      //           }
      //         ]
      //       },
      //       {
      //         'text': 'Servos (1)',
      //         'icon': 'images/servosIcon.png',
      //         'children': [
      //           {
      //             'text': 'Airspeed',
      //             'icon': 'images/servoIcon.png'
      //           }
      //         ]
      //       },
      //       {
      //         'text': 'Rotaries (1)',
      //         'icon': 'images/rotarysIcon.png',
      //         'children': [
      //           {
      //             'text': 'Volume (5/6/9)',
      //             'icon': 'images/rotaryIcon.png'
      //           }
      //         ]
      //       }

    //     ]
    //   }
    // ]
    },
    'plugins': ['contextmenu', 'unique', 'types', 'state']
  })

  _.each(pokeys, function (pokey, pokeyIndex) {
    var $deviceTree = $('#jstree_demo_div')

    var parentPokeyId = $deviceTree.jstree().create_node('#', {
      text: `${pokey.name} (${pokey.serialNumber})`,
      'icon': 'images/pokeyIcon.png'
    })
    pokeys[pokeyIndex].nodeId = parentPokeyId

    if (pokey.pins.length >0 ) {
      var pinParentId = $deviceTree.jstree().create_node(parentPokeyId, {
        text: `Digital IO (${pokey.pins.length}/55)`,
        icon: 'images/ioIcon.png'
      })

      _.each(pokey.pins, function (pin, pinIndex) {
        var pinId = $deviceTree.jstree().create_node(pinParentId, {
          text: `[${pin.pin}] ${pin.name}`,
          icon: pin.type == 'DIGITAL_OUTPUT' ? 'images/outputIcon.png' : 'images/inputIcon.png'
        })
        pokeys[pokeyIndex].pins[pinIndex].nodeId = pinId
        pokeys[pokeyIndex].pins[pinIndex].parentNodeId = pinParentId
      })
    }
  })

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
