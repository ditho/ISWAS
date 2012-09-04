// define the class in a closure and do not overfill the global namespace
(function () {
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.controller.handler.RDFSearchUIEventHandler");
    Module.require("org.iswas.controller.handler.RDFIdentUIEventHandler");
    Module.require("org.iswas.controller.handler.RDFTabUIEventHandler");
    Module.require("org.iswas.controller.handler.RDFNavigationUIEventHandler");
    //Module.require("org.iswas.controller.handler.RDFTreeUIEventHandler");
    Module.require("org.iswas.listener.ProgressListener");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    // abstract class for the extension that delegates method calls
    ISWASController = Module.createNS("org.iswas.controller.ISWASController", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    ISWASController.EXPORTED_SYMBOLS = ["run", "autorun"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    var ProgressListener = org.iswas.listener.ProgressListener;
    var RDFPreference = org.iswas.rdf.RDFPreference;
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    ISWASController.create = create;
    ISWASController.run = run;
    ISWASController.autorun = autorun;
    ISWASController.getViewUIEventHandler = getViewUIEventHandler;
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * Create the controller with a specific model that implements the model
     * interface.
     */
    function create(iswasModel, iswasView, iswasViewUIEventHandler) {
        model = iswasModel;
        view = iswasView;
        viewUIEventHandler = iswasViewUIEventHandler;
        if (document.readyState && document.readyState === 'complete') {
            load(); // onLoad has already fired, call onLoadHandler directly
        } else {
            // add the listener for the extension on firefox load
            window.addEventListener("load", load, false);
            // remove the listener for the extension on firefox unload
            window.addEventListener("unload", unload, false);
        }
    }
    /**
     * Get the view ui event handler of the controller
     */
    function getViewUIEventHandler() {
        return viewUIEventHandler;
    }
    /**
     * Trigger the analysis of a specific resource description
     */
    function run(rdf, event) {
        // TODO: find out page is loaded or not
        runResourceDescription(rdf, true, false);
        viewUIEventHandler.onCommandCurrent(rdf, event);
        model.next(rdf);
    }
    /**
     * Trigger the analysis of all resource description
     */
    function autorun(isPageLoad) {
        var rdf;
        var preferenceMap = RDFPreference.getMap();
        // TODO: deactivate all views for processing
        for (rdf in preferenceMap) {
            if (preferenceMap.hasOwnProperty(rdf)) {
                view.update(ISWASController, rdf);
            }
        }
        // update all resource descriptions found in the loaded map.
        for (rdf in preferenceMap) {
            if (preferenceMap.hasOwnProperty(rdf)) {
                runResourceDescription(rdf, RDFPreference.get(rdf).getAutorunPref(), isPageLoad);
            }
        }
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var model;
    var view;
    var viewUIEventHandler;
    var connected = false;
    /**
     * 
     *
     * @param {String} rdf
     * @param {Boolean} triggered
     * @param {Boolean} isPageLoad - is the current page annotated with WAI-ARIA
     */
    function runResourceDescription(rdf, triggered, isPageLoad) {
        var i = 0;
        model.checkFrequency(rdf);
        var analyzed = model.isTriggered(rdf);
        if (analyzed || triggered) {
            if (!analyzed) {
                model.trigger(rdf);
                post(rdf, true);
                return;
            }
            for (i = 0; i < model.size(rdf); i++) {
                var can = model.getCandidate(rdf, i);
                // TODO: this seems to be model code (isCandidateAvailable on page) new model == PageModel
                // TODO: if it is the same page the content is not more available because of some page transformations.
                var exp = XPathExpression.create(content.document, can, null);
                if (!exp.getNode(content.document)) {
                    model.trigger(rdf);
                }
            }
        }
        post(rdf, isPageLoad);
    }
    /**
     * 
     * @param {String} rdf
     * @param {Boolean} isPageLoad - is the current page annotated with WAI-ARIA
     */
    function post(rdf, isPageLoad) {
        var i = 0;
        var can;
        validateCandidates(rdf);
        // is the current page annotated with WAI-ARIA
        if (!isPageLoad) {
            return;
        }
        // TODO: after the annotation of the page the page should know about
        // the changes.
        var size = model.size(rdf);
        // Annotation with WAI-ARIA
        if (PreferenceManager.getBoolPref("extensions.iswas.advanced.wai")) {
            for (i = 0; i < size; i++) {
                dump("org.iswas.controller.ISWASController.post[rdf=" + rdf + ",size=" + size + ",i=" + i + "]\n");
                can = model.getCandidate(rdf, i);
                var exp = XPathExpression.create(content.document, can, null);
                var node = exp.getNode(content.document);
                if (node && can.getRole() !== null) {
                    node.setAttribute("role", can.getRole());
                }
            }
        }
        // Transformation into another Markup
        if (PreferenceManager.getBoolPref("extensions.iswas.advanced.trans")) {
            for (i = 0; i < size; i++) {
                can = model.getCandidate(rdf, i);
                var pref = RDFPreference.get(rdf);
                var role = can.getRole();
                if (pref.isTransformable(role)) {
                    viewUIEventHandler.transform(rdf, can);
                }
            }
        }
    }
    /**
     *
     * @param rdf - resource description
     */
    function validateCandidates(rdf) {
        var i = 0;
        for (i = 0; i < model.size(rdf); i++) {
            var can = model.getCandidate(rdf, i);
            if (can.getRole() === null || !viewUIEventHandler.isValid(rdf, can)) {
                model.deleteCandidate(rdf, i);
                i--;
            }
        }
    }
    /**
     * 
     */
    function load() {
        // opening asynchronous connection to WPSR
        connected = WPSRClassLoader.load("wpsr.WPSR");
        //connected = WPSRClassLoader.load("wpsr.WPSRDOM");
        init();
    }
    /**
     * 
     */
    function init() {
        if (!connected) {
            setTimeout(init, 500);
            return;
        }
        RDFPreference.create("RDFSearch", "extensions.iswas.autorun.search", ["prePath", "pathname", "query"]);
        RDFPreference.create("RDFIdent", "extensions.iswas.autorun.ident", ["prePath", "pathname", "query"]);
        RDFPreference.create("RDFTab", "extensions.iswas.autorun.tab", ["prePath", "pathname", "search"], ["tabbox"]);
        RDFPreference.create("RDFNavigation", "extensions.iswas.autorun.nav", ["prePath", "pathname", "query"]);
        //RDFPreference.create("RDFTree","extensions.iswas.autorun.tree",["prePath","pathname","query"]);
        RDFSearchUIEventHandler.init(model, view);
        RDFIdentUIEventHandler.init(model, view);
        RDFTabUIEventHandler.init(model, view);
        RDFNavigationUIEventHandler.init(model, view);
        //RDFTreeUIEventHandler.init(model, view);
        viewUIEventHandler.addUIEventHandler("RDFSearch", RDFSearchUIEventHandler);
        viewUIEventHandler.addUIEventHandler("RDFIdent", RDFIdentUIEventHandler);
        viewUIEventHandler.addUIEventHandler("RDFTab", RDFTabUIEventHandler);
        viewUIEventHandler.addUIEventHandler("RDFNavigation", RDFNavigationUIEventHandler);
        //viewUIEventHandler.addUIEventHandler("RDFTree", RDFTreeUIEventHandler);
        viewUIEventHandler.init(model, view);
        view.init(ISWASController, model);
        window.getBrowser().addProgressListener(ProgressListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
        ProgressListener.onLocationChange();
    }
    /**
     * 
     */
    function unload() {
        window.getBrowser().removeProgressListener(ProgressListener);
    }
}());