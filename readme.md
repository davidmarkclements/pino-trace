# pino-trace

Trace all async operations performantly with [`pino`](http://npm.im/pino) the fast logger

[![Build Status](https://travis-ci.org/davidmarkclements/pino-trace.svg)](https://travis-ci.org/davidmarkclements/pino-trace)

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
each `init` log. The stacks array takes the following form:

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

(TODO)
 
In Hapi simply `register` `pino-trace` after `hapi-pino`:

```js
server.register(require('hapi-pino'), (err) => {
  // etc.
})
server.register(require('pino-trace'))
```


## Benchmarks

Overhead of using `pino-trace` is minimal

```sh
npm run benchmark
```

### With tracing

```
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

4620k requests in 10s, 51.26 MB read
Profiling control server for 10 seconds
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor
```

### Without tracing

```
Running 10s test @ http://localhost:3000
10 connections with 10 pipelining factor

Stat         Avg      Stdev     Max
Latency (ms) 0.15     0.5       33
Req/Sec      45109.82 1748.88   46399
Bytes/Sec    5.02 MB  231.05 kB 5.24 MB

4960k requests in 10s, 55.08 MB read
```


## Test

TODO

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)