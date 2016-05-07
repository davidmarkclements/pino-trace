'use strict'
const {test} = require('tap')
const crypto = require('crypto')
const pino = require('pino')
const loggerMiddleware = require('pino-http')
const through = require('through2')

function trigger(cb) {
  crypo.randomBytes(1, cb)
}

test('requires a logger instance or logger middleware', ({is, end}) => {

})

test('outputs logs at trace level by default', ({is, end}) => {

})

test('opts.level', ({is, end}) => {

})

test('disables/enables when logger level changes', ({is, end}) => {

})

test('supports child loggers', ({is, end}) => {

})