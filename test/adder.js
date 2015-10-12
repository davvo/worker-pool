'use strict';

var pool = require('..');

pool.handleSync(function (params) {
	return params.numbers.reduce(function (sum, num) {
		return sum + num;
	}, 0);
});