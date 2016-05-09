# pino-trace

Trace all async operations performantly with [`pino`](http://npm.im/pino) the fast logger

[![Build Status](https://travis-ci.org/davidmarkclements/pino-trace.svg)](https://travis-ci.org/davidmarkclements/pino-trace)

## About

`pino-trace` uses [async-tracer](http://npm.im/async-tracer) to hook into async operations (via the native `async_wrap` binding) and output logs in an optimal way that's compatible
with and supportive of [pino's](http://npm.im/pino) log format.

## Supports

Node v4 to v6

## Usage

### Logger at `trace` level

By default, `pino-trace` logs operations at the `trace` level:

```js
var pino = require('pino')
var trace = require('pino-trace')

var logger = pino({level: 'trace'})

trace(logger)
```

### Tracer at `info` level

Alternatively, we can keep `pino` at the `info` level and tell `pino-trace` to log at that the `info` level 

```js
var pino = require('pino')
var trace = require('pino-trace')

var logger = pino()

trace(logger, {level: 'info'})
```

### Turning Tracing on Dynamically

`pino-trace` will respond to changes in log level

```js
var pino = require('pino')
var trace = require('pino-trace')

var logger = pino()

trace(logger)

// some time later:
logger.level = 'trace'
// now ops will be logged
logger.level = 'info'
// ops stop being captured and logged
```

### Child loggers

Child loggers are supported:

```js
var pino = require('pino')
var trace = require('pino-trace')

var logger = pino().child({bound: 'data'})
logger.level = 'trace'
trace(logger) // all trace events will have `bound` field
```

### Shorthand

`pino-trace` returns the passed in logger instance, allowing for a shorthand:

```js
var logger = require('pino-trace')(require('pino')())
```

## API

```js
require('pino-trace') => (Pino: logger, opts) => logger
```

### Opts

#### `level` [default: 'trace'] '`String` or `Number`'

Set the log level at which traced operations are recorded at. 
If a string, then a relevant [pino](http://npm.im/pino) log level. If a number, then a corresponding [pino](http://npm.im/pino) log level value.


#### `stacks` [default: `false`] `Boolean` or `Number`

If `true` then include an array of call sites in
each `init` log. The stack array takes the following form:

```
["functionName:fileName:lineNum:colNum"]
```

If set to a number, (from 1 to Infinity) `stacks` will also
determine the maximum amount of frames to capture for the log (defaults to `Infinity` if `true`). 

#### `contexts` [default: `false`] `Boolean`

Supply the operations context in the `pre` and `post` logs. 
The context is an exposed C object that holds state for the async op.

## Ecosystem Integration

`pino-trace` is compatible with `express-pino-logger`, `restify-pino-logger`, `koa-pino-logger`, and `rill-pino-logger` middleware.

In each case, simply pass the middleware into `pino-trace`:

```js
var pino = require('express-pino-logger')
var trace = require('pino-trace')

var app = express()

app.use(trace(pino({level: 'trace'})))
```

## Benchmarks

Overhead of using `pino-trace` is about 25%.

```sh
npm run benchmark
```

### With tracing

```
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

Stat         Avg      Stdev     Max
Latency (ms) 0.23     0.75      37
Req/Sec      33652.37 2340.03   35039
Bytes/Sec    3.74 MB  249.94 kB 3.93 MB
```

### Without tracing

```
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

Stat         Avg      Stdev     Max
Latency (ms) 0.13     0.42      34
Req/Sec      45682.91 1310.58   46335
Bytes/Sec    5.06 MB  150.72 kB 5.24 MB
```

Overhead of turning on tracing with `async_wrap`
is around 8%, so the net overhead is 17%, mostly
this is the cost of writing to a stream.


## Test

```sh
npm test
```

```
test/index.js ....................................... 61/61
total ............................................... 61/61

  61 passing (445.565ms)

  ok
-----------|----------|----------|----------|----------|----------------|
File       |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------|----------|----------|----------|----------|----------------|
 __root__/ |      100 |      100 |      100 |      100 |                |
  index.js |      100 |      100 |      100 |      100 |                |
-----------|----------|----------|----------|----------|----------------|
All files  |      100 |      100 |      100 |      100 |                |
-----------|----------|----------|----------|----------|----------------|
```

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)