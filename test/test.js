'use strict';

var test = require('tape');

var pool = require('..')({
	worker: __dirname + '/adder.js'
});

test('adder-sync', function (t) {
	var pool = require('..')({
		worker: __dirname + '/adder-sync.js'
	});

	pool.doWork({
		numbers: [1, 2, 3, 4, 5]
	}).then(function (sum) {
		pool.destroy();
		t.equal(15, sum);
		t.end();
	});
});

test('adder', function (t) {
	var pool = require('..')({
		worker: __dirname + '/adder.js'
	});

	pool.doWork({
		numbers: [-2, -1, 0, 1, 2]
	}).then(function (sum) {
		pool.destroy();
		t.equal(0, sum);
		t.end();
	});
});


test('adder-fail', function (t) {
	var pool = require('..')({
		worker: __dirname + '/adder.js'
	});

	pool.doWork({
		foo: 'bar'
	}).then(null, function (err) {
		pool.destroy();
		t.ok(err);
		t.end();
	});
});

test('blocker', function (t) {
	var pool = require('..')({
		worker: __dirname + '/blocker.js'
	});

	var work = [];
	var cpus = require('os').cpus().length;
	var start = new Date();

	while (work.length < cpus) {
		work.push(pool.doWork({}));
	}

	Promise.all(work).then(function () {
		var time = new Date() - start;
		t.ok(time < 1000);
		t.end();
	});

});

test('end', function (t) {
	t.end();
	process.exit(0);
});	