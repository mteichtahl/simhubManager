'use strict'
const _ = require('lodash')

class EncoderEditableTable {
  constructor (data, pokey) {
    console.log('EncoderEditableTable', data)
    this.name = data.name
    this.type = data.type
    this.description = data.description || ''
    this.type = data.type
    this.min = data.min
    this.max = data.max
    this.step = data.step
    this.units = data.units
    this.default = data.default
    this.number = data.number
    this.inverted = data.inverted
    this.disabled = data.disabled
    this.pins = data.pins
    this.pokey = pokey
  }

  render () {
    var html = ''
    html += `<h4 style="margin-top:-10px">`
    html += `<a class="isEditable" href="#" id="name" data-type="text" data-title="name" data-showbuttons="false" data-value='${this.name}' ></a>`
    html += `</h4>`
    html += `<h5 style="margin-top:-10px; font-weight:300;">`
    html += `<a class="isEditable" href="#" id="description" data-type="text" data-title="description" data-showbuttons="false" data-value='${this.description}' ></a>`
    html += `</h5 >`
    html += `<table class="table-striped">`
    html += `<thead><tr><th><strong>Property</strong></th><th><strong>Value</strong></th></td></thead>`
    html += `<tbody>`
    html += `<tr><td>Encoder</td>`
    html += `<td class="pull-right"><a class="isEditable" href="#" id="encoder" data-type="select" data-title="encoder" data-showbuttons="false" data-value='${this.number}' data-source='[${this.number},${this.pokey.freeEncoders()}]'></a></td>`
    html += `<tr><td>Pins</td>`
    html += `<td class="pull-right">${this.pins[0]},${this.pins[1]}</td></tr>`
    html += `<tr><td>Type</td>`
    html += `<td class="pull-right">${_.startCase(this.type)}</td></tr>`

    html += `<tr><td>Units</td><td class="pull-right">`
    html += `<a class="isEditable" href="#" id="units" data-type="text" data-title="units" data-showbuttons="false" data-value='${_.startCase(this.units)}'></a></td ></tr>`

    html += `<tr><td>Default</td><td class="pull-right">`
    html += `<a class="isEditable" href="#" id="default" data-type="text" data-title="default" data-showbuttons="false" data-value='${this.default}'></a></td ></tr>`
    html += `<tr><td>Minimum</td><td class="pull-right">`
    html += `<a class="isEditable" href="#" id="min" data-type="text" data-title="min" data-showbuttons="false" data-value='${this.min}'></a></td ></tr>`
    html += `<tr><td>Maximim</td><td class="pull-right">`
    html += `<a class="isEditable" href="#" id="max" data-type="text" data-title="max" data-showbuttons="false" data-value='${this.max}'></a></td ></tr>`
    html += `<tr><td>Step</td><td class="pull-right">`
    html += `<a class="isEditable" href="#" id="step" data-type="text" data-title="step" data-showbuttons="false" data-value='${this.step}'></a></td ></tr>`
    html += `<tr><td>Disabled</td>`
    html += `<td class="pull-right"><a class="isEditable" href="#" id="disabled" data-type="select" data-title="disabled" data-showbuttons="false" data-value='${this.disabled ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'></a></td ></tr >`
    html += `<tr><td>Inverted</td">`
    html += `<td class="pull-right"><a class="isEditable" href="#" id="inverted" data-type="select" data-title="inverted" data-showbuttons="false" data-value='${this.inverted ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'>${this.inverted ? "Yes" : "No"}</a></td ></tr >`
    html += `</tbody>`
    html += `</table>`
    return html
  }

}

exports.EncoderEditableTable = EncoderEditableTable
