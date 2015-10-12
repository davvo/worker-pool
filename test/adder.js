'use strict';

var pool = require('..');

pool.handle(function (params, callback) {
	var sum = params.numbers.reduce(function (sum, num) {
		return sum + num;
	}, 0);
	callback(null, sum);
});