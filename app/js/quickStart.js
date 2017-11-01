'use strict'

const ipc = require('electron').ipcRenderer
const log = require('electron').remote.getGlobal('log')
const settings = require('electron').remote.getGlobal('settings')
let $ = require('jquery'), jQuery = $
const _ = require('lodash')
const validator = require('validator')
const moment = require('moment')

const APP_IPC = require('./js/ipc-messages.js');


var renderRecents = function() {
  var index = 0;
  _.each(settings.get('recent'), function(recent, index) {
    var $list = $('#recents');
    $list.append(`<span class="hoverText"> <span data-index="${index++}" 
    class="recentsList" style="font-weight: 700;margin-bottom:-5px !important;">
    ${recent.data} </span><br><span data-index="
    ${index++}" class="recentsList"> 
    ${moment(recent.ts).local().format('DD-MM-YY HH:mm:ss')}
    </span></span><br><br>`);
  })
};

ipc.on(APP_IPC.IPCMSG_CONFIG_URL_DATA, (event, data) => {console.log(data)})

$(function() {
  renderRecents();

  $('#quickStartCloseButton').on('click', function(e) {
    ipc.send(APP_IPC.IPCMSG_CLOSE_QUICKSTART)
  })

  $('.recentsList').on('click', (event) => {
    var index = $(event.target).data('index');
    var recent = settings.get('recent')[index];

    if (recent.type == 'url') {
      ipc.send(APP_IPC.IPCMSG_OPEN_SIMHUB_CONFIG_URL, recent.data);
    }
  })

  $('#connectToSimhubButton').on('click', function(e) {
    $('#simhubUrl').show();
    $('#simhubUrlGoButton').show();

    $('#simhubUrl').keyup(function() {
      var value = $(this).val();
      if (validator.isURL(value, {protocols: ['http', 'https']}) ||
          value == 'localhost') {
        $('#simhubUrlGoButton').removeAttr('disabled');
      } else {
        $('#simhubUrlGoButton').attr('disabled', 'disabled');
      }
    })
  })

  $('#simhubUrlGoButton').on('click', function() {
    var url = $('#simhubUrl').val()
    ipc.send(APP_IPC.IPCMSG_OPEN_SIMHUB_CONFIG_URL, url)
  })

  $('#newSimhubButton').on('click', function(e) {
    ipc.send(APP_IPC.IPCMSG_CREATE_SIMHUB_CONFIG)
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()
    $('#simhubUrl').val('')
  })

  $('#loadSimhubButton').on('click', function(e) {
    $('#simhubUrl').hide().val('')
    $('#simhubUrlGoButton').hide()
  })
})
