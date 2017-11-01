'use strict'
const _ = require('lodash')
const APP_IPC = require('../../ipc-messages.js')
const {Tree} = require('./tree')
const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')

class SimhubManagerTree extends Tree {
  constructor (data) {
    super(data.el)
    this.rootNode =
      this.addNode('#', {'text': data.name, 'icon': 'images/simhubIcon.png'})
  }

  /**
   * render entire tree
   * @param {*} data
   */
  render (data) {
    var self = this

    _.each(data, function (pokey, index) {
      var pokeyTreeNodeId = self.addNode(self.rootNode, {
        'text': `${pokey.name} (${pokey.serialNumber})`,
        'icon': 'images/pokeyIcon.png'
      })

      pokey.tree.nodeId = pokeyTreeNodeId
      pokey.tree.parentNodeId = '#'

      if (pokey.pins !== undefined && pokey.pins.length > 0) {
        self.renderPins(pokey.pins, pokeyTreeNodeId)
      }

      if (pokey.encoders !== undefined && pokey.encoders.length > 0) {
        self.renderEncoders(pokey.encoders, pokeyTreeNodeId)
      }

      if (pokey.displays !== undefined && pokey.displays.length > 0) {
        self.renderDisplays(pokey.displays, pokeyTreeNodeId)
      }

      if (pokey.servos !== undefined && pokey.servos.length > 0) {
        self.renderServos(pokey.servos, pokeyTreeNodeId)
      }
    })
  }

  renderDisplays (displays, parentNodeId) {
    var self = this
    var pokeyTreeDisplayParentName = self.addNode(parentNodeId, {
      'text': `Displays (${displays.length})`,
      'icon': 'images/displaysIcon.png'
    })

    _.each(displays, (display, index) => {
      var self = this
      var pokeyTreeDisplayParentNodeId = self.addNode(
        pokeyTreeDisplayParentName,
        {'text': `${display.name}`, 'icon': 'images/displaysIcon.png'})

      display.tree.parentNodeId = '#'
      display.tree.nodeId = pokeyTreeDisplayParentNodeId

      if (display.displayGroups !== undefined &&
        display.displayGroups.length > 0) {
        _.each(
          display.displayGroups,
          (displayGroup) => {
            self.renderDisplayGroup(
              displayGroup, pokeyTreeDisplayParentNodeId)})
      }
    })
  }

  renderDisplayGroup (group, parentNodeId) {
    var self = this
    var groupNodeId = self.addNode(parentNodeId, {
      'text': `${group.name}`,
      'icon': 'images/displaysIcon.png',
      data: group
    })

    group.tree.parentNodeId = parentNodeId
    group.tree.nodeId = groupNodeId
  }

  /**
   * Render all pins
   * @param {*} pins
   * @param {*} parentNodeId
   */
  renderPins (pins, parentNodeId) {
    var self = this

    var pokeyTreePinParentNodeId = self.addNode(parentNodeId, {
      'text': `Digital I/O (${pins.length}/55)`,
      'icon': 'images/ioIcon.png'
    })

    _.each(pins, (pin) => {
      self.renderPin(pin, pokeyTreePinParentNodeId)})
  }

  /**
   * render a pin
   * @param {*} pins
   * @param {*} parentNodeId
   */
  renderPin (pin, parentNodeId) {
    var self = this
    var nodeId = self.addNode(
      parentNodeId,
      {
        'text': `[${pin.pin}] ${pin.name}`,
        'icon': pin.tree.icon,
        data: pin
      })
    pin.tree.nodeId = nodeId
    pin.tree.parentNodeId = parentNodeId
    if (pin.disabled) {
      self.disableNode(nodeId)
    }
  }

  /**
   * Render all servos
   * @param {*} pins
   * @param {*} parentNodeId
   */
  renderServos (servos, parentNodeId) {
    var self = this

    var pokeyTreePinParentNodeId = self.addNode(parentNodeId, {
      'text': `Servos (${servos.length})`,
      'icon': 'images/servosIcon.png'
    })

    _.each(servos, (servo) => {
      self.renderServo(servo, pokeyTreePinParentNodeId)})
  }

  /**
   * render a servo
   * @param {*} servo
   * @param {*} parentNodeId
   */
  renderServo (servo, parentNodeId) {
    var self = this
    var nodeId = self.addNode(
      parentNodeId,
      {
        'text': `[${servo.channel}] ${servo.name}`,
        'icon': servo.tree.icon,
        data: servo
      })
    servo.tree.nodeId = nodeId
    servo.tree.parentNodeId = parentNodeId
    if (servo.disabled) {
      self.disableNode(nodeId)
    }
  }

  /**
   * render all encoders
   * @param {*} encoders
   * @param {*} parentNodeId
   */
  renderEncoders (encoders, parentNodeId) {
    var self = this

    var pokeyTreeEncoderParentNodeId = self.addNode(parentNodeId, {
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
      parentNodeId,
      {
        'text': `${encoder.name}`,
        'icon': encoder.tree.icon,
        data: encoder
      })
    encoder.tree.nodeId = nodeId
    encoder.tree.parentNodeId = parentNodeId
  }

  onSelectNode (node, selected, event) {
    var self = this
    var node = this.getNode(selected.node.id)
    ipc.send(APP_IPC.IPCMSG_UPDATE_PROPERTIES, node)
  }
}

exports.SimhubManagerTree = SimhubManagerTree
