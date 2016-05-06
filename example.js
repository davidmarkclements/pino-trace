var pino = require('pino')
var trace = require('./')

var logger = pino()
logger.level = 'trace'

trace(logger)

process.stdin.resume()
process.nextTick(() => {
setTimeout(() => {

  setTimeout(() => {
    logger.debug('finished')
    process.stdin.destroy()
  }, 2000)

 }, 1000)

})


logger.info('hi')