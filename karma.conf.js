module.exports = function ( config ) {
	'use strict';

	config.set ({
		basePath: '',
		frameworks: [
			'mocha',
			'chai'
		],
		files: [
			'dist/pluginvisitor.js',
			'test/*.js'
		],

		reporters: [ 'progress' ],

		port: 9876,
		colors: true,
		autoWatch: false,
		singleRun: true,

		// Level of logging (either config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO or config.LOG_DEBUG):
		logLevel: config.LOG_INFO,

		browsers: [
			'PhantomJS',
			'Chrome',
			'Firefox'
		]
	});
};
