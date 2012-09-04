// define the class in a closure and do not overfill the global namespace
(function () {
    //'use strict';
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    var CompositeView = Module.createNS("org.iswas.view.CompositeView", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    CompositeView.EXPORTED_SYMBOLS = ["create"];
    // IMPORT MODULES
    Components.utils.import("resource://org/iswas/utils/InstanceCache.jsm");
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var instanceCache = InstanceCache.create("org.iswas.view.CompositeView");
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * @param id - the identifier of the current view.
     */
    function Instance(id) {
        //dump("org.iswas.view.CompositeView.create[id=" + id + "]\n");
        this.id = id;
        this.parent = null;
        this.updateIndex = {};
    }
    /**
     * Creates a new CompositeView handled private by this module. If any 
     * instance is available then the method return a cached one.
     *
     * @param id - the identifier of the current view.
     */
    CompositeView.create = function (id) {
        if (!id) {
            throw new Error("org.iswas.view.CompositeView[no identifier available]");
        }
        if (instanceCache.hasInstance(id)) {
            return instanceCache.getInstance(id);
        }
        var instance = new Instance(id);
        instanceCache.setInstance(id, instance);
        return instance;
    };
    /**
     * Add any component to the view.
     *
     * @param c - the component to add
     * @param hash - the component value to update for
     */
    Instance.prototype.add = function (c, hash) {
        //dump("org.iswas.view.CompositeView.add[component=" + c + ",hash=" + hash + "]\n");
        c.parent = this;
        if (!this.updateIndex[hash]) {
            this.updateIndex[hash] = [];
        }
        var comp = this.updateIndex[hash];
        var i = null;
        for (i in comp) {
            if (comp[i] === c) {
                return;
            }
        }
        comp.push(c);
        if (this.parent) {
            this.parent.add(this, hash);
        }
    };
    /**
     * Remove a registered component from the view.
     *
     * TODO: remove c.parent, if it is possible
     *
     * @param c - the component to remove
     * @param hash - the component value to update for
     */
    Instance.prototype.remove = function (c, hash) {
        if (!this.updateIndex[hash]) {
            throw new Error("org.iswas.view.CompositeView[could not find this hash]");
        }
        var comp = this.updateIndex[hash];
        var i = null;
        for (i in comp) {
            if (comp[i] === c) {
                comp.splice(i, 1);
                //dump("org.iswas.view.CompositeView.remove[component=" + c + ",hash=" + hash + "]\n");
            }
        }
        if (comp.length === 0) {
            this.parent.remove(this, hash);
        }
    };
    /**
     * 
     *
     * @param hash - of the children to update for
     */
    Instance.prototype.update = function (hash) {
        if (!this.updateIndex[hash]) {
            return;
        }
        var comp = this.updateIndex[hash];
        var i = null;
        for (i in comp) {
            if (comp.hasOwnProperty(i)) {
                //dump("org.iswas.view.CompositeView.update[component=" + comp[i] + ",hash=" + hash + "]\n");
                comp[i].update(hash);
            }
        }
    };
    /**
     * For debug
     */
    Instance.prototype.toString = function () {
        return "org.iswas.view.ComposietView";
    };
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    CompositeView.Instance = Instance;
}());