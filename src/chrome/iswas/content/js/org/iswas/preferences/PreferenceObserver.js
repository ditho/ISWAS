// define the class in a closure and do not overfill the global namespace
(function () {
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.controller.ISWASController");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    PreferenceObserver = Module.createNS("org.iswas.preferences.PreferenceObserver", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    PreferenceObserver.EXPORTED_SYMBOLS = ["addPreference", "observe"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    ISWASController = org.iswas.controller.ISWASController;
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    PreferenceObserver.addPreference = addPreference;
    PreferenceObserver.observe = observe;
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * Add a new Observer for a Preference
     *
     * @param {String} rdf - resource description
     * @param {String} preference - to observe
     */
    function addPreference(rdf, preference) {
        setPrefRDF(rdf, preference);
        prefService.addObserver(preference, org.iswas.preferences.PreferenceObserver, false);
    }
    /**
     * TODO: init the PreferenceObserver with the controller
     *
     * @param {} aSubject
     * @param {} aTopic - changed
     * @param {} aData - preference
     */
    function observe(aSubject, aTopic, aData) {
        if (aData.indexOf("autorun") === -1) {
            ISWASController.run(getPrefRDF(aData), null, false);
        } else {
            ISWASController.run(getPrefRDF(aData), null, true);
        }
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch2);
    var prefMap = {};

    function setPrefRDF(rdf, preference) {
        prefMap[preference] = rdf;
    }
    function getPrefRDF(preference) {
        return prefMap[preference];
    }
    addPreference("RDFSearch", "extensions.iswas.toggle.collapse.search");
    addPreference("RDFSearch", "extensions.iswas.toggle.expand.search");
    addPreference("RDFIdent", "extensions.iswas.toggle.collapse.ident");
    addPreference("RDFIdent", "extensions.iswas.toggle.expand.ident");
    // autorun preferences
    addPreference("RDFIdent", "extensions.iswas.autorun.ident");
    addPreference("RDFSearch", "extensions.iswas.autorun.search");
    addPreference("RDFTab", "extensions.iswas.autorun.tab");
    addPreference("RDFNavigation", "extensions.iswas.autorun.nav");
    addPreference("RDFTree", "extensions.iswas.autorun.tree");
}());