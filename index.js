'use strict';

var os = require('os'),
	cp = require('child_process'),
	assign = require('object-assign');

function pool(options) {

	var workers = [];
	var index = 0;
	var msgID = 0;

	var timeouts = {};
	var callbacks = {};

	options = assign({
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

	return {
		doWork: function (params, callback) {
			var id = msgID++;
			callbacks[id] = callback;
			timeouts[id] = setTimeout(function () {
				delete callbacks[id];
				delete timeouts[id];
				callback(new Error("Timeout"));
			}, options.timeout);
			index = (index >= workers.length - 1) ? 0 : index + 1;
			workers[index].send({
				id: id,
				params: params
			});
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
