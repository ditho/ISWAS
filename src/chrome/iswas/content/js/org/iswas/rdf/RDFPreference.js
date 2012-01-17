// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.preferences.PreferenceManager");
    //Module.require("org.iswas.utils.InstanceCache");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    RDFPreference = Module.createNS("org.iswas.rdf.RDFPreference","0.1");
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    RDFPreference.EXPORTED_SYMBOLS = ["create","getMap","get"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // set up short names for used modules in this class
        // e.g. ClassName = org.iswas.package.ClassName;
        //InstanceCache = org.iswas.utils.InstanceCache;
        Components.utils.import("resource://org/iswas/utils/InstanceCache.jsm");
        PreferenceManager = org.iswas.preferences.PreferenceManager;
        
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        RDFPreference.create = create;
        RDFPreference.getMap = getMap;
        RDFPreference.get = get;

        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        function create(rdf, autorunPref, updateFrequency, transformable) {
            if(_cache.hasInstance(rdf))
                return _cache.getInstance(rdf);
            var instance = new Instance(rdf, autorunPref, updateFrequency, transformable);
            _cache.setInstance(rdf, instance);
            return instance;
        }
        /**
         * TODO: parse domLocationFilter for dot-notation or array-notation
         *
         * @param {Object} rdf
         * @param {Object} autorunPref
         * @param {Object} updateFrequency
         * @param {Object} transformable
         */
        function Instance(rdf, autorunPref, updateFrequency, transformable) {
            this.rdfName = String(rdf);
            this.autorunPref = autorunPref;
            this.updateFrequency = updateFrequency;
            this.transformable = {};
            
            for(var i in transformable) {
                this.transformable[transformable[i]] = true;
            }
        }
        Instance.prototype.getRDFName = function() {
            return this.rdfName;
        };
        /**
         * Get the location object that is representing the update frequency for storage.
         *
         * @param {Object} location
         */
        Instance.prototype.getUpdateFrequency = function(location) {
            if(!location)
                location = content.window.location;
            if(!location.isUpgraded) {
                var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
                location = ioService.newURI(location, null, null);
                location = DOMXPCOMWrapper.upgradeXPCOMnsIURI(location, content.window.location);
            }
            return this.createURIFilter(location);
        };
        /**
         * Get the autorun preferences of the resource description.
         */
        Instance.prototype.getAutorunPref = function() {
            return PreferenceManager.getBoolPref(this.autorunPref);
        };
        Instance.prototype.createURIFilter = function(location) {
            if(!this.updateFrequency)
                return location;
            var filter = "";
            for(var i in this.updateFrequency) {
                filter += location[this.updateFrequency[i]];
            }
            return filter;
        };
        Instance.prototype.isTransformable = function(role) {
            if(this.transformable[role])
                return true;
            return false;
        };

        function getMap() {
            return _cache.getMap();
        }
        function get(key) {
            if(!_cache.hasInstance(key))
                throw new Error("org.iswas.RDFPreference.get[Preferences for key=" + key + " not have been initialized]");
            return _cache.getInstance(key);
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _cache = InstanceCache.create("org.iswas.rdf.RDFPreference");
    })();
})();