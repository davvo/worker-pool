'use strict';

var pool = require('..');

pool.handle(function (params, callback) {
	if (!params || !params.numbers || !params.numbers.reduce) {
		return callback(new Error("missing required parameter 'numbers' (array)"));
	}
	var sum = params.numbers.reduce(function (sum, num) {
		return sum + num;
	}, 0);
	callback(null, sum);
});