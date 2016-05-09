var pino = require('pino')
var dns = require('dns')
var trace = require('./')

var logger = pino({level: 'trace'})
trace(logger)

logger.debug('starting')

process.stdin.resume()
dns.lookup('example.com', () => {
  logger.debug('lookup done')
  setTimeout(() => {
    process.stdin.destroy()
    logger.debug('finished')
  }, 1000)
})
