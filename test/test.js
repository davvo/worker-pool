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
	}, function (err, sum) {
		pool.destroy();
		t.error(err);
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
	}, function (err, sum) {
		pool.destroy();
		t.error(err);
		t.equal(0, sum);
		t.end();
	});
});

test('promise', function (t) {
	var pool = require('..')({
		worker: __dirname + '/adder.js'
	});

	pool.promise({
		numbers: [-2, -1, 0, 1, 2]
	}).then(function (sum) {
		t.equal(0, sum);
	}, function (err) {
		t.fail();
	}).done(function () {
		pool.destroy();
		t.end();
	});
});

test('promise-fail', function (t) {
	var pool = require('..')({
		worker: __dirname + '/adder.js'
	});

	pool.promise({
		foo: 'bar'
	}).then(function (sum) {
		t.fail();
	}, function (err) {
		t.ok(err);
	}).done(function () {
		pool.destroy();
		t.end();
	});
});

test('end', function (t) {
	t.end();
	process.exit(0);
});	