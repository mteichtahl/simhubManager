'use strict'

const _ = require('lodash')
const guid = require('guid')

class PokeyServo {
  constructor (data, pokeyIndex) {
    this.name = data.name
    this.description = data.description || ''
    this.pin = data.pin
    this.period = data.period
    this.channel = data.channel
    this.units = data.units
    this.min = data.min
    this.max = data.max
    this.default = data.default
    this.type = data.type
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
      case 'analog':
        return 'images/outputIcon.png'
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

exports.PokeyServo = PokeyServo
