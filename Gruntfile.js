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
					destination: 'doc',
					package: 'package.json',
					readme: 'README.md',
					template : "./node_modules/jaguarjs-jsdoc"
				}
			}
		},

		browserify: {
			all: {
				src: [
					'index.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			},
			options: {
				browserifyOptions: {
					standalone: '<%= pkg.name %>',
					debug: true
				}
			}
		},

		watch: {
			all: {
				files: [
					'index.js'
				],
				tasks: [
					'jshint',
					'browserify:all',
					'uglify:all'
				]
			}
		},

		uglify: {
			all: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
			options: {
				mangle: false
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
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

	/**
	 * Create UMD distribution package.
	 * @name dist
	 * @memberof gruntfile
	 * @kind function
	 */
	grunt.registerTask ( 'dist', [
		'jshint',
		'browserify:all',
		'uglify:all'
	]);

	/**
	 * The live grunt task.
	 * @name live
	 * @memberof gruntfile
	 * @kind function
	 */
	grunt.registerTask ( 'live', [
		'jshint',
		'browserify:all',
		'uglify:all',
		'watch:all'
	]);

	/**
	 * Execute tests using karma.
	 * @name dist
	 * @memberof gruntfile
	 * @kind function
	 */
	grunt.registerTask ( 'runkarma', [
		'dist',
		'karma:unit'
	]);

	//
	// More Grunt tasks:
	//

	//
	// Load all the modules that we need:
	//

	grunt.loadNpmTasks ( 'grunt-browserify' );
	grunt.loadNpmTasks ( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks ( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks ( 'grunt-contrib-watch' );
	grunt.loadNpmTasks ( 'grunt-jsdoc' );
	grunt.loadNpmTasks ( 'grunt-karma' );
};
