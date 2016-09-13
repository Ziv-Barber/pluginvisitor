"use strict";

if ( typeof require === 'function' ) {
	// Assert tools needed:
	var path = require ( 'path' );
	var chai = require ( 'chai' );
	var assert = chai.assert;
	var expect = chai.expect;

	// The package under test:
	var pluginvisitor = require ( '../' );
} // Endif.

function getTestPlug1 ( isPreset ) {
	if ( typeof require === 'function' ) {
		if ( isPreset ) {
			return 'testpreset1';
		} // Endif.

		return 'testplug1';
	} // Endif.

	var PluginCode = function ( pluginsMan, options ) {
		if ( !options || typeof options !== 'object' ) {
			options = {};
		} // Endif.

		if ( !options.magicNumber || typeof options.magicNumber !== "number" || options.magicNumber !== options.magicNumber ) {
			options.magicNumber = 42;
		} // Endif.

		// Just save it:
		this.pluginsMan = pluginsMan;
		this.options = options;
		this.moduleObj = pluginsMan.getModuleObj ();
		if ( !this.moduleObj ) {
			throw new Error ( 'moduleObj is missing in the plugins manager!' );
		} // Endif.

		// Check if we need to disable using this plugin more then one time:
		if ( this.options.onlyOneTime ) {
			if ( this.pluginsMan.getPluginInfo ( 'testplug1' ) ) {
				throw new Error ( 'You can only run this plugin one time!' );
			} // Endif.
		} // Endif.

		// Singal that at last one copy of this plugin is loaded:
		this.pluginsMan.setPluginInfo ( 'testplug1', true );
		return this;
	};

	PluginCode.prototype.updateMagicNumber = function () {
		if ( this.moduleObj.magicNumber < this.options.magicNumber ) {
			this.moduleObj.magicNumber = this.options.magicNumber;
		} // Endif.

		if ( this.options.stopVisitHere ) {
			return false;
		} // Endif.

		return true;
	};

	if ( isPreset ) {
		var PresetCode = function ( pluginsMan, options ) {
			if ( !options || typeof options !== 'object' ) {
				options = {};
			} // Endif.

			// Just save it:
			this.pluginsMan = pluginsMan;
			this.options = options;

			// Load a plugin:
			var plugin = function ( pluginsMan, options ) {
				return new PluginCode ( pluginsMan, options );
			};

			// Register it with the given options:
			this.pluginsMan.registerPlugin ( plugin, options );
			return this;
		};

		return function ( pluginsMan, options ) {
			return new PresetCode ( pluginsMan, options );
		};
	} // Endif.

	return function ( pluginsMan, options ) {
		return new PluginCode ( pluginsMan, options );
	};
}

function getPluginsDir () {
	if ( typeof require === 'function' ) {
		return path.join ( __dirname, '../test_plugs' );
	} // Endif.

	return '';
}

describe ( 'pluginvisitor test suits', function () {
	describe ( 'Options test suit', function () {
		// Executed before each test:
		beforeEach ( function ( done ) {
			done ();
		});

		it ( 'Default settings', function ( done ) {
			var newObj = new pluginvisitor ();
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - verboseLevel set', function ( done ) {
			var newObj = new pluginvisitor ({
				verboseLevel: 50
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 50 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - verboseLevel set to string', function ( done ) {
			var newObj = new pluginvisitor ({
				verboseLevel: '50'
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 50 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - enableRcFile set', function ( done ) {
			var newObj = new pluginvisitor ({
				enableRcFile: true
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile ).to.equal ( true );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - enablePackageJson set', function ( done ) {
			var newObj = new pluginvisitor ({
				enablePackageJson: true
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( true );
			done ();
		});

		it ( 'Settings - moduleName set', function ( done ) {
			var newObj = new pluginvisitor ({
				moduleName: 'mylib'
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel, "curSettings.verboseLevel" ).to.equal ( 0 );
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName ).to.equal ( '.mylibrc' );
			done ();
		});

		it ( 'Settings - rcFileName set', function ( done ) {
			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				rcFileName: 'myconfigrc.txt'
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel, "curSettings.verboseLevel" ).to.equal ( 0 );
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'myconfigrc.txt' );
			done ();
		});
	});

	describe ( 'Plugins test suit', function () {
		// Executed before each test:
		beforeEach ( function ( done ) {
			done ();
		});

		it ( 'Load the plugin "testplug1" with default options', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				rcFileName: 'myconfigrc.txt',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'myconfigrc.txt' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( getTestPlug1 () ), "newObj.registerPlugin ( 'testplug1' )" ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
			done ();
		});

		it ( 'Load the plugin "testplug1" from array of plugins', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				rcFileName: 'myconfigrc.txt',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'myconfigrc.txt' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( [ getTestPlug1 () ] ) ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ) ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
			done ();
		});

		if ( typeof require === 'function' ) {
			it ( 'Load the plugin "testplug1" from a configurations file', function ( done ) {
				var moduleObj = {
					magicNumber: 3
				};

				var newObj = new pluginvisitor ({
					moduleName: 'mylib',
					moduleObj: moduleObj,
					pluginsDir: getPluginsDir (),
					rcDir: getPluginsDir (),
					rcFileName: 'testrc1.txt',
					enableRcFile: true
				});

				// Do some basic tests:
				var curSettings = newObj.getSettings ();
				expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( true );
				expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
				expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
				expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'testrc1.txt' );
				expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );
				expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

				// Use the plugin:
				newObj.visitPlugins ( 'updateMagicNumber' );
				expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
				done ();
			});

			it ( 'Load the plugin "testplug1" from package.json', function ( done ) {
				var moduleObj = {
					magicNumber: 3
				};

				var newObj = new pluginvisitor ({
					moduleName: 'mylib',
					moduleObj: moduleObj,
					pluginsDir: getPluginsDir (),
					enablePackageJson: true
				});

				// Do some basic tests:
				var curSettings = newObj.getSettings ();
				expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
				expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( true );
				expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
				expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );
				expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

				// Use the plugin:
				newObj.visitPlugins ( 'updateMagicNumber' );
				expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
				done ();
			});
		} // Endif.

		it ( 'Load the plugin "testplug1" with options', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( getTestPlug1 (), { magicNumber: 20 } ), "newObj.registerPlugin" ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 20 );
			done ();
		});

		it ( 'Load the plugin "testplug1" 2x times', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( getTestPlug1 (), { magicNumber: 20 } ), "newObj.registerPlugin #1" ).to.equal ( 1 );
			expect ( newObj.registerPlugin ( getTestPlug1 (), { magicNumber: 32 } ), "newObj.registerPlugin #2" ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 32 );
			done ();
		});

		it ( 'Load the plugin "testplug1" with limit to load only one time', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( getTestPlug1 () ), "newObj.registerPlugin #1" ).to.equal ( 1 );

			var isCatch = false;
			try {
				newObj.registerPlugin ( getTestPlug1 (), { onlyOneTime: true } );

			} catch ( e ) {
				isCatch = true;
			} // End of try catch.

			expect ( isCatch, "isCatch" ).to.equal ( true );
			done ();
		});
	});

	describe ( 'Presets test suit', function () {
		// Executed before each test:
		beforeEach ( function ( done ) {
			done ();
		});

		it ( 'Load the preset "testpreset1" with default options', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new pluginvisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: getPluginsDir ()
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test preset:
			expect ( newObj.registerPreset ( getTestPlug1 ( 'testpreset1' ) ), "newObj.registerPreset ( 'testpreset1' )" ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
			done ();
		});
	});
});
