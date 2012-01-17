// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);

    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    CompositeView = Module.createNS("org.iswas.view.CompositeView",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    CompositeView.EXPORTED_SYMBOLS = ["create"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        Components.utils.import("resource://org/iswas/utils/InstanceCache.jsm");
        CompositeView.create = create;
        CompositeView.Instance = Instance;
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        /**
         * Creates a new CompositeView handled private by this module. If any 
         * instance is available then the method return a cached one.
         *
         * @param id - the identifier of the current view.
         */
        function create(id) {
            if(!id)
                throw new Error("org.iswas.view.CompositeView[no identifier available]");
            if(_cache.hasInstance(id)) {
                return _cache.getInstance(id);
            }
            var instance = new Instance(id);
            _cache.setInstance(id, instance);
            return instance;
        }
        /**
         * @param id - the identifier of the current view.
         */
        function Instance(id) {
            dump("org.iswas.view.CompositeView.create[id=" + id + "]\n");
            this.id = id;
            this.parent = null;
            this.updateIndex = {};
        }
        /**
         * Add any component to the view.
         *
         * @param c - the component to add
         * @param hash - the component value to update for
         */
        Instance.prototype.add = function(c, hash) {
            dump("org.iswas.view.CompositeView.add[component=" + c + ",hash=" + hash + "]\n");
            c.parent = this;
            if(!this.updateIndex[hash]) {
                this.updateIndex[hash] = [];
            }
            var comp = this.updateIndex[hash];
            for(var i in comp) {
                if(comp[i] == c) {
                    return;
                }
            }
            comp.push(c);
            if(this.parent)
                this.parent.add(this, hash);
        }
        /**
         * Remove a registered component from the view.
         *
         * TODO: remove c.parent, if it is possible
         *
         * @param c - the component to remove
         * @param hash - the component value to update for
         */
        Instance.prototype.remove = function(c, hash) {
            if(!this.updateIndex[hash])
                throw new Error("org.iswas.view.CompositeView[could not find this hash]");
            var comp = this.updateIndex[hash];
            for(var i in comp) {
                if(comp[i] == c) {
                    comp.splice(i,1);
                    dump("org.iswas.view.CompositeView.remove[component=" + c + ",hash=" + hash + "]\n");
                }
            }
            if(comp.length == 0)
                this.parent.remove(this, hash);
        }
        /**
         * 
         *
         * @param hash - of the children to update for
         */
        Instance.prototype.update = function(hash) {
            if(!this.updateIndex[hash])
                return;
            var comp = this.updateIndex[hash];
            for(var i in comp) {
                dump("org.iswas.view.CompositeView.update[component=" + comp[i] + ",hash=" + hash + "]\n");
                comp[i].update(hash);
            }
        }
        /**
         * For debug
         */
        Instance.prototype.toString = function() {
            return "org.iswas.view.ComposietView";
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _cache = InstanceCache.create("org.iswas.view.CompositeView");
    })();
})();