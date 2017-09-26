const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const settings = require('electron').remote.getGlobal('settings')
const $ = jQuery = require('jquery')
const _ = require('lodash')
const validator = require('validator')
const moment = require('moment')

const loaded = 'quickStart.js'
log.info(`${loaded}`)

var renderRecents = function () {
  var index = 0
  _.each(settings.get('recent'), function (recent, index) {
    var $list = $('#recents')
    $list.append(`<span class="hoverText"> <span data-index="${index++}" class="recentsList" style="font-weight: 700;margin-bottom:-5px !important;">${recent.data}</span><br><span data-index="${index++}" class="recentsList"> ${moment(recent.ts).local().format('DD-MM-YY HH:mm:ss')}</span></span><br><br>`)
  })
}

ipc.on('api-data', (event, data) => {
  console.log(data)
})



$(function () {
  renderRecents()

  $('#quickStartCloseButton').on('click', function (e) {
    ipc.send('close-quick-start', {
      from: 'quickStart'
    })
  })

  $('.recentsList').on('click', (event) => {
    var index = $(event.target).data('index')
    var recent = settings.get('recent')[index]

    if (recent.type == "url") {
      ipc.send('simhubUrlGoButton', recent.data)
    }


  })

  $('#connectToSimhubButton').on('click', function (e) {
    $('#simhubUrl').show()
    $('#simhubUrlGoButton').show()

    $('#simhubUrl').keyup(function () {
      var value = $(this).val()
      if (validator.isURL(value, {
          protocols: ['http', 'https']
        }) || value == 'localhost') {
        $('#simhubUrlGoButton').removeAttr('disabled')
      } else {
        $('#simhubUrlGoButton').attr('disabled', 'disabled')
      }
    })
  })

  $('#simhubUrlGoButton').on('click', function () {
    var url = $('#simhubUrl').val()
    ipc.send('simhubUrlGoButton', url)
  })

  $('#newSimhubButton').on('click', function (e) {
    log.info('newSimhubButton')
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()
    $('#simhubUrl').val('')
  })

  $('#loadSimhubButton').on('click', function (e) {
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()
  })
})