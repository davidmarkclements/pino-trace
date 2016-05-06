'use strict'

var http = require('http')
var fs = require('fs')
var logger = require('pino')({level: 'trace'})
var trace = require('../')

trace(logger)

var server = http.createServer(handle)

function handle (req, res) {
  res.end('hello world')
}


server.listen(3000)