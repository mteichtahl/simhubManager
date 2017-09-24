const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const $ = jQuery = require('jquery')
const _ = require('lodash')
const validator = require('validator')

const loaded = 'quickStart.js'
log.info(`${loaded}`)

$(function () {
  $('#quickStartCloseButton').on('click', function (e) {
    log.info('click')
    ipc.send('close-quick-start', { from: 'quickStart' })
  })

  $('#connectToSimhubButton').on('click', function (e) {
    log.info('connectToSimhubButton')
    $('#simhubUrl').show()

    $('#simhubUrl').keyup(function () {
      var value = $(this).val()
      if (validator.isURL(value, { protocols: ['http', 'https'] })) {
        $('#simhubUrlGoButton').show()
      } else {
        $('#simhubUrlGoButton').hide()
      }
    })
  })

  $('#simhubUrlGoButton').on('click', function () {
    console.log('checking reachability')
    console.log('triggering load')
  })

  $('#newSimhubButton').on('click', function (e) {
    log.info('newSimhubButton')
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()

    $('#simhubUrl').val('')
  })

  $('#loadSimhubButton').on('click', function (e) {
    log.info('loadSimhubButton')
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()
  })
})
