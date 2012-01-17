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
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function() {
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
        function create(model, view, viewUIEventHandler) {
            _model = model;
            _view = view;
            _viewUIEventHandler = viewUIEventHandler;
            if(document.readyState && document.readyState == 'complete') {
                _load(); // onLoad has already fired, call onLoadHandler directly
            } else {
                // add the listener for the extension on firefox load
                window.addEventListener("load",_load, false);
                // remove the listener for the extension on firefox unload
                window.addEventListener("unload",_unload, false);
            }
        }
        function getViewUIEventHandler() {
            return _viewUIEventHandler;
        }
        /**
         * Trigger the analysis of a specific resource description
         */
        function run(rdf, event) {
            var begin = new Date();
            _run(rdf, true, false);
            _viewUIEventHandler.onCommandCurrent(rdf, event);
            _model.next(rdf);
            var end = new Date();
            dump("org.iswas.controller.ISWASController.run[rdf=" + rdf + ",time=" + (end.getTime() - begin.getTime()) + "ms]\n");
        }
        /**
         * Trigger the analysis of all resource description
         */
        function autorun(isPageLoad) {
            for (var rdf in RDFPreference.getMap()) {
                _view.update(ISWASController, rdf);
            }
            // update all resource descriptions found in the loaded map.
            for (var rdf in RDFPreference.getMap()) {
                _run(rdf, RDFPreference.get(rdf).getAutorunPref(), isPageLoad);
            }
        }

        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _model;
        var _view;
        var _viewUIEventHandler;
        var _connected = false;

        function _run(rdf, triggered, isPageLoad) {
            _model.checkFrequency(rdf);
            // get an analyzer object that holds the candidtates for
            // the resource description and the transformed location.
            var analyzed = _model.isTriggered(rdf);
            // update each WPSRAnalyzer but only if the autorun preference for the resource
            // description is activated, there is an analyzer object, e.g. triggered
            // by the user before or the user has triggered an explizit analysis
            if (analyzed || triggered) {
                // generate a message identifier for the log messages.
                // search the Document Object Model for resource description candidates
                if(!analyzed) {
                    _model.trigger(rdf);
                    _post(rdf, true);
                    return;
                } else {
                    for(var i = 0; i < _model.size(rdf); i++) {
                        var can = _model.getCandidate(rdf, i);
                        var exp = XPathExpression.create(content.document, can, null);
                        if(!exp.getNode(content.document)) {
                            _model.clear(rdf);
                            _model.trigger(rdf);
                        }
                    }
                }
            }
            _post(rdf, isPageLoad);

        }
        function _post(rdf, isPageLoad) {
            // remove all candidate which have no role attribute
            for(var i = 0; i < _model.size(rdf); i++) {
                var can = _model.getCandidate(rdf, i);
                if(can.getRole() == null || !_viewUIEventHandler.isValid(rdf, can)) {
                    _model.deleteCandidate(rdf, i);
                    i--;
                }
            }
            if(!isPageLoad)
                return;
               
            var size = _model.size(rdf);
            // Annotation with WAI-ARIA
            if(PreferenceManager.getBoolPref("extensions.iswas.advanced.wai")) {
                for(var i = 0; i < size; i++) {
                    dump("org.iswas.controller.ISWASController.post[rdf=" + rdf + ",size=" + size + ",i=" + i + "]\n");
                    var can = _model.getCandidate(rdf, i);
                    var exp = XPathExpression.create(content.document, can, null);
                    var node = exp.getNode(content.document);
                    if(node && can.getRole() != null)
                        node.setAttribute("role", can.getRole());
                }
            }
            // Transformation into another Markup
            if(PreferenceManager.getBoolPref("extensions.iswas.advanced.trans")) {
                for(var i = 0; i < size; i++) {
                    var can = _model.getCandidate(rdf, i);
                    var pref = RDFPreference.get(rdf);
                    var role = can.getRole();
                    if(pref.isTransformable(role)) {
                        _viewUIEventHandler.transform(rdf, can);
                    }
                }
            }
        }
        function _load() {
            // opening asynchronous connection to WPSR
            _connected = WPSRClassLoader.load("wpsr.WPSR");
            //_connected = WPSRClassLoader.load("wpsr.WPSRDOM");
            _init();
        }
        function _init() {
            if(!_connected) {
                setTimeout(_init, 500);
                return;
            }
            RDFPreference.create("RDFSearch","extensions.iswas.autorun.search",["prePath","pathname","query"]);
            RDFPreference.create("RDFIdent","extensions.iswas.autorun.ident",["prePath","pathname","query"]);
            RDFPreference.create("RDFTab","extensions.iswas.autorun.tab",["prePath","pathname","search"],["tabbox"]);
            RDFPreference.create("RDFNavigation","extensions.iswas.autorun.nav",["prePath","pathname","query"]);
            //RDFPreference.create("RDFTree","extensions.iswas.autorun.tree",["prePath","pathname","query"]);
            RDFSearchUIEventHandler.init(_model, _view);
            RDFIdentUIEventHandler.init(_model, _view);
            RDFTabUIEventHandler.init(_model, _view);
            RDFNavigationUIEventHandler.init(_model, _view);
            //RDFTreeUIEventHandler.init(_model, _view);
            _viewUIEventHandler.addUIEventHandler("RDFSearch", RDFSearchUIEventHandler);
            _viewUIEventHandler.addUIEventHandler("RDFIdent", RDFIdentUIEventHandler);
            _viewUIEventHandler.addUIEventHandler("RDFTab", RDFTabUIEventHandler);
            _viewUIEventHandler.addUIEventHandler("RDFNavigation", RDFNavigationUIEventHandler);
            //_viewUIEventHandler.addUIEventHandler("RDFTree", RDFTreeUIEventHandler);
            _viewUIEventHandler.init(_model, _view);
            _view.init(ISWASController, _model);
            window.getBrowser().addProgressListener(ProgressListener, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
            ProgressListener.onLocationChange();
        }
        function _unload() {
            window.getBrowser().removeProgressListener(ProgressListener);
        }
    })();
})();