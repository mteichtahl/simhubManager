'use strict'

const _ = require('lodash')
const guid = require('guid')

class PokeyDisplayGroup {
  constructor (data) {
    this.name = data.name
    this.digits = data.digits
    this.position = data.position

    this.tree = {}
    this.tree.parentNodeId = undefined
    this.tree.nodeId = undefined
    this.tree.icon = this._setIcon()
  }

  _setIcon () {
    return 'images/displayIcon.png'
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
}

exports.PokeyDisplayGroup = PokeyDisplayGroup
