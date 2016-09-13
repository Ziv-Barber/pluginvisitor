#!/usr/bin/node

"use strict";

//
// Generic plugins and presets engine for node.js based applications, modules and frameworks.
//
// Please refer to README.md for this module's documentations.
//
// NOTE:
// - Before changing this code please refer to the hacking the code section on README.md.
//
// Copyright (c) 2016 Ziv Barber;
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var path = require ( 'path' );
var util = require ( 'util' );

function createMergedSettings () {
	var options = {};

	for ( var keyA in arguments ) {
		if ( arguments.hasOwnProperty ( keyA ) ) {
			var value = arguments[keyA];
			if ( value && typeof value === 'object' ) {
				for ( var key in value ) {
					if ( value.hasOwnProperty ( key ) ) {
						options[key] = value[key];
					} // Endif.
				} // End of for loop.
			} // Endif.
		} // Endif.
	} // End of for loop.

	return options;
}

/**
 * The constructor of the PluginVisitor object.
 * <br /><br />
 * This constructor function creating a single plugins and presets manager object and it may load all the needed presets and plugins depend on 
 * the configurations provided in the options object.
 *
 * <h3><b>The options:</b></h3>
 *
 * The configuration options effecting the operation of the PluginVisitor object.
 *
 * <h3><b>List of options:</b></h3>
 *
 * <ul>
 * <li>moduleObj {*} - A way to connect this plugins manager with your real module.</li>
 * <li>verboseLevel {number} - Verbose level number. 0 Means no verbose messages at all.</li>
 * <li>enableRcFile {boolean} - If it true then you'll get the option to load all the plugins and presets from a configurations file file.</li>
 * <li>enablePackageJson {boolean} - If it true then you'll get the option to load all the plugins and presets from a setting in the package.json file.</li>
 * <li>moduleName {string} Optional module name. If you are using PluginVisitor to add plugins to your app then you may not need to set this variable. If you are adding it to either a library or framework then you must set this variable.
 * <li>rcFileName {string} Used with enableRcFile. If you didn't provide this setting then the default name will be either '.' + moduleName + 'rc' or '.' + the application js file + 'rc'.
 * <li>rcDir {string} The directory where to search for the configurations file file. The default is the process current directory.</li>
 * <li>packageDir {string} The directory where to search for package.json. The default is the process current directory.</li>
 * <li>pluginsDir {string} Use it only if you want to override the search for the location of the loaded plugins.</li>
 * <li>presetsDir {string} Use it only if you want to override the search for the location of the loaded presets.</li>
 * <li>plugins {array} List of all the plugins to load.</li>
 * <li>presets {array} List of all the presets to load.</li>
 * </ul>
 *
 * @param {...object} options List of configuration options (see in the description of this function).
 * @constructor
 */
var PluginVisitor = function ( options ) {
    if ( false === ( this instanceof PluginVisitor )) {
		return new PluginVisitor ( options );
	} // Endif.

	// Allow you to add more then one options object:
	options = createMergedSettings.apply ( this, arguments );

	if ( typeof options.verboseLevel === 'string' ) {
		options.verboseLevel = parseInt ( options.verboseLevel, 10 );
	} // Endif.

	if ( !options.verboseLevel || typeof options.verboseLevel !== 'number' || options.verboseLevel !== options.verboseLevel || options.verboseLevel < 0 ) {
		options.verboseLevel = 0;

	} else {
		options.verboseLevel = Math.floor ( options.verboseLevel );
		if ( options.verboseLevel > 100 ) {
			options.verboseLevel = 100;
		} // Endif.
	} // Endif.

	if ( !options.enableRcFile ) {
		options.enableRcFile = false;
	} // Endif.

	if ( !options.enablePackageJson ) {
		options.enablePackageJson = false;
	} // Endif.

	if ( !options.moduleName || typeof options.moduleName !== 'string' ) {
		options.moduleName = path.basename ( process.argv[1], '.js' );
	} // Endif.

	if ( !options.rcFileName || typeof options.rcFileName !== 'string' ) {
		options.rcFileName = '.' + options.moduleName + 'rc';
	} // Endif.

	if ( !options.rcDir || typeof options.rcDir !== 'string' ) {
		options.rcDir = process.cwd ();
	} // Endif.

	if ( !options.packageDir || typeof options.packageDir !== 'string' ) {
		options.packageDir = process.cwd ();
	} // Endif.

	if ( !options.pluginsDir || typeof options.pluginsDir !== 'string' ) {
		options.pluginsDir = '';
	} // Endif.

	if ( !options.presetsDir || typeof options.presetsDir !== 'string' ) {
		options.presetsDir = options.pluginsDir;
	} // Endif.

	this.options = options;
	this.pluginsList = [];
	this.pluginsInfoList = {};

	if ( options.plugins ) {
		this.registerPlugin ( options.plugins );
	} // Endif.

	if ( options.presets ) {
		this.registerPreset ( options.presets );
	} // Endif.

	if ( options.enableRcFile ) {
		this.loadRcFile ();
	} // Endif.

	if ( options.enablePackageJson ) {
		this.loadPackageFile ();
	} // Endif.
};

/**
 * Returns the PluginVisitor object settings.
 *
 * @return The configuration parameters that you passed when you created this PluginVisitor object.
 */
PluginVisitor.prototype.getSettings = function () {
	// Just return the options:
	return this.options;
};

/**
 * Return the module object.
 *
 * @return The module object.
 */
PluginVisitor.prototype.getModuleObj = function () {
	return this.options.moduleObj;
};

/**
 * Get information about a plugin.
 *
 * @param {string} pluginName The plugin type name.
 * @return The data stored for this plugin.
 */
PluginVisitor.prototype.getPluginInfo = function ( pluginName ) {
	return this.pluginsInfoList[pluginName];
};

/**
 * Change information about a plugin.
 *
 * @param {string} pluginName The plugin type name.
 * @param {*} The new data to store for this plugin.
 */
PluginVisitor.prototype.setPluginInfo = function ( pluginName, pluginData ) {
	this.pluginsInfoList[pluginName] = pluginData;
};

/**
 * Fire a verbose event.
 *
 * @param {string} messageText - The message to send with this verbose event.
 * @param {number} minVerboseLevel - The verbose level of this event.
 * @param {boolean} isError - Is true if this is an error.
 */
PluginVisitor.prototype.verboseEvent = function ( messageText, minVerboseLevel, isError ) {
	if ( typeof minVerboseLevel === 'string' ) {
		minVerboseLevel = parseInt ( minVerboseLevel, 10 );
	} // Endif.

	if ( !minVerboseLevel || typeof minVerboseLevel !== 'number' || minVerboseLevel !== minVerboseLevel || minVerboseLevel < 0 ) {
		minVerboseLevel = 0;

	} else {
		minVerboseLevel = Math.floor ( minVerboseLevel );
		if ( minVerboseLevel > 100 ) {
			minVerboseLevel = 100;
		} // Endif.
	} // Endif.

	if ( minVerboseLevel > this.options.verboseLevel ) {
		return;
	} // Endif.

	console[isError ? 'error' : 'log'] ( messageText );
};

/**
 * Load all the plugins and presets stored inside a configurations file file.
 *
 * @param {string} rcFile - Optional configurations file file to load.
 * @return 0 on success or -1 on error.
 */
PluginVisitor.prototype.loadRcFile = function ( rcFile ) {
	var selfThis = this;
	var packageData = {};
	var fileName;

	try {
		fileName = rcFile ? rcFile : path.join ( selfThis.options.rcDir, selfThis.options.rcFileName );
		selfThis.verboseEvent ( "Loading " + fileName, 75 );
		packageData = JSON.parse ( require ( 'fs' ).readFileSync ( fileName, 'utf8' ) );

	} catch ( e ) {
		selfThis.verboseEvent ( e + '', 25, true );
		selfThis.verboseEvent ( "Error loading " + fileName, 25, true );
		return -1;
	} // End of try catch.

	if ( packageData && typeof packageData === 'object' ) {
		if ( packageData.plugins && util.isArray ( packageData.plugins ) ) {
			selfThis.registerPlugin ( packageData.plugins );
		} // Endif.

		if ( packageData.presets && util.isArray ( packageData.presets ) ) {
			selfThis.registerPreset ( packageData.presets );
		} // Endif.
	} // Endif.

	return 0;
};

/**
 * Load all the plugins and presets stored inside the package.json file.
 *
 * @return 0 on success or -1 on error.
 */
PluginVisitor.prototype.loadPackageFile = function () {
	var selfThis = this;
	var packageData = {};
	var fileName;

	try {
		fileName = path.join ( selfThis.options.packageDir, 'package.json' );
		selfThis.verboseEvent ( "Loading package.json from " + fileName, 75 );
		packageData = JSON.parse ( require ( 'fs' ).readFileSync ( fileName, 'utf8' ) );

	} catch ( e ) {
		selfThis.verboseEvent ( e + '', 25, true );
		selfThis.verboseEvent ( "Error loading " + fileName, 25, true );
		return -1;
	} // End of try catch.

	if ( packageData && typeof packageData === 'object' && packageData[selfThis.options.moduleName] && typeof packageData[selfThis.options.moduleName] === 'object' ) {
		if ( packageData[selfThis.options.moduleName].plugins && util.isArray ( packageData[selfThis.options.moduleName].plugins ) ) {
			selfThis.registerPlugin ( packageData[selfThis.options.moduleName].plugins );
		} // Endif.

		if ( packageData[selfThis.options.moduleName].presets && util.isArray ( packageData[selfThis.options.moduleName].presets ) ) {
			selfThis.registerPreset ( packageData[selfThis.options.moduleName].presets );
		} // Endif.
	} // Endif.

	return 0;
};

/**
 * Add a new plugin.
 *
 * @param {string} pluginName - The name of the plugin to load. This parameter can be also an array of plugins to load.
 * @param {*} pluginOptions - Optional configurations to the plugin.
 * @return Either the number of loaded plugins or -1 on error.
 */
PluginVisitor.prototype.registerPlugin = function ( pluginName, pluginOptions ) {
	var selfThis = this;
	var pluginObj;

	if ( !pluginName || typeof pluginName !== 'string' ) {
		// Request to load array of plugins:
		if ( util.isArray ( pluginName ) ) {
			selfThis.verboseEvent ( "Loading array of plugins", 75 );

			pluginName.forEach ( function ( value ) {
				if ( value && typeof value === 'object' && value.name && (typeof value.name === 'string' || typeof value.name === 'function') ) {
					selfThis.registerPlugin ( value.name, value );

				} else if ( value && (typeof value === 'string' || typeof value === 'function') ) {
					selfThis.registerPlugin ( value, pluginOptions );
				} // Endif.
			});

			return pluginName.length;
		} // Endif.

		// Allow also function (if you already loaded the plugin):
		if ( typeof pluginName === 'function' ) {
			selfThis.verboseEvent ( "Loading a function based plugin", 50 );

			pluginObj = pluginName ( selfThis, pluginOptions );
			if ( !pluginObj ) {
				selfThis.verboseEvent ( "WARNING: The plugin didn't want to load!", 25 );
				return 0;
			} // Endif.

			selfThis.pluginsList.push ( pluginObj );
			return 1;
		} // Endif.

		return -1;
	} // Endif.

	selfThis.verboseEvent ( "Loading the plugin " + pluginName, 50 );

	pluginObj = require ( selfThis.options.pluginsDir ? path.join ( selfThis.options.pluginsDir, pluginName ) : pluginName ) ( selfThis, pluginOptions );
	if ( !pluginObj ) {
		selfThis.verboseEvent ( "WARNING: The plugin didn't want to load!", 25 );
		return 0;
	} // Endif.

	selfThis.pluginsList.push ( pluginObj );
	return 1;
};

/**
 * Add a new preset.
 *
 * @param {string} presetName - The name of the preset to load. This parameter can be also an array of presets to load.
 * @param {*} presetOptions - Optional configurations to the preset.
 * @return Either the number of loaded presets or -1 on error.
 */
PluginVisitor.prototype.registerPreset = function ( presetName, presetOptions ) {
	var selfThis = this;

	if ( !presetName || typeof presetName !== 'string' ) {
		// Request to load array of presets:
		if ( util.isArray ( presetName ) ) {
			selfThis.verboseEvent ( "Loading array of presets", 75 );

			presetName.forEach ( function ( value ) {
				if ( value && typeof value === 'object' && value.name && (typeof value.name === 'string' || typeof value.name === 'function') ) {
					selfThis.registerPreset ( value.name, value );

				} else if ( value && (typeof value === 'string' || typeof value === 'function') ) {
					selfThis.registerPreset ( value, presetOptions );
				} // Endif.
			});

			return presetName.length;
		} // Endif.

		// Allow also function (if you already loaded the preset):
		if ( typeof presetName === 'function' ) {
			selfThis.verboseEvent ( "Loading a function based preset", 50 );

			presetName ( selfThis, presetOptions );
			return 1;
		} // Endif.

		return -1;
	} // Endif.

	selfThis.verboseEvent ( "Loading the preset " + presetName, 50 );

	require ( selfThis.options.presetsDir ? path.join ( selfThis.options.presetsDir, presetName ) : presetName ) ( selfThis, presetOptions );
	return 1;
};

/**
 * Call a sync method on all the plugins.
 *
 * @param {string} methodName - The name of the method to run.
 * @param {...*} argv - Optional parameters.
 */
PluginVisitor.prototype.visitPlugins = function ( methodName, argv ) {
	var args = ( arguments.length === 1 ? [arguments[0]] : Array.apply ( null, arguments ) );
	var callArgv = args.slice ( 2 );
	this.pluginsList.every ( function ( value ) {
		if ( value[methodName] && typeof value[methodName] === 'function' ) {
			return value[methodName].apply ( value, callArgv );
		} // Endif.

		return true;
	});
};

/**
 * Call an async method on all the plugins (middleware style).
 *
 * @param {string} methodName - The name of the method to run.
 * @param {function} nextCallback - Function to call after visiting all the plugins.
 * @param {...*} argv - Optional parameters.
 */
PluginVisitor.prototype.visitPluginsAsync = function ( methodName, nextCallback, argv ) {
	var args = ( arguments.length === 1 ? [arguments[0]] : Array.apply ( null, arguments ) );
	var callArgv = args.slice ( 2 ); // The first argument will be the async callback.

	if ( !nextCallback || typeof nextCallback !== 'function' ) {
		nextCallback = function () {};
	} // Endif.

	function runNextPluginAsync ( pluginsList, curIndexId, nextCallback ) {
		if ( pluginsList.length <= curIndexId ) {
			nextCallback ();
			return;
		} // Endif.

		while ( !pluginsList[curIndexId] ) {
			curIndexId++;
			if ( pluginsList.length <= curIndexId ) {
				nextCallback ();
				return;
			} // Endif.
		} // End of while loop.

		if ( pluginsList[curIndexId][methodName] && typeof pluginsList[curIndexId][methodName] === 'function' ) {
			if ( pluginsList[curIndexId][methodName].apply ( pluginsList[curIndexId], callArgv ) ) {
				runNextPluginAsync ( pluginsList, curIndexId + 1, nextCallback );

			} else {
				nextCallback ();
			} // Endif.
		} // Endif.
	}

	runNextPluginAsync ( this.pluginsList, 0, nextCallback );
};

/**
 * Create a new pluginVisitor object.
 * <br /><br />
 *
 * This method creating a new pluginVisitor based object.
 */
module.exports = function ( options ) {
	return new PluginVisitor ( options );
};

module.exports.createMergedSettings = createMergedSettings;
