'use strict'

const _ = require('lodash')
const guid = require('guid')

class PokeyEncoder {
  constructor (data, pokeyIndex) {
    console.log('here', data)
    this.name = data.name
    this.description = data.description
    this.type = data.type
    this.number = data.encoder
    this.inverted = data.invertDirection
    this.step = data.step
    this.default = data.default
    this.max = data.max
    this.min = data.min
    this.units = data.units
    this.pins = data.pins
    this.pokeyIndex = pokeyIndex

    this.tree = {}
    this.tree.parentNodeId = undefined
    this.tree.nodeId = undefined
    this.tree.icon = this._setIcon()
  }

  _setIcon () {
    switch (this.type) {
      case 'fast':
        return 'images/rotaryFastIcon.png'
      case 'ufast':
        return 'images/rotaryUfastIcon.png'
      default:
        return 'images/rotaryIcon.png'
    }
  }

  setParentNodeTreeId (parent) {
    this.tree.parentNodeId = parent
  }

  setNodeTreeId (nodeId) {
    this.tree.nodeId = nodeId
  }

  getTreeNode () {
    return {
      'text': `${this.name}`,
      'icon': this.tree.icon
    }
  }

  getPokeyIndex () {
    return this.pokeyIndex
  }

  setPins (pins) {
    this.pins = pins
  }

}

exports.PokeyEncoder = PokeyEncoder
