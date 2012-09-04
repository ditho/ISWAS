// define a new classname by setting their namespace and an optional version
// e.g. ClassName
InstanceCache = {};
// define the symbols that can be imported by other modules
// e.g. var EXPORTED_SYMBOLS = ["@symbols"];
var EXPORTED_SYMBOLS = ["InstanceCache"];
// define your symbols in a closure to get real privacy :-)
// and do not forget to register the @public/@static symbols for the class!
(function () {
    'use strict';
    /**
     * Constructor
     */
    function Instance() {
        this.cache = {};
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    /**
     * This is very tricky, because the InstanceCache holds instances of all
     * classes in that object. It is very important to store instances across
     * different windows. The User Agent could reuse the instances and do not
     * create once more.
     */
    var crossCache = new Instance();
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * Factory-Method: This mehtod stores the instances of all classes that use
     * this module.
     *
     * @param key - the namespace to store all instances for
     * @throws Error - if there is no key defined
     */
    function create(key) {
        if (!key) {
            throw new Error("org.iswas.utils.InstanceCache.create[key is not defined]");
        }
        if (crossCache.hasInstance(key)) {
            return crossCache.getInstance(key);
        }
        var instance = new Instance();
        crossCache.setInstance(key, instance);
        return instance;
    }
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    InstanceCache.create = create;
    /**
     * Get a specific instance from the cache.
     *
     * @param key - to get the stored instance for
     * @throws Error - if the key is not defined
     * @throws Error - if no instance is stored for this key
     */
    Instance.prototype.getInstance = function (key) {
        if (!key) {
            throw new Error("org.iswas.utils.InstanceCache.getInstance[key is not defined]");
        }
        if (!this.hasInstance(key)) {
            throw new Error("org.iswas.utils.InstanceCache.getInstance[no instance for key=" + key + "]");
        }
        return this.cache[key];
    };
    /**
     * Store any instance in the cache.
     *
     * @param key - to store the instance for
     * @param instance - to store
     * @throws Error - if the key is not defined
     */
    Instance.prototype.setInstance = function (key, instance) {
        if (!key) {
            throw new Error("org.iswas.utils.InstanceCache.setInstance[key is not defined]");
        }
        this.cache[key] = instance;
    };
    /**
     * Find out if there is an instance for that key or not.
     *
     * @param key - to find out
     */
    Instance.prototype.hasInstance = function (key) {
        if (!this.cache[key]) {
            return false;
        }
        return true;
    };
    /**
     * Delete an instance from the cache.
     *
     * @param key - to delete the instance for
     * @throws Error - if the key is not defined
     */
    Instance.prototype.deleteInstance = function (key) {
        if (!key) {
            throw new Error("org.iswas.utils.InstanceCache.deleteInstance[key is not defined]");
        }
        if (this.hasInstance(key)) {
            delete this.cache[key];
        }
    };
    /**
     * Delete all instances from the cache.
     */
    Instance.prototype.deleteAllInstance = function () {
        this.cache = {};
    };
    /**
     * TODO: it is not good to let read out all instances
     */
    Instance.prototype.getMap = function () {
        return this.cache;
    };
}());