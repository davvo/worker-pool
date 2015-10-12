# worker-pool
Distribute work in node.js

## Install
```sh
> npm install @davvo/worker-pool
```

## Example
```sh
// adder.js
var pool = require('@davvo/worker-pool');

pool.handleSync(function (params) { 
  return params.a + params.b;
});
```

```sh
// main.js
var pool = require('@davvo/worker-pool')({
  worker: __dirname + '/adder.js'
});

pool.doWork({a: 28, b: 14}).then(function (sum) {
  console.log("The answer is", sum);
});
```

## Async workers
```sh
pool.handle(function (params, callback) {
  callback(null, params.a + param.b);
});
```

## Pool options
```sh
var pool = require('@davvo/worker-pool')({
  worker: __dirname + '/my-worker.js',
  numWorkers: 2
  timeout: 5000
});
```
