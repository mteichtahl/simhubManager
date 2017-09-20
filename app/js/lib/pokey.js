'use strict'

const _ = require('lodash')
const {PokeyPin} = require('./pokeyPin')
const {PokeyEncoder} = require('./pokeyEncoder')

class Pokey {
  constructor (name) {
    this.name = name
    this.serialNumber = undefined
    this.pins = []
    this.encoders = []

    this.tree = {}
    this.tree.parentNodeId = undefined
    this.tree.nodeId = undefined
    this.tree.pins = []
  }

  setSerialNumber (serialNumber) {
    this.serialNumber = serialNumber
    return this
  }

  getSerialNumber () {
    return this.serialNumber
  }

  isPinFree (pinNumber) {
    return _.find(this.pins, { pin: pinNumber }) == undefined ? true : false
  }

  addPin (data) {
    if (this.isPinFree(data.pin)) {
      var pin = new PokeyPin(data)
      pin.setParentNodeTreeId(this.tree.nodeId)
      this.pins.push(pin)
      return pin
    }
    return undefined
  }

  addEncoder (data) {
    var encoder = new PokeyEncoder(data)
    var isFree = false
    var blockPins = []

    if (encoder.number == 1 && encoder.type == 'fast' && this.isPinFree(1) && this.isPinFree(2)) {
      isFree = true
      blockPins.push({ pin: 1, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
      blockPins.push({ pin: 2, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
    } else if (encoder.number == 2 && encoder.type == 'fast' && this.isPinFree(5) && this.isPinFree(6)) {
      isFree = true
      blockPins.push({ pin: 5, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
      blockPins.push({ pin: 6, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
    } else if (encoder.number == 3 && encoder.type == 'fast' && this.isPinFree(15) && this.isPinFree(16)) {
      isFree = true
      blockPins.push({ pin: 15, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
      blockPins.push({ pin: 16, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_FAST', description: `Encoder ${encoder.number}` })
    } else if (encoder.number == 4 && encoder.type == 'ufast' && this.isPinFree(8) && this.isPinFree(12)) {
      isFree = true
      blockPins.push({ pin: 8, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_UFAST', description: `Encoder ${encoder.number}` })
      blockPins.push({ pin: 12, name: encoder.name, type: 'DIGITAL_INPUT_ENCODER_UFAST', description: `Encoder ${encoder.number}` })
    } else if (encoder.type == 'normal' && this.isPinFree(data.pins[0]) && this.isPinFree(data.pins[1])) {
      isFree = true
      blockPins.push({ pin: data.pins[0], name: encoder.name, type: 'DIGITAL_INPUT_ENCODER', description: `Encoder ${encoder.number}` })
      blockPins.push({ pin: data.pins[1], name: encoder.name, type: 'DIGITAL_INPUT_ENCODER', description: `Encoder ${encoder.number}` })
    }

    if (isFree) {
      this.addPin(blockPins[0])
      this.addPin(blockPins[1])
      encoder.setParentNodeTreeId(this.tree.nodeId)
      this.encoders.push(encoder)
      return encoder
    } else {
      var pinText

      if (blockPins[0] !== undefined && blockPins[1] !== undefined)
        pinText = `${blockPins[0].pin} , ${blockPins[1].pin}`
      else
        switch (encoder.number) {
          case 1:
            pinText = `1,2`
            break
          case 2:
            pinText = `5,6`
            break
          case 3:
            pinText = `15,16`
            break
          case 4:
            pinText = `8,12`
            break
          default:
            pinText = `${data.pins[0]}, ${data.pins[1]}`
            break
      }
      alert(`Cant add encoder ${encoder.name} on pins ${pinText}`)
      return undefined
    }
  }

}

exports.Pokey = Pokey
