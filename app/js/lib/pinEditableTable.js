'use strict'
const _ = require('lodash')

class PinEditableTable {
  constructor (data, pokey) {
    this.name = data.name
    this.description = data.description || ''
    this.type = data.type
    this.pin = data.pin
    this.inverted = data.inverted
    this.disabled = data.disabled
    this.pokey = pokey
  }

  render () {
    var html = ''
    html += `<h4 style="margin-top:-10px">`
    html += `<a class="isEditable" href="#" id="name" data-type="text" data-title="name" data-showbuttons="false" data-value='${this.name}' ></a>`
    html += `</h4 >`
    html += `<h5 style="margin-top:-10px; font-weight:300;">`
    html += `<a class="isEditable" href="#" id="description" data-type="text" data-title="description" data-showbuttons="false" data-value='${this.description}' ></a>`
    html += `</h5 >`
    html += `<table class="table-striped">`
    html += `<thead><tr><th><strong>Property</strong></th><th><strong>Value</strong></th></td></thead>`
    html += `<tbody>`
    html += `<tr><td>Pin</td>`
    html += `<td><a class="isEditable" href="#" id="pin" data-type="select" data-title="pin" data-showbuttons="false" data-value='${this.pin}' data-source='[${this.pin},${this.pokey.freePins()}]'></a></td></tr>`
    html += `<tr><td>Type</td><td>`
    html += `<a class="isEditable" href="#" id="type" data-type="select" data-title="type" data-showbuttons="false" data-value='${this.type}' data-source='[{value:"DIGITAL_INPUT",text:"DIGITAL_INPUT"},{value:"DIGITAL_OUTPUT",text:"DIGITAL_OUTPUT"}]'></a></td ></tr >`
    html += `<tr><td>Disabled</td>`
    html += `<td><a class="isEditable" href="#" id="disabled" data-type="select" data-title="disabled" data-showbuttons="false" data-value='${this.disabled ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'></a></td ></tr >`
    html += `<tr><td>Inverted</td>`
    html += `<td><a class="isEditable" href="#" id="inverted" data-type="select" data-title="inverted" data-showbuttons="false" data-value='${this.inverted ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'>${this.inverted ? "Yes" : "No"}</a></td ></tr >`
    html += `</tbody>`
    html += `</table>`
    return html
  }

}

exports.PinEditableTable = PinEditableTable
