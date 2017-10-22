const $ = jQuery = require('jquery');
const APP_IPC = require('./ipc-messages.js');
const ipc = require('electron').ipcRenderer;
const log = require('electron').remote.getGlobal('log');
const _ = require('lodash');
const backbone = require('backbone');
const joint = require('jointjs');
const {Pokey} = require('./js/lib/pokey');
const {SimhubManagerTree} = require('./js/lib/simhubManagerTree');

var {PokeyShape} = require('./js/lib/pokeyShape');

var loaded = 'index.js';
log.info(`${loaded}`);

let pokeysConfig = [];
let pokeys = [];

ipc.on(APP_IPC.IPCMSG_CONFIG_URL_DATA, function(event, val) {
  _.each(val, function(data) {
    pokeysConfig.push(data);
  })
})

ipc.send(APP_IPC.IPCMSG_CONFIG_URL_DATA, {path: 'pokeys', from: 'index'});

$(function() {
  $('#configButton').on('click', function(e) {
    console.log('click');
    ipc.send(APP_IPC.IPCMSG_OPEN_CONFIG_DIALOG, {from: 'index'});
  })

  $('.topPanel').resizable({handleSelector: '.splitter', resizeHeight: true})
})

function loadConfig(config) {
  _.each(config, function(pokey, pokeyIndex) {
    var device = new Pokey(pokey.name);

    device.setSerialNumber(pokey.serialNumber);

    if (pokey.pins !== undefined && pokey.pins.length > 0) {
      _.each(pokey.pins, (pin, index) => {
        var newPin = device.addPin(pin);
      })
    }

    if (pokey.encoders !== undefined && pokey.encoders.length > 0) {
      _.each(pokey.encoders, (encoder, index) => {
        var newEncoder = device.addEncoder(encoder);
      })
    }

    if (pokey.displays !== undefined && pokey.displays.length > 0) {
      _.each(pokey.displays, (display, index) => {
        var newDisplay = device.addDisplay(display, index);
      })
    }

    pokeys.push(device)
  })
};

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
  el: $('#diagram'),
  width: '100%',
  height: '600',
  model: graph,
  gridSize: 1,
  defaultLink: new joint.dia.Link(
      {attrs: {'.marker-target': {d: 'M 10 0 L 0 5 L 10 10 z'}}}),
  validateConnection: function(
      cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('port-group') === 'in') return false
      // Prevent linking from output ports to input ports within one element.
      if (cellViewS === cellViewT) return false
      // Prevent linking to input ports.
      return magnetT && magnetT.getAttribute('port-group') === 'in'
  },
  snapLinks: {radius: 75},
  markAvailable: true
});

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
