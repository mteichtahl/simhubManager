'use strict'

const _ = require('lodash')
const { Tree } = require('./tree')

class SimhubManagerTree extends Tree {

  constructor (el) {
    super(el)
  }

  /**
   * render entire tree
   * @param {*} data 
   */
  render (data) {
    var self = this

    _.each(data, function (pokey, index) {
      var pokeyTreeNodeId = self.addNode('#', {
        'text': `${pokey.name} (${pokey.serialNumber})`,
        'icon': 'images/pokeyIcon.png'
      })

      pokey.tree.nodeId = pokeyTreeNodeId
      pokey.tree.parentNodeId = '#'

      if (pokey.pins !== undefined && pokey.pins.length > 0)
        self.renderPins(pokey.pins, pokeyTreeNodeId)

      if (pokey.encoders !== undefined && pokey.encoders.length > 0)
        self.renderEncoders(pokey.encoders, pokeyTreeNodeId)
    })
  }

  /**
   * Render all pins
   * @param {*} pins 
   * @param {*} parentNodeId 
   */
  renderPins (pins, parentNodeId) {
    var self = this

    var pokeyTreePinParentNodeId = self.addNode(
      parentNodeId, {
        'text': `Digital I/O (${pins.length}/55)`,
        'icon': 'images/ioIcon.png'
      })

    _.each(pins, (pin) => {
      self.renderPin(pin, pokeyTreePinParentNodeId)
    })
  }

  /**
   * render a pin
   * @param {*} pins 
   * @param {*} parentNodeId 
   */
  renderPin (pin, parentNodeId) {
    var self = this
    var nodeId = self.addNode(
      parentNodeId, {
        'text': `[${pin.pin}] ${pin.name}`,
        'icon': pin.tree.icon
      })
    pin.tree.nodeId = nodeId
    pin.tree.parentNodeId = parentNodeId
    if (pin.disabled)
      self.disableNode(nodeId)
  }

  /**
   * render all encoders
   * @param {*} encoders 
   * @param {*} parentNodeId 
   */
  renderEncoders (encoders, parentNodeId) {
    var self = this

    var pokeyTreeEncoderParentNodeId = self.addNode(
      parentNodeId, {
        'text': `Encoders (${encoders.length}/8)`,
        'icon': 'images/rotarysIcon.png'
      })

    _.each(encoders, (encoder) => {
      self.renderEncoder(encoder, pokeyTreeEncoderParentNodeId)
    })
  }

  renderEncoder (encoder, parentNodeId) {
    var self = this
    var nodeId = self.addNode(
      parentNodeId, {
        'text': `${encoder.name}`,
        'icon': encoder.tree.icon
      })
    encoder.tree.nodeId = nodeId
    encoder.tree.parentNodeId = parentNodeId
  }

}

exports.SimhubManagerTree = SimhubManagerTree
