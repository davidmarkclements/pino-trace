'use strict'
const {test} = require('tap')
const crypto = require('crypto')
const pino = require('pino')
const pinoHttp = require('pino-http')
const through = require('through2')
const {parse} = JSON
const trace = require('../')

test('requires a logger instance or logger middleware', ({throws, doesNotThrow, end}) => {
  throws(trace)
  doesNotThrow(() => trace(pino()))
  doesNotThrow(() => trace(pinoHttp()))
  end()
})

test('outputs logs at trace level by default', ({is, end}) => {
  const stream = check([
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'init')
      is(level, 10)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'pre')
      is(level, 10)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'post')
      is(level, 10)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'destroy')
      is(level, 10)
      end()
    }
  ])

  trace(pino({level: 'trace'}, stream))
  trigger()
})

test('opts.level', ({is, end}) => {
  const stream = check([
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'init')
      is(level, 30)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'pre')
      is(level, 30)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'post')
      is(level, 30)
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'destroy')
      is(level, 30)
      end()
    }
  ])

  trace(pino(stream), {level: 'info'})
  trigger()
})

test('opts.stacks', ({is, ok, end}) => {
  const stream = check([
    (s) => {
      const {op, phase, stack} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'init')
      ok(stack)
    },
    noop,
    noop,
    end
  ])

  trace(pino({level: 'trace'}, stream), {stacks: true})
  trigger()
})

test('opts.contexts', ({is, ok, end}) => {
  const stream = check([
    noop,
    (s) => {
      const {op, phase, ctx} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'pre')
      ok(ctx)
    },
    (s) => {
      const {op, phase, ctx} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'post')
      ok(ctx)
    },
    end
  ])

  trace(pino({level: 'trace'}, stream), {contexts: true})
  trigger()
})

test('disables/enables when logger level changes', ({is, end}) => {
  let count = 0
  const stream = check([
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'init')
      is(level, 10)
      count += 1
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'pre')
      is(level, 10)
      count += 1
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'post')
      is(level, 10)
      count += 1
    },
    (s) => {
      const {op, phase, level} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'destroy')
      is(level, 10)
      count += 1
    }
  ])
  const logger = pino(stream)
  trace(logger)
  trigger(() => {
    logger.level = 'trace'
    trigger(() => {
      logger.level = 'info'
      trigger(() => {
        is(count, 4)
        end()
      })
    })
  })
})

test('supports child loggers', ({is, end}) => {
  const stream = check([
    (s) => {
      const {op, phase, bound} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'init')
      is(bound, 'data')
    },
    (s) => {
      const {op, phase, bound} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'pre')
      is(bound, 'data')
    },
    (s) => {
      const {op, phase, bound} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'post')
      is(bound, 'data')
    },
    (s) => {
      const {op, phase, bound} = parse(s)
      is(op, 'CRYPTO')
      is(phase, 'destroy')
      is(bound, 'data')
      end()
    }
  ])

  trace(
    pino({level: 'trace'}, stream).child({bound: 'data'})
  )
  trigger()
})

function noop () {}

function trigger (cb) {
  cb = cb || noop
  crypto.randomBytes(1, cb)
}

function check (arr) {
  const stream = through((s, _, cb) => {
    const fn = arr.shift()
    if (!fn) { return cb() }
    fn(s)
    cb()
  })
  return stream
}
