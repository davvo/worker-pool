'use strict';

var os = require('os'),
	cp = require('child_process');

function extend(dst, src) {
	Object.keys(src).forEach(function (key) {
		dst[key] = src[key];
	});
	return dst;
}

function pool(options) {

	var workers = [];
	var index = 0;
	var nextId = 0;

	var timeouts = {};
	var callbacks = {};

	options = extend({
		numWorkers: os.cpus().length,
		worker: __dirname + '/worker.js',
		timeout: 3000
	}, options);

	for (var i = 0; i < options.numWorkers; i++) {
		var worker = cp.fork(options.worker);
		workers.push(worker);
		worker.on('message', function (msg) {
			if (callbacks[msg.id]) {
				callbacks[msg.id](msg.error, msg.result);
				delete callbacks[msg.id];
				clearTimeout(timeouts[msg.id]);
				delete timeouts[msg.id];
			}
		});
	}

	function doWork(params, callback) {
		var id = nextId++;
		callbacks[id] = callback;
		timeouts[id] = setTimeout(function () {
			delete callbacks[id];
			delete timeouts[id];
			callback(new Error("Timeout"));
		}, options.timeout);
		index = index + 1;
		if (index >= workers.length) {
			index = 0;
		}
		workers[index].send({
			id: id,
			params: params
		});
	}

	return {
		doWork: function (params) {
			return new Promise(function (resolve, reject) {
				doWork(params, function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				});
			})
		},

		destroy: function () {
			workers.forEach(function (worker) {
				worker.kill();
			});
			Object.keys(timeouts).forEach(function (id) {
				clearTimeout(timeouts[id]);
			});
		}
	};
}

pool.handleSync = function (fn) {
	process.on('message', function (msg) {
		process.send({
			id: msg.id,
			result: fn(msg.params)
		});
	});
}

pool.handle = function (fn) {
	process.on('message', function (msg) {
		fn(msg.params, function (err, result) {
			process.send({
				id: msg.id,
				error: err,
				result: result
			});
		});
	});
}

module.exports = pool;
