// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.model.WPSRModel");
    Module.require("org.iswas.view.Sidebar");
    Module.require("org.iswas.controller.handler.ViewUIEventHandler");
    Module.require("org.iswas.controller.ISWASController");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    ISWAS = Module.createNS("org.iswas.process.ISWAS",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function main(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;

        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        var model = org.iswas.model.WPSRModel;
        var view = org.iswas.view.Sidebar;
        var viewUIEventHandler = org.iswas.controller.handler.ViewUIEventHandler;
        var controller = org.iswas.controller.ISWASController;
        controller.create(model, view, viewUIEventHandler);
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    })();
})();