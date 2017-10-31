'use strict'

let rp = require('request-promise')
let guid = require('guid')

/**
 * This basic view controller class serves to provide shared
 * controller functionality between the application controller
 * and the various document controllers used by the pokey config
 * editor application
 */

class ApplicationViewController {
  /**
   * Invokes REST endpoint configured by @param
   * @param {*} endpoint parameters (host, path)
   * @param {*} function to invoke when REST request complete
   * @param {*} argument to pass through to completion callback
   */
  callAPI (params, cb, callbackArg) {
    var requestId = guid.raw()
    log.info(`[${requestId}] ${params.from} fetching ${params.path} from API `)

    var options =
    {
      uri: `${params.host}/${params.path}`,
      headers: {'User-Agent': 'Request-Promise'},
      json: true,
      requestId: requestId,
      from: params.from,
      host: params.host,
      path: params.path
    }

    rp(options)
      .then(function (data) {
        log.info(
          `[${options.requestId}] Completed fetch for ${options.from} - ${options.uri} `)
        cb(callbackArg, data)
      })
      .catch(function (err) {
        console.log('FAILED', err)
      })
  }
}

module.exports = ApplicationViewController
