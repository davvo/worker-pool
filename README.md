# worker-pool
Distribute work in node.js

## Install
```sh
> npm install worker-pool
```

## Example
```sh
// worker.js
var pool = require('worker-pool');

pool.handleSync(function (params) { 
  return params.a + param.b;
});
```

```sh
// main.js
var pool = require('worker-pool');

pool.doWork({a: 28, b: 24}).then(function (sum) {
  console.log("The answer is", sum);
});
```

## Async workers
```sh
// worker.js
var pool = require('worker-pool');

pool.handle(function (params, callback) {
  callback(null, params.a + param.b);
});
```
