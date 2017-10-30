'use strict'

const _ = require('lodash')
const guid = require('guid')

class PokeyPin {
  constructor (data, pokeyIndex) {
    this.name = data.name
    this.description = data.description
    this.pin = data.pin
    this.type = data.type
    this.disabled = false
    this.inverted = data.inverted
    this.pokeyIndex = pokeyIndex

    if (data.default !== undefined) {
      this.default = data.default
    }

    this.tree = {}
    this.tree.parentNodeId = undefined
    this.tree.nodeId = undefined
    this.tree.icon = this._getIcon()
  }

  _getIcon () {
    switch (this.type) {
      case 'DIGITAL_OUTPUT':
        return 'images/outputIcon.png'
      case 'DIGITAL_INPUT':
        return 'images/inputIcon.png'
      case 'DIGITAL_INPUT_ENCODER_UFAST':
        this.disabled = true
        return 'images/rotaryUfastIcon.png'
      case 'DIGITAL_INPUT_ENCODER_FAST':
        this.disabled = true
        return 'images/rotaryFastIcon.png'
      case 'DIGITAL_INPUT_ENCODER':
        this.disabled = true
        return 'images/rotaryIcon.png'
      case 'DIGITAL_OUTPUT_DISPLAY':
        this.disabled = true
        return 'images/displayIcon.png'
      case 'DIGITAL_OUTPUT_PWM':
        this.disabled = true
        return 'images/servoIcon.png'
    }
  }

  setParentNodeTreeId (parent) {
    this.tree.parentNodeId = parent
  }

  setNodeTreeId (nodeId) {
    this.tree.nodeId = nodeId
  }

  getTreeNode () {
    return {'text': `[${this.pin}] ${this.name}`, 'icon': this.tree.icon}
  }

  getPokeyIndex () {
    return this.pokeyIndex
  }
}

exports.PokeyPin = PokeyPin
