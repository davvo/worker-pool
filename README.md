# worker-pool
Distribute work in node.js

## Install
```sh
> npm install @davvo/worker-pool
```

## Example
```sh
// worker.js
var pool = require('@davvo/worker-pool');

pool.handleSync(function (params) { 
  return params.a + param.b;
});
```

```sh
// main.js
var pool = require('@davvo/worker-pool');

pool.doWork({a: 28, b: 24}).then(function (sum) {
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
var pool = require('worker-pool')({
  worker: __dirname + '/my-worker.js',
  numWorkers: 2
  timeout: 5000
});
```
