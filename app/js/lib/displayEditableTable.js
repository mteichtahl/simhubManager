'use strict'
const _ = require('lodash')

class DisplayEditableTable {
  constructor (data, pokey) {
    console.log('DisplayEditableTable', data)
    this.name = data.name
    this.type = data.type
    this.description = data.description || ''
    this.disabled = !data.enabled
    this.type = data.type
    this.digits = data.digits
    this.position = data.position
    this.partOf = data.partOf
    this.pins = data.pins
    this.pokey = pokey
  }

  render () {
    var html = ''
    html += `<h4 style="margin-top:-10px">`
    html += `<a class="isEditable" href="#" id="name" data-type="text" data-title="name" data-showbuttons="false" data-value='${this.name}' ></a>`
    html += `</h4>`
    html += `<h6 style="margin-top:-10px; font-weight:300;">`
    html += `<a class="isEditable" href="#" id="partOf" data-type="text" data-title="partOf" data-showbuttons="false" data-value='${this.partOf}' ></a>`
    html += `</h6 >`
    html += `<h5 style="margin-top:-10px; font-weight:300;">`
    html += `<a class="isEditable" href="#" id="description" data-type="text" data-title="description" data-showbuttons="false" data-value='${this.description}' ></a>`
    html += `</h5 >`

    html += `<table class="table-striped">`
    html += `<thead><tr><th><strong>Property</strong></th><th><strong>Value</strong></th></td></thead>`
    html += `<tbody>`
    html += `<tr><td>Digits</td>`
    html += `<td class="pull-right"><a class="isEditable" href="#" id="digits" data-type="text" data-title="digits" data-showbuttons="false" data-value='${this.digits}' data-source='[]'></a></td>`
    html += `<tr><td>Position</td>`
    html += `<td class="pull-right"><a class="isEditable" href="#" id="position" data-type="text" data-title="position" data-showbuttons="false" data-value='${this.position}' data-source='[]'></a></td>`
    // html += `<tr><td>Pins</td>`
    // html += `<td class="pull-right">${this.pins[0]},${this.pins[1]}</td></tr>`
    // html += `<tr><td>Type</td>`
    // html += `<td class="pull-right">${_.startCase(this.type)}</td></tr>`

    // html += `<tr><td>Units</td><td class="pull-right">`
    // html += `<a class="isEditable" href="#" id="units" data-type="text" data-title="units" data-showbuttons="false" data-value='${_.startCase(this.units)}'></a></td ></tr>`

    // html += `<tr><td>Default</td><td class="pull-right">`
    // html += `<a class="isEditable" href="#" id="default" data-type="text" data-title="default" data-showbuttons="false" data-value='${this.default}'></a></td ></tr>`
    // html += `<tr><td>Minimum</td><td class="pull-right">`
    // html += `<a class="isEditable" href="#" id="min" data-type="text" data-title="min" data-showbuttons="false" data-value='${this.min}'></a></td ></tr>`
    // html += `<tr><td>Maximim</td><td class="pull-right">`
    // html += `<a class="isEditable" href="#" id="max" data-type="text" data-title="max" data-showbuttons="false" data-value='${this.max}'></a></td ></tr>`
    // html += `<tr><td>Step</td><td class="pull-right">`
    // html += `<a class="isEditable" href="#" id="step" data-type="text" data-title="step" data-showbuttons="false" data-value='${this.step}'></a></td ></tr>`
    // html += `<tr><td>Disabled</td>`
    // html += `<td class="pull-right"><a class="isEditable" href="#" id="disabled" data-type="select" data-title="disabled" data-showbuttons="false" data-value='${this.disabled ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'></a></td ></tr >`
    // html += `<tr><td>Inverted</td">`
    // html += `<td class="pull-right"><a class="isEditable" href="#" id="inverted" data-type="select" data-title="inverted" data-showbuttons="false" data-value='${this.inverted ? 1 : 0}' data-source='[{value:1,text:"Yes"},{value:0,text:"No"}]'>${this.inverted ? "Yes" : "No"}</a></td ></tr >`
    html += `</tbody>`
    html += `</table>`
    return html
  }

}

exports.DisplayEditableTable = DisplayEditableTable
