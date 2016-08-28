PluginVisitor [![npm version](https://badge.fury.io/js/pluginvisitor.svg)](https://badge.fury.io/js/pluginvisitor) [![Build Status](https://travis-ci.org/Ziv-Barber/pluginvisitor.png?branch=master)](https://travis-ci.org/Ziv-Barber/pluginvisitor) [![Join the chat at https://gitter.im/pluginvisitor/Lobby](https://badges.gitter.im/pluginvisitor/Lobby.svg)](https://gitter.im/pluginvisitor/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
=========

This module adding plugins and presets support to any other module, framework or application.
You can load one or more plugins from either direct call, configuration file or the package.json file.

## Contents: ##

- [Features](#a1)
- [Installation](#a2)
- [Public API](#a3)
- [Examples](#a4)
- [Hackers Wonderland](#a5)
- [FAQ](#a6)
- [Support](#a7)
- [Changelog](#a8)
- [Roadmap](#a9)
- [License](#a10)
- [Credit](#a11)
- [Donations](#a12)

<a name="a1"></a>
## Features: ##

- Create a plugins manager object.
- You can load one or more plugins.
- You can load one or more groups of plugins ("presets").
- Presets can include both plugins and other presets.
- Both plugins and presets can have configurations.
- You can load plugins and presets automatically by using either a configuration file or place the list of plugins and presets in your project's package.json.
- Using the visitor design pattern so you can run a method (both sync and async) on all the loaded plugins.
- For the user using of both plugins and presets working almost the same as on the Babel compiler.

<a name="a2"></a>
## Installation: ##

via Git:

```bash
$ git clone git://github.com/Ziv-Barber/pluginvisitor.git
```

via npm:

```bash
$ npm install PluginVisitor
```

This module is depending on:

- Noting!

<a name="a3"></a>
## Public API: ##

### Creating and working with the PluginVisitor object: ###

```js
var pluginsMan = require ( 'PluginVisitor' ) ({
	// Some example configurations:
	moduleName: 'mymodule', // The nane of the section inside package.json. Also effecting the name of the configurations file.
	enableRcFile: true, // Load plugins and presets from the file .mymodulerc if it exists.
	enablePackageJson: true // Load plugins and presets from package.json.
});
```

Configuration settings that you can use when calling the constructor (calling to require ( 'PluginVisitor' ) ):

```js
{
	moduleObj: null, // Can holding any custom data that you want the plugins objects to access. For example, access to the your real module's object.
	moduleName: "myModuleName", // The module name. It'll be both the section name in package.json
								// and also it effecting the default name for the configuration file.
								// If you adding plugins support to your app then you may not need to
								// set this parameter since that the default value is the name of the
								// js file that you used when running node.js.
								// As for modules and frameworks you must set this to your module's name.
	enableRcFile: true, // The default is false. Set it to true if you want us to search for the 
						// configuration file and if it exists we'll load it and pre-load all the 
						// plugins and presets inside it.
	enablePackageJson: true, // The default is false. Set it to true if you want us to search for plugins
						// and presets to load inside your package.json file. We'll use moduleName as
						// the name of the configurations object inside package.json so you can use more 
						// then one module that based on PluginVisitor when each modules can have their
						// own plugins and presets.
	rcFileName: ".mymodrc", // Allow you to change the default configurations file name.
	rcDir: "", // The configuration file's directory.
	packageDir: "", // Where to search for package.json.
	pluginsDir: "", // Change how to search for plugins.
	presetsDir: "", // Change how to search for presets.
	verboseLevel: 0, // Verbose level. From 0 to 100. 0 = no messages, 100 = all messages.
					 // You can use it for debugging PluginVisitor and plugins.
	plugins: [
		// List of all the plugins to load:

		// This plugin will not have any configurations:
		"pluginWithNoConfigurations", // The plugin's name.

		// But this one will have also configurations:
		{
			name: "pluginWithConfigurations", // The plugin name to load.
			someOptionKey: 'some option value' // Example configurations.
		}
	],
	presets: [
		// List of all the presets to load:

		// This preset will not have any configurations:
		"presetWithNoConfigurations",

		// But this one will have also configurations:
		{
			name: "presetWithConfigurations", // The preset name to load.
			someOptionKey: 'some option value' // Example configurations.
		}
	]
}
```

You can always check the loaded configurations by:

```js
var usedOptions = pluginsMan.getSettings ();
```

And if you ready need it then the constructor method also accepting more then one configurations objects (good for allowing your module's users to change PluginVisitor's configurations but still have your default configurations):

```js
var pluginsMan = require ( 'PluginVisitor' ) ( options1, options2, options3 );
```

If you want to manually load a plugin:

```js
pluginsMan.registerPlugin ( 'pluginName' );
```

Same with passing configurations to the plugin:

```js
pluginsMan.registerPlugin ( 'pluginName', { someOptionKey: 'some option value' } );
```

If you want to manually load a preset:

```js
pluginsMan.registerPreset ( 'presetName' );
```

Same with passing configurations to the preset:

```js
pluginsMan.registerPreset ( 'presetName', { someOptionKey: 'some option value' } );
```

The registerPlugin method accepting also array of plugins:

```js
pluginsMan.registerPlugin ([
	// This plugin will not have any configurations:
	"pluginWithNoConfigurations",

	// But this one will have also configurations:
	{
		name: "pluginWithConfigurations", // The plugin name to load.
		someOptionKey: 'some option value' // Example configurations.
	}
]);
```

You can do the same also for presets:

```js
pluginsMan.registerPreset ([
	// This preset will not have any configurations:
	"presetWithNoConfigurations",

	// But this one will have also configurations:
	{
		name: "presetWithConfigurations", // The preset name to load.
		someOptionKey: 'some option value' // Example configurations.
	}
]);
```

Configuration file example:

```js
{
	"plugins": [
		// List of all the plugins to load:

		// This plugin will not have any configurations:
		"pluginWithNoConfigurations", // The plugin's name.

		// But this one will have also configurations:
		{
			"name": "pluginWithConfigurations", // The plugin name to load.
			"someOptionKey": "some option value" // Example configurations.
		}
	],
	"presets": [
		// List of all the presets to load:

		// This preset will not have any configurations:
		"presetWithNoConfigurations",

		// But this one will have also configurations:
		{
			"name": "presetWithConfigurations", // The preset name to load.
			"someOptionKey": "some option value" // Example configurations.
		}
	]
}
```

Package.json example:

```js
{
	// ... All the normal stuff.

	// Must be the same name as on moduleName:
	"myModuleName": {
		"plugins": [
			// List of all the plugins to load:

			// This plugin will not have any configurations:
			"pluginWithNoConfigurations", // The plugin's name.

			// But this one will have also configurations:
			{
				"name": "pluginWithConfigurations", // The plugin name to load.
				"someOptionKey": "some option value" // Example configurations.
			}
		],
		"presets": [
			// List of all the presets to load:

			// This preset will not have any configurations:
			"presetWithNoConfigurations",

			// But this one will have also configurations:
			{
				"name": "presetWithConfigurations", // The preset name to load.
				"someOptionKey": "some option value" // Example configurations.
			}
		]
	}
}
```

### Extending your code: ###

Now every time that you want to run something on all the loaded plugins:

```js
pluginsMan.visitPlugins ( 'method-name', args );
```

For example:

```js
myMoudle.prototype.registerSupportedFileTypes = function ( options ) {
	var selfThis = this;

	// Our default supported file types:
	selfThis.supportedTypes = [
		{ name: '.txt', handlerCallback: selfThis.ourTextHandlerFunc, options: options },
		{ name: '.json', handlerCallback: selfThis.ourJsonHandlerFunc, options: options }
	];

	// Let the plugins to add more handlers:
	selfThis.pluginsMan.visitPlugins ( 'registerSupportedFileTypes', selfThis.supportedTypes, options );
	// Yes... it's better to add a method in selfThis to register each type but... this is just a fast example.
}
```

Each plugin must return either truthy value to continue normally or false to block calling any more plugins.

In case of async method (the 2nd parameter is a callback that been called after running all the plugins):

```js
pluginsMan.visitPluginsAsync ( 'method-name', function () {}, args );
```

### Writing plugins: ###

Basic example:

```js
// Constructor:
var PluginCode = function ( pluginsMan, options ) {
	// Just save it:
	this.pluginsMan = pluginsMan;
	this.options = options;

	// In case that you must be connected to your host's module:
	this.moduleObj = pluginsMan.getModuleObj ();
	if ( !this.moduleObj ) {
		throw new Error ( 'moduleObj is missing in the plugins manager!' );
	} // Endif.
};

// Method example (that we can visit):
PluginCode.prototype.myMetohd = function ( param1, param2 ) {
	// Do something here:
	// this = the plugin's this.
	// this.pluginsMan = the plugins manager.
	// this.moduleObj = optional access to the host.

	return true;
};

module.exports = function ( pluginsMan, options ) {
	return new PluginCode ( pluginsMan, options );
};
```

In the host module we can visit the plugin with:

```js
pluginsMan.visitPlugins ( 'myMetohd', param1, param2 );
```

### Writing presets: ###

A preset is just loading plugins and other presets:

```js
var PresetCode = function ( pluginsMan, options ) {
	// Load and register a plugin:
	var plugin = require ( 'myPlug1' );
	pluginsMan.registerPlugin ( plugin );

	// Load another one and register it with parameters:
	plugin = require ( 'myPlug2' );
	pluginsMan.registerPlugin ( plugin, { "someOptionKey": "some option value" } );

	// Load and register a preset:
	var preset = require ( 'myPreset1' );
	pluginsMan.registerPlugin ( preset );

	// Load another one and register it with parameters:
	preset = require ( 'myPreset2' );
	pluginsMan.registerPlugin ( preset, { "someOptionKey": "some option value" } );
};

module.exports = function ( pluginsMan, options ) {
	return new PresetCode ( pluginsMan, options );
};
```

### Advanced plugins tricks and tips: ###

- Any plugin can get and save data in a global storage unique to the plugins manager object:
	- pluginsMan.getPluginInfo ( 'key name' ) = return the current stored data under this key.
	- pluginsMan.setPluginInfo ( 'key name', data ) = change the current stored data under this key.
- You can use the global storage to implement:
	- Prevent plugins to load more then one time.
	- Allow plugins to share data between them.
	- Implement utility plugins that other plugins can use.
	- Implement abstract class type of plugins (a type of plugin interface that one or more plugins can implement).

<a name="a4"></a>
## Examples: ##

- [test_plugs/testplug1.js](test_plugs/testplug1.js) - Plugin example (part of the unit tests).

<a name="a5"></a>
## Hackers Wonderland: ##

#### How to hack into the code ####

Right now please check the jsdoc documentation:

```bash
grunt jsdoc
```

<a name="a6"></a>
## FAQ: ##

- Q: Browser version?
- A: Sometimes in the future.


<a name="a7"></a>
## Support: ##

Please visit the PluginVisitor Google Group:

https://groups.google.com/d/forum/node-pluginvisitor


<a name="a8"></a>
## History: ##

[Changelog](https://github.com/Ziv-Barber/pluginvisitor/blob/master/CHANGELOG)

<a name="a9"></a>
## Roadmap: ##

Features todo:

### Version 1.0.x: ###

- Bug fixes and some extra features.

### Version 2.0.x: ###

- Browser support?

<a name="a10"></a>
## License: ##

(The MIT License)

Copyright (c) 2016 Ziv Barber;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a name="a11"></a>
## Credit: ##

- Written by Ziv Barber.

<a name="a12"></a>
## Donations: ##

The original author is accepting tips through [Gittip](<https://www.gittip.com/Ziv-Barber>)
