var tracer = require('async-tracer')
var hostname = require('os').hostname()
var pid = process.pid
var levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10
}

var nums = Object.keys(levels).reduce(function (o, k) {
  o[levels[k]] = k
  return o
}, {})

module.exports = function (logger, opts) {
  if (!logger.stream) {
    // check if its pino middleware:
    if (logger.logger) {
      logger = logger.logger
    } else {
      throw Error('pino-trace needs a logger instance')
    }
  }

  opts = opts || {}
  var level = opts.level
  var stacks = opts.stacks
  if (level === 'auto') {
    level = logger.levelVal
  }
  if (typeof level === 'string') {
    level = levels[level]
  }
  level = level || levels.trace
  var LOG_VERSION = 1 
  var stream = logger.stream
  var suffix = {
    level: level,
    v: LOG_VERSION
  }
  var prefix = {
    pid: pid,
    hostname: hostname,
    level: level
  }
  
  var t = tracer(logger.stream, {
    prefix: prefix,
    suffix: suffix,
    autostart: (level >= logger.levelVal),
    stacks: stacks
  })

  var setLevel = logger.__proto__._setLevel 
  logger.__proto__._setLevel = function (lvl) {
    if (typeof lvl === 'number') { lvl = nums[lvl] }
    if (lvl) {
      if (levels[lvl] >= level) {
        t.enable()  
      } else {
        t.disable()
      }
      return
    }
    return setLevel.call(logger, lvl)
  }
  return logger
}
