'use strict'

const _ = require('lodash')
const guid = require('guid')
const { PokeyDisplayGroup } = require('./pokeyDisplayGroup')

class PokeyDisplay {
  constructor (data) {
    this.name = data.name
    this.description = data.description
    this.type = data.type
    this.enabled = data.enabled
    this.displayGroups = []

    this.tree = {}
    this.tree.parentNodeId = undefined
    this.tree.nodeId = undefined
    this.tree.icon = this._setIcon()

    if (data.groups !== undefined && data.groups.length > 0) {
      var self = this
      _.each(data.groups, (group) => {
        var newGroup = new PokeyDisplayGroup(group)
        newGroup.type = data.type
        self.displayGroups.push(newGroup)
      })
    }
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

exports.PokeyDisplay = PokeyDisplay
