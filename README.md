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

pool.handleSync(params) { 
  return params.a + param.b;
};
```

```sh
// main.js
var pool = require('worker-pool');

pool.doWork({a: 28, b: 24}).then(function (sum) {
  console.log("The answer is", sum);
});
```
