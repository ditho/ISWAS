// define the class in a closure and do not overfill the global namespace
(function () {
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    RDFTabUIEventHandler = Module.createNS("org.iswas.controller.handler.RDFTabUIEventHandler", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    RDFTabUIEventHandler.EXPORTED_SYMBOLS = ["onCommandButton", "onKeyUpInput", "onTabSwitchInput", "onSubmitInput", "onCommandCurrent", "isValid"];
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    RDFTabUIEventHandler.init = init;
    RDFTabUIEventHandler.onCommandButton = onCommandButton;
    RDFTabUIEventHandler.onCommandCurrent = onCommandCurrent;
    RDFTabUIEventHandler.onKeyUpInput = onKeyUpInput;
    RDFTabUIEventHandler.onTabSwitchInput = onTabSwitchInput;
    RDFTabUIEventHandler.onSubmitInput = onSubmitInput;
    RDFTabUIEventHandler.isValid = isValid;
    RDFTabUIEventHandler.transform = transform;
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
     * The user release a key for an input field defined by the xul interface
     * for the firefox extension, e.g. a sidebar.
     *
     * @static
     * @param rdf
     * @param {Object} event
     */
    function onKeyUpInput(rdf, event) {
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
     * extension, e.g. a sidebar. This Label can be identified by RDFSearchLabel.
     *
     * @static
     * @param rdf
     * @param {Object} event
     */
    function onCommandCurrent(rdf, event) {
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
        try {
            var exp = XPathExpression.create(content.document, can, null);
            var elem = exp.getNode(content.document);
            var ns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
            /* create xul tabbox template */
            var tabbox = content.document.createElementNS(ns, "tabbox");
            var tabs = content.document.createElementNS(ns, "tabs");
            tabbox.appendChild(tabs);
            var tabpanels = content.document.createElementNS(ns, "tabpanels");
            tabbox.appendChild(tabpanels);
            /* get transformation elements*/
            var tabExpr = XPathExpression.create(content.document, can, null, "/descendant::li[@role='tab']");
            var tabpanelExpr = XPathExpression.create(content.document, can, null, "/descendant::li[@role='tabpanel']");
            var tabElements = tabExpr.getNodes(elem);
            var tabpanelElements = tabpanelExpr.getNodes(elem);
            /* fill the template with content */
            var i = 0;
            for (i = 0; i < tabElements.length; i++) {
                var e = tabElements[i];
                var p = tabpanelElements[i];
                var tab = content.document.createElementNS(ns, "tab");
                tabs.appendChild(tab);
                var j = 0;
                for (j = 0; j < e.childNodes.length; j++) {
                    tab.setAttribute("label", e.childNodes[j].nodeValue);
                //tab.appendChild(e.childNodes[j]);
                }
                var tabpanel = content.document.createElementNS(ns, "tabpanel");
                tabpanels.appendChild(tabpanel);
                for (j = 0; j < p.childNodes.length; j++) {
                    tabpanel.appendChild(p.childNodes[j]);
                }
            }
            /* remove unused HTML markup */
            elem.innerHTML = "";
            /* insert XUL markup in page */
            elem.appendChild(tabbox);
        } catch (exception) {
            dump("org.iswas.controller.handler.RDFTabUIEventHandler[transformation not allowed!]\n");
        }
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var model;
    var view;
}());