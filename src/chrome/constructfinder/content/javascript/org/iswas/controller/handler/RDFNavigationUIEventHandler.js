// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);

    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    RDFNavigationUIEventHandler = Module.createNS("org.iswas.controller.handler.RDFNavigationUIEventHandler",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    RDFNavigationUIEventHandler.EXPORTED_SYMBOLS= ["onCommandButton","onKeyUpInput","onTabSwitchInput",
    "onSubmitInput","onCommandCurrent","isValid"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        RDFNavigationUIEventHandler.init = init;
        RDFNavigationUIEventHandler.onCommandButton = onCommandButton;
        RDFNavigationUIEventHandler.onCommandCurrent = onCommandCurrent;
        RDFNavigationUIEventHandler.onKeyUpInput = onKeyUpInput;
        RDFNavigationUIEventHandler.onTabSwitchInput = onTabSwitchInput;
        RDFNavigationUIEventHandler.onSubmitInput = onSubmitInput;
        RDFNavigationUIEventHandler.isValid = isValid;
        RDFNavigationUIEventHandler.transform = transform;
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        function init(model, view) {
            _model = model;
            _view = view;
        }
        /**
         * The user clicks a button defined by the xul interface for the
         * firefox extension, e.g. a sidebar.
         *
         * @static
         * @param rdf
         * @param {Object} event
         */
        function onCommandButton(rdf, event) {
        //dump("org.iswas.controller.handler.RDFNavigationUIEventHandler.onCommandButton[rdf=" + rdf +"]\n");
        }
        /**
         * The user release a key for an input field defined by the xul interface
         * for the firefox extension, e.g. a sidebar.
         *
         * @static
         * @param rdf
         * @param {Object} event
         */
        function onKeyUpInput(rdf, event) {
        //dump("org.iswas.controller.handler.RDFNavigationUIEventHandler.onKeyUpInput[rdf=" + rdf +"]\n");
        }
        /**
         * The user is submitting an formelement to get new content. The form
         * is defined by the xul interface for the firefox extension, e.g.
         * a sidebar.
         *
         * @static
         * @param rdf
         * @param {Object} event
         */
        function onSubmitInput(rdf, event) {
        //dump("org.iswas.controller.handler.RDFNavigationUIEventHandler.onSubmitInput[rdf=" + rdf +"]\n");
        }
        /**
         * The user pressed the tab button in the input field defined by the
         * xul interface for the firefox extension, e.g. sidebar
         *
         * @static
         * @param rdf
         * @param {Object} event
         */
        function onTabSwitchInput(rdf, event) {
        //dump("org.iswas.controller.handler.RDFNavigationUIEventHandler.onTabSwitchInput[rdf=" + rdf +"]\n");
        }
        /**
         * The user clicks on the current label that is representing a candidate
         * of WPSR. The Label is defined by the xul interface for the firefox
         * extension, e.g. a sidebar. This Label can be identified by RDFSearchLabel.
         *
         * @static
         * @param rdf
         * @param {Object} event
         */
        function onCommandCurrent(rdf, event) {
            dump("org.iswas.controller.handler.RDFNavigationUIEventHandler.onCommandCurrent[rdf=" + rdf +"]\n");            var can = _model.getCandidate(rdf,null);
            var exp = XPathExpression.create(content.document, can, null);
            var elem = exp.getNode(content.document);
            if (elem)
                VisualEffects.show(elem);
        
        }
        /**
         * The firefox extension checks every WPSR candidate by this method.
         *
         * @static
         * @param {Object} candidate
         */
        function isValid(can) {
            return true;
        }
        function transform(can) {
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _model;
        var _view;
    })();
})();