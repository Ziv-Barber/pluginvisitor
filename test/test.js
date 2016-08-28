"use strict";

// Assert tools needed:
var path = require ( 'path' );
var chai = require ( 'chai' );
var assert = chai.assert;
var expect = chai.expect;

// The package under test:
var PluginVisitor = require('../');

describe ( 'PluginVisitor test suits', function () {
	describe ( 'Options test suit', function () {
		// Executed before each test:
		beforeEach ( function ( done ) {
			done ();
		});

		it ( 'Default settings', function ( done ) {
			var newObj = new PluginVisitor ();
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - verboseLevel set', function ( done ) {
			var newObj = new PluginVisitor ({
				verboseLevel: 50
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 50 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - verboseLevel set to string', function ( done ) {
			var newObj = new PluginVisitor ({
				verboseLevel: '50'
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 50 );
			expect ( curSettings.enableRcFile ).to.equal ( false );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - enableRcFile set', function ( done ) {
			var newObj = new PluginVisitor ({
				enableRcFile: true
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile ).to.equal ( true );
			expect ( curSettings.enablePackageJson ).to.equal ( false );
			done ();
		});

		it ( 'Settings - enablePackageJson set', function ( done ) {
			var newObj = new PluginVisitor ({
				enablePackageJson: true
			});
			var curSettings = newObj.getSettings ();
			expect ( curSettings.verboseLevel ).to.equal ( 0 );
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( true );
			done ();
		});

		it ( 'Settings - moduleName set', function ( done ) {
			var newObj = new PluginVisitor ({
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
			var newObj = new PluginVisitor ({
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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				rcFileName: 'myconfigrc.txt',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'myconfigrc.txt' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( 'testplug1' ), "newObj.registerPlugin ( 'testplug1' )" ).to.equal ( 1 );
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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				rcFileName: 'myconfigrc.txt',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( curSettings.rcFileName, "curSettings.rcFileName" ).to.equal ( 'myconfigrc.txt' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( [ 'testplug1' ] ) ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ) ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
			done ();
		});

		it ( 'Load the plugin "testplug1" from a configurations file', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' ),
				rcDir: path.join ( __dirname, '../test_plugs' ),
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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' ),
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

		it ( 'Load the plugin "testplug1" with options', function ( done ) {
			var moduleObj = {
				magicNumber: 3
			};

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( 'testplug1', { magicNumber: 20 } ), "newObj.registerPlugin" ).to.equal ( 1 );
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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( 'testplug1', { magicNumber: 20 } ), "newObj.registerPlugin #1" ).to.equal ( 1 );
			expect ( newObj.registerPlugin ( 'testplug1', { magicNumber: 32 } ), "newObj.registerPlugin #2" ).to.equal ( 1 );
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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test plugin:
			expect ( newObj.registerPlugin ( 'testplug1' ), "newObj.registerPlugin #1" ).to.equal ( 1 );

			var isCatch = false;
			try {
				newObj.registerPlugin ( 'testplug1', { onlyOneTime: true } );

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

			var newObj = new PluginVisitor ({
				moduleName: 'mylib',
				moduleObj: moduleObj,
				pluginsDir: path.join ( __dirname, '../test_plugs' )
			});

			// Do some basic tests:
			var curSettings = newObj.getSettings ();
			expect ( curSettings.enableRcFile, "curSettings.enableRcFile" ).to.equal ( false );
			expect ( curSettings.enablePackageJson, "curSettings.enablePackageJson" ).to.equal ( false );
			expect ( curSettings.moduleName, "curSettings.moduleName" ).to.equal ( 'mylib' );
			expect ( newObj.getModuleObj (), "newObj.getModuleObj ()" ).to.equal ( moduleObj );

			// Load our test preset:
			expect ( newObj.registerPreset ( 'testpreset1' ), "newObj.registerPreset ( 'testpreset1' )" ).to.equal ( 1 );
			expect ( newObj.getPluginInfo ( 'testplug1' ), "newObj.getPluginInfo ( 'testplug1' )" ).to.equal ( true );

			// Use the plugin:
			newObj.visitPlugins ( 'updateMagicNumber' );
			expect ( moduleObj.magicNumber, "moduleObj.magicNumber" ).to.equal ( 42 );
			done ();
		});
	});
});
