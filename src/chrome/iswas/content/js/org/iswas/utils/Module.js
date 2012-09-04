/**
 * Module.js: declares helper functions to create module
 * functionalities. You are able to create your own namespace and import the
 * symbols you need to know in other classes.
 *
 * For more information see: Javascript: Das umfassende Referenzwerk page 212-219
 *
 * Some important functions:
 * <ul>
 *  <li>createNS: create your own namespace for your extension</li>
 *  <li>isDefined: take a look at the defined modules</li>
 *  <li>require: set up the required module for your module</li>
 *  <li>importSymbols: import some classes in your namespace</li>
 *  <li>addInitFunction: register some initialization functions</li>
 * </ul>
 * 
 */
// Make sure we haven't already been loaded
var Module;
// if the same module "Module" exists
if (Module && (typeof Module !== "object" || Module.NAME)) {
    throw new Error("org.iswas.utils.Module[namespace module exists]");
}
// create namespace Module
Module = {};
// this is some metainformation about this namespace
Module.NAME = "Module";
Module.VERSION = 0.1;
// this is the list of public symbols that we export from this namespace.
// These are of interest to programers who use modules
Module.EXPORTED_SYMBOLS = ["require", "importSymbols"];
// these are other symbols we are willing to export. They are ones normally
// used only by module authors and are not typically imported
Module.EXPORTED_SYMBOLS_OK = ["createNS", "isDefined", "addInitFunction",
                                "modules", "globalNamespace"];
// now start adding symbols to the namespace
Module.globalNamespace = this;
// set the namespace for this module
Module.modules = {"Module": Module};
// private array of initialization functions.
Module.initFunctions = [];
/**
 * This function creates and returns a namespace object for the
 * specified name and does useful error checking to ensure that the
 * name does not conflict with any previously loaded module.  It
 * throws an error if the namespace already exists or if any of the
 * property components of the namespace exist and are not objects.
 *
 * Sets a NAME property of the new namespace to its name.
 * If the version argument is specified, set the VERSION property
 * of the namespace.
 *
 * A mapping for the new namespace is added to the Module.modules object
 *
 * @param {String} name
 * @param {String} version
 *
 * @return {Object} Namespace
 */
Module.createNS = function (name, version) {
    'use strict';
    // check name for validity.  It must exist, and must not begin or
    // end with a period or contain two periods in a row.
    if (!name) {
        throw new Error("org.iswas.utils.Module.createNS[name is required]");
    }
    if (name.charAt(0) === '.' || name.charAt(name.length - 1) === '.' || name.indexOf("..") !== -1) {
        throw new Error("org.iswas.utils.Module.createNamspace[illegal name=" + name + "]");
    }
    // break the name at periods and create the object hierarchy we need
    var parts = name.split('.');
    // for each namespace component, either create an object or ensure that
    // an object by that name already exists.
    var container = Module.globalNamespace;
    var i = 0;
    for (i = 0; i < parts.length; i++) {
        var part = parts[i];
        // if there is no property of container with this name, create
        // an empty object.
        if (!container[part]) {
            container[part] = {};
        } else if (typeof container[part] !== "object") {
            // If there is already a property, make sure it is an object
            var n = parts.slice(0, i).join('.');
            throw new Error("org.iswas.utils.Module.createNS[" + n + " is no object and already defined]");
        }
        container = container[part];
    }
    // the last container traversed above is the namespace we need.
    var namespace = container;
    // it is an error to define a namespace twice.  It is okay if our
    // namespace object already exists, but it must not already have a
    // NAME property defined.
    if (namespace.NAME) {
        throw new Error("org.iswas.utils.Module.createNS[Modul=" + name + "]");
    }
    // Initialize NAME and VERSION fields of the namespace
    namespace.NAME = name;
    if (version) {
        namespace.Version = version;
    }
    // register this namespace in the map of all modules
    Module.modules[name] = namespace;
    // return the namespace object to the caller
    return namespace;
};
/**
 * Test whether the module with the specified name has been defined.
 * Returns true if it is defined and false otherwise.
 *
 * @param {String} name of the namespace
 *
 * @return {Boolean}
 */
Module.isDefined = function (name) {
    'use strict';
    return Module.modules[name];
};
/**
 * This function throws an error if the named module is not defined
 * or if it is defined but its version is less than the specified version.
 * If the namespace exists and has a suitable version, this function simply
 * returns without doing anything. Use this function to cause a fatal
 * error if the modules that your code requires are not present.
 *
 * @param {String} name
 * @param {String} version
 */
Module.require = function (name, version) {
    'use strict';
    if (!(Module.modules.hasOwnProperty(name))) {
        throw new Error("org.iswas.utils.Module.require[namespace=" + name + " is required but not defined in Module]");
    }
    // if no version was specified, there is nothing to check
    if (!version) {
        return;
    }
    // if the defined version is less than the required version or of
    // the namespace does not declare any version, throw an error.
    var n = Module.modules[name];
    if (!n.VERSION || n.VERSION < version) {
        throw new Error("org.iswas.utils.Module.require[required:modul=" + name + ",version=" + version +
                        ",defined:modul=" + n.NAME + ",version=" + n.VERSION + "]");
    }
};
/**
 * This function imports symbols from a specified module. By default, it
 * imports them into the global namespace, but you may specify a different
 * destination as the second argument.
 *
 * If no symbols are explicitly specified, the symbols in the EXPORTED_SYMBOLS
 * array of the module will be imported. If no such array is defined,
 * and no EXPORTED_SYMBOLS_OK is defined, all symbols from the module will be imported.
 *
 * To import an explicitly specified set of symbols, pass their names as
 * arguments after the module and the optional destination namespace. If the
 * modules defines an EXPORTED_SYMBOLS or EXPORTED_SYMBOLS_OK array, symbols will be imported
 * only if they are listed in one of those arrays.
 * 
 * @param {String/Object} from
 */
Module.importSymbols = function (from) {
    'use strict';
    // Make sure that the module is correctly specified.  We expect the
    // module's namespace object but will try with a string, too
    if (typeof from === "string") {
        from = Module.modules[from];
    }
    if (!from || typeof from !== "object") {
        throw new Error("org.iswas.utils.Module.importSymbols[namespace is not correct defined]");
    }
    // the source namespace may be followed by an optional destination
    // namespace and the names of one or more symbols to import;
    var to = Module.globalNamespace;
    var symbols = [];
    // index of the argument that represents the first symbol
    var firstsymbol = 1;
    // see if a destination namespace is specified
    if (arguments.length > 1 && typeof arguments[1] === "object") {
        if (arguments[1] !== null) {
            to = arguments[1];
            firstsymbol = 2;
        }
    }
    // now get the list of specified symbols
    var a = null;
    for (a = firstsymbol; a < arguments.length; a++) {
        symbols.push(arguments[a]);
    }
    var i = 0;
    var s = null;
    // if we were not passed any symbols to import, import a set defined
    // by the module, or just import all of them.
    if (symbols.length === 0) {
        // if the module defines an EXPORTED_SYMBOLS array, import
        // the symbols in that array.
        if (from.EXPORTED_SYMBOLS) {
            for (i = 0; i < from.EXPORTED_SYMBOLS.length; i++) {
                s = from.EXPORTED_SYMBOLS[i];
                to[s] = from[s];
            }
            return;
        } else if (!from.EXPORTED_SYMBOLS_OK) {
            // otherwise if the modules does not define an EXPORTED_SYMBOLS_OK array,
            // just import everything in the module's namespace
            for (s in from) {
                if (from.hasOwnProperty(s)) {
                    to[s] = from[s];
                }
            }
            return;
        }
    }
    // if we get here, we have an explicitly specified array of symbols
    // to import. If the namespace defines EXPORTED_SYMBOLS and/or EXPORTED_SYMBOLS_OK arrays,
    // ensure that each symbol is listed before importing it.
    // Throw an error if a requested symbol does not exist or if
    // it is not allowed to be EXPORTED_SYMBOLSed
    var allowed;
    if (from.EXPORTED_SYMBOLS || from.EXPORTED_SYMBOLS_OK) {
        allowed = {};
        // copy allowed symbols from arrays to properties of an object.
        // This allows us to test for an allowed symbol more efficiently.
        if (from.EXPORTED_SYMBOLS) {
            for (i = 0; i < from.EXPORTED_SYMBOLS.length; i++) {
                allowed[from.EXPORTED_SYMBOLS[i]] = true;
            }
        }
        if (from.EXPORTED_SYMBOLS_OK) {
            for (i = 0; i < from.EXPORTED_SYMBOLS_OK.length; i++) {
                allowed[from.EXPORTED_SYMBOLS_OK[i]] = true;
            }
        }
    }
    // import the symbols
    for (i = 0; i < symbols.length; i++) {
        s = symbols[i];
        if (!(from.hasOwnProperty(s))) {
            throw new Error("org.iswas.utils.Module.importSymbols[symbol=" + s + " is not defined]");
        }
        if (allowed && !(allowed.hasOwnProperty(s))) {
            throw new Error("org.iswas.utils.Module.importSymbols[symbol=" + s + " is not public and can not be imported]");
        }
        to[s] = from[s];
    }
};
/**
 * Modules use this function to register one or more initialization functions
 *
 * @param {Object} f the function to add
 */
Module.addInitFunction = function (f) {
    'use strict';
    // store the function in the array of initialization functions
    Module.initFunctions.push(f);
    // if we have not yet registered an onload event handler, do so now
    Module.registerEventHandler();
};
/**
 * A function to invoke all registered initialization functions.
 * In client-side JavaScript, this will automatically be called in
 * when the document finished loading.  In other contexts, you must
 * call it explicitly.
 */
Module.runInit = function () {
    'use strict';
    // Run each initialization function, catching and ignoring exceptions
    // so that a failure by one module does not prevent other modules
    // from being initialized.
    var i = 0;
    for (i = 0; i < Module.initFunctions.length; i++) {
        try {
            // try to execute the given init function
            Module.initFunctions[i]();
        } catch (excepiton) {
            // TODO: log4j logger.warn(msg);
        }
    }
    // erase the array so the functions are never called more than once.
    Module.initFunctions.length = 0;
};
/**
 * If we are loaded into a web browser, this private function registers an
 * onload event handler to run the initialization functions for all loaded
 * modules. It does not allow itself to be called more than once.
 */
Module.registerEventHandler = function () {
    'use strict';
    var clientside = Module.globalNamespace.hasOwnProperty("window") && window.hasOwnProperty("navigator");
    if (clientside) {
        // TODO: init if the document is loaded
        window.addEventListener("load", Module.runInit, false);
    }
    // this function overriding himself and can not be executed twice
    Module.registerEventHandler = function () {};
};