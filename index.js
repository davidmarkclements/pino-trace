var tracer = require('async-tracer')
var hostname = require('os').hostname()
var pid = process.pid

module.exports = function (logger, opts) {
  if (!logger || !logger.stream && !(logger = logger.logger)) {
    throw Error('pino trace needs a logger instance')
  }
  opts = opts || {}
  var levels = logger.levels.values
  var level = opts.level
  var stacks = !!opts.stacks
  var contexts = !!opts.contexts
  if (typeof level === 'string') { level = levels[level] }
  level = level || levels.trace
  var LOG_VERSION = logger.LOG_VERSION
  var suffix = {v: LOG_VERSION}
  // child bindings:
  if (logger.chindings) {
    suffix = JSON.parse('{' + logger.chindings.substr(1) + '}')
    suffix.v = LOG_VERSION
  }
  var tracing = tracer(logger.stream, {
    prefix: {pid: pid, hostname: hostname, level: level},
    suffix: suffix,
    autostart: (level >= logger.levelVal),
    stacks: stacks,
    contexts: contexts
  })
  logger.onLevelUpdate(function (lvl, val) {
    tracing[val <= level ? 'enable' : 'disable']()
  })

  return logger
}
