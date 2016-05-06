# pino-trace

Trace all async operations performantly with [`pino`](http://npm.im/pino) the fast logger

[![Build Status](https://travis-ci.org/davidmarkclements/pino-trace.svg)](https://travis-ci.org/davidmarkclements/pino-trace)

## Examples

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
determine the maximum amount of frames to capture for the log
(defaults to `Infinity` if `true`). 


## Benchmarks

TODO

## Test

TODO

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)