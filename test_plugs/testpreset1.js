//
// Example test preset.
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

/**
 * The constructor of our preset.
 *
 * @param {object} pluginsMan Access to the plugins manager.
 * @param {object} options List of configuration options.
 * @constructor
 */
var PresetCode = function ( pluginsMan, options ) {
	if ( !options || typeof options !== 'object' ) {
		options = {};
	} // Endif.

	// Just save it:
	this.pluginsMan = pluginsMan;
	this.options = options;

	// Load a plugin:
	var plugin = require ( './testplug1' );

	// Register it with the given options:
	this.pluginsMan.registerPlugin ( plugin, options );
	return this;
};

/**
 * Create our preset.
 *
 * @param {object} pluginsMan - Access to the plugins manager.
 * @param {*} options - Additional options.
 */
module.exports = function ( pluginsMan, options ) {
	return new PresetCode ( pluginsMan, options );
};
