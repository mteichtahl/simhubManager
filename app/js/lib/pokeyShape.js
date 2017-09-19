'use strict'

const _ = require('lodash')
const backbone = require('backbone')
const joint = require('jointjs')

const portRadius = 5
const outPortColor = '#66FF66'
const inPortColor = '#FF0000'

class PokeyShape extends joint.shapes.devs.Model {

  constructor (suppliedConfig) {
    function label (config) {
      if (config.description == undefined)
        return config.name
      else
        return config.name + '\n' + config.description
    }

    function refy (config) {
      if (config.description == undefined)
        return -20
      else
        return -45
    }

    let config = _.defaultsDeep(suppliedConfig, {
      size: { width: 30, height: 30 },
      attrs: {
        '.label': { text: label(suppliedConfig),  'ref-x': 15, 'ref-y': refy(suppliedConfig) },
        rect: { fill: '#FFFFFF' }
      },
      ports: {
        groups: {
          'out': {
            label: {
              position: {
                name: 'right',
                args: { y: 0, x: 10, angle: 0 }
              }
            },
            attrs: {
              '.port-body': {
                fill: outPortColor,
                r: portRadius
              }
            }
          },
          'in': {
            label: {
              position: {
                name: 'left',
                args: { y: 0, x: -10, angle: 0 }
              }
            },
            attrs: {
              '.port-body': {
                fill: inPortColor,
                r: portRadius
              }
            }
          }
        }
      }
    })
    super(config)
    this.name = config.name
    this.ports = []
  }

  color (color) {
    super.attr({
      rect: { fill: color }
    })
  }

  addPort (port) {
    if (this.ports !== undefined)
      this.ports.push(port)

    if (port.direction == 'in') {
      super.addInPort(port.name)
    } else {
      super.addOutPort(port.name)
    }
    this.resize()
    return this
  }

  resize () {
    var inPorts = _.filter(this.ports, function (port) { return port.direction == 'in'; })
    var outPorts = _.filter(this.ports, function (port) { return port.direction == 'out'; })

    var count = inPorts.length >= outPorts.length ? inPorts.length : outPorts.length

    let height = 2 * (portRadius * count + (3 * portRadius)) + portRadius
    super.resize(30, height)
  }

}

exports.PokeyShape = PokeyShape
