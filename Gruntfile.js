var path = require ( 'path' );

/**
 * List of grunt tasks.
 * @namespace gruntfile
 */
module.exports = function ( grunt ) {
	require ( 'time-grunt' ) ( grunt );

	function lastModified ( minutes ) {
		return function ( filepath ) {
			var curDate = new Date ();
			var filemod = ( require ( 'fs' ).statSync ( filepath ) ).mtime;
			var timeago = ( curDate ).setMinutes ( ( curDate ).getMinutes () - minutes );
			return ( filemod > timeago );
		};
	}

	grunt.initConfig ({
		// Load the package itself so we'll use information from it:
		pkg: grunt.file.readJSON ( 'package.json' ),

		jshint: {
			files: {
				// List of all the source files to test:
				src: [
					'gruntfile.js',
					'index.js'
				],

				// Run only on files been modified on the last day:
				filter: lastModified ( 24 * 60 )
			},

			// Configure JSHint (documented at http://www.jshint.com/docs/):
			options: {
				evil: false,
				globals: {
					jQuery: false,
					console: true,
					module: true
				}
			}
		},

		jsdoc: {
			dist: {
				src: [
					'gruntfile.js',
					'index.js'
				],
				options: {
					'destination': 'doc',
					'package': 'package.json',
					'readme': 'README.md'
					// template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
					// configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		}
	});

	//
	// The default task:
	//

	/**
	 * The default grunt task.
	 * @name default
	 * @memberof gruntfile
	 * @kind function
	 */
	grunt.registerTask ( 'default', [
		'jshint'
	]);

	//
	// More Grunt tasks:
	//

	//
	// Load all the modules that we need:
	//

	grunt.loadNpmTasks ( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks ( 'grunt-jsdoc' );
};
