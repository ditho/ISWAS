// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.view.CompositeView");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    XULGroupbox = Module.createNS("org.iswas.view.XULGroupbox",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    XULGroupbox.EXPORTED_SYMBOLS = ["create"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        XULGroupbox.create = create;
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        function create(id) {
            return new Instance(id);
        }
        function Instance(id) {
            CompositeView.Instance.call(this);
            this.id = id;
        }
        Instance.prototype = CompositeView.create(this.id);
        Instance.prototype.constructor = Instance;
        Instance.prototype.update = function(hash) {
            CompositeView.Instance.prototype.update.call(this, hash);
            dump("org.iswas.view.XULGroupbox.update[name=" + this.id + ",hash=" + hash + "]\n");
        }
        Instance.prototype.display = function() {
            
        }
        Instance.prototype.toString = function() {
            return "org.iswas.view.XULGroupbox[name=" + this.id + "]";
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
    })();
})();