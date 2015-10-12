'use strict';

var test = require('tape');

var pool = require('..')({
	worker: __dirname + '/adder.js'
});

test('foo', function (t) {
	pool.doWork({
		numbers: [1, 2, 3, 4, 5]
	}, function (err, sum) {
		console.log("GOT ANSWER", err, sum);
		t.error(err);
		t.equal(15, sum);
		t.end();
	});
});

test('end', function (t) {
	t.end();
	process.exit(0);
});	