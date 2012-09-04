// define the class in a closure and do not overfill the global namespace
(function () {
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    RDFIdentUIEventHandler = Module.createNS("org.iswas.controller.handler.RDFIdentUIEventHandler", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    RDFIdentUIEventHandler.EXPORTED_SYMBOLS = ["onCommandButton", "onKeyUpInput", "onTabSwitchInput", "onSubmitInput", "onCommandCurrent", "isValid"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    Components.utils.import("resource://org/iswas/css/VisualEffects.jsm");
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    RDFIdentUIEventHandler.init = init;
    RDFIdentUIEventHandler.onCommandButton = onCommandButton;
    RDFIdentUIEventHandler.onCommandCurrent = onCommandCurrent;
    RDFIdentUIEventHandler.onKeyUpInput = onKeyUpInput;
    RDFIdentUIEventHandler.onTabSwitchInput = onTabSwitchInput;
    RDFIdentUIEventHandler.onSubmitInput = onSubmitInput;
    RDFIdentUIEventHandler.isValid = isValid;
    RDFIdentUIEventHandler.transform = transform;
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
        // TODO: validate form or HTML5 elements required
        var can = model.getCandidate(rdf, null);
        var exp = XPathExpression.create(content.document, can, null);
        var elem = exp.getNode(content.document);
        if (elem) {
            VisualEffects.show(elem);
            elem.submit();
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
            if (event.currentTarget.hasAttribute("type") && event.currentTarget.getAttribute("type") === "password") {
                exp = XPathExpression.create(content.document, can, null, "/descendant::input[@type='password']");
                elem = exp.getNode(elem);
                elem.value = event.currentTarget.value;
            } else {
                exp = XPathExpression.create(content.document, can, null, "/descendant::input[@type='text' or not(@type)]");
                elem = exp.getNode(elem);
                elem.value = event.currentTarget.value;
            }
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
        // TODO: validate form or HTML5 elements required
        var can = model.getCandidate(rdf, null);
        var exp = XPathExpression.create(content.document, can, null);
        var elem = exp.getNode(content.document);
        if (elem) {
            VisualEffects.show(elem);
            elem.submit();
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
     * The user clicks on the current label that is representing a candidate
     * of WPSR. The Label is defined by the xul interface for the firefox
     * extension, e.g. a sidebar. This Label can be identified by RDFIdentLabel.
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
     * The firefox extension checks every WPSR candidate by this method.
     *
     * @static
     * @param {Object} candidate
     */
    function isValid(candidate) {
        /*var inputTypePasswordPattern = "type=\"password\"";
        var inputList = candidate.getCoveredText().match(new RegExp("<input[^>]*", "g"));
        for(var i in inputList) {
            var inputTypePasswordIndex = inputList[i].indexOf(inputTypePasswordPattern);
            if(inputTypePasswordIndex != -1) {
                return true;
            }
        }
        return false;*/
        return true;
    }
    function transform(element) {}
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var model;
    var view;
}());