// define the class in a closure and do not overfill the global namespace
(function () {
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    RDFSearchUIEventHandler = Module.createNS("org.iswas.controller.handler.RDFSearchUIEventHandler", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    RDFSearchUIEventHandler.EXPORTED_SYMBOLS = ["onCommandButton", "onKeyUpInput", "onTabSwitchInput", "onSubmitInput", "onCommandCurrent", "isValid"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    Components.utils.import("resource://org/iswas/css/VisualEffects.jsm");
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    RDFSearchUIEventHandler.init = init;
    RDFSearchUIEventHandler.onCommandButton = onCommandButton;
    RDFSearchUIEventHandler.onCommandCurrent = onCommandCurrent;
    RDFSearchUIEventHandler.onKeyUpInput = onKeyUpInput;
    RDFSearchUIEventHandler.onTabSwitchInput = onTabSwitchInput;
    RDFSearchUIEventHandler.onSubmitInput = onSubmitInput;
    RDFSearchUIEventHandler.isValid = isValid;
    RDFSearchUIEventHandler.transform = transform;
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE    
    function init(modelInstance, viewInstance) {
        model = modelInstance;
        view = viewInstance;
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
        var can = model.getCandidate(rdf, null);
        var exp = XPathExpression.create(content.document, can, null);
        var elem = exp.getNode(content.document);
        if (elem) {
            VisualEffects.show(elem);
        }
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
        var can = model.getCandidate(rdf, null);
        var exp = XPathExpression.create(content.document, can, null);
        var elem = exp.getNode(content.document);
        if (elem) {
            exp = XPathExpression.create(content.document, can, null, "/descendant::input[@type='text' or not(@type)]");
            elem = exp.getNode(elem);
            elem.value = event.currentTarget.value;
        }
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
        var can = model.getCandidate(rdf, null);
        var exp = XPathExpression.create(content.document, can, null);
        var form = exp.getNode(content.document);
        if (form) {
            exp = XPathExpression.create(content.document, can, null, "/descendant::input[@type='text' or not(@type)]");
            var elem = exp.getNode(form);
            elem.value = event.currentTarget.value;
            VisualEffects.show(form);
            form.submit();
        }
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
    }
    /**
     * The firefox extension checks every WPSR candidate by this method.
     *
     * @static
     * @param {Object} candidate
     */
    function isValid(candidate) {
        var inputList = candidate.getXMLString().match(new RegExp("<input[^>]*", "g"));
        if (inputList) {
            return true;
        }
        return false;
    }
    /**
     * @param element
     */
    function transform(element) {
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var model;
    var view;
}());