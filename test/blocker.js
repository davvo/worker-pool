'use strict';

var pool = require('..');

pool.handle(function (params, callback) {
	var start = new Date();
	for (;;) {
		var stop = new Date();
		if (stop - start > 500) {
			return callback();
		}
	}
});