// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    Content = Module.createNS("org.iswas.utils.Controller", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORT = ["@symbols"];
    
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;

        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE

        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        
        })();
})();