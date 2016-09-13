//
// Example test plugin.
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
 * The constructor of our plugin.
 *
 * @param {object} pluginsMan Access to the plugins manager.
 * @param {object} options List of configuration options.
 * @constructor
 */
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

/**
 * Update the calling module's number with our magic number if it below our magic number.
 */
PluginCode.prototype.updateMagicNumber = function () {
	if ( this.moduleObj.magicNumber < this.options.magicNumber ) {
		this.moduleObj.magicNumber = this.options.magicNumber;
	} // Endif.

	if ( this.options.stopVisitHere ) {
		return false;
	} // Endif.

	return true;
};

/**
 * Create our plugin.
 *
 * @param {object} pluginsMan - Access to the plugins manager.
 * @param {*} options - Additional options.
 */
module.exports = function ( pluginsMan, options ) {
	return new PluginCode ( pluginsMan, options );
};
