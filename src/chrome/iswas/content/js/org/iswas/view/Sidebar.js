// define the class in a closure and do not overfill the global namespace
(function () {
    //'use strict';
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    //Module.require("org.iswas.utils.InstanceCache");
    Module.require("org.iswas.preferences.PreferenceManager");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    var Sidebar = Module.createNS("org.iswas.view.Sidebar", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    Sidebar.EXPORTED_SYMBOLS = ["init", "update", "reset", "disable", "switchGroupVisibility"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    var PreferenceManager = org.iswas.preferences.PreferenceManager;
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    Sidebar.LOCATION = "chrome://iswas/content/xul/sidebar/RDFSidebar.xul";
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    Sidebar.init = function (controllerInstance, modelInstance) {
        controller = controllerInstance;
        model = modelInstance;
        model.addObserver(Sidebar);
        var sidebar = document.getElementById("sidebar");

        sidebar.addEventListener("load",
            function (event) {
                if (content.document.readyState === "complete") {
                    controller.autorun(false);
                }
                addUIEventHandler("RDFSearch");
                addUIEventHandler("RDFIdent");
                addUIEventHandler("RDFNavigation");
            }, true);
        if (sidebar.contentDocument.location.href === Sidebar.LOCATION) {
            controller.autorun(false);
            addUIEventHandler("RDFSearch");
            addUIEventHandler("RDFIdent");
            addUIEventHandler("RDFNavigation");
        }
    };
    Sidebar.update = function (observeable, rdf) {
        // rdf not available (null, undefined, 0, "", NaN)?
        if (!rdf) {
            throw new Error("org.iswas.view.Sidebar.update[resource description not available]");
        }
        // get the sidebar document object model (DOM)
        var sidebar = document.getElementById("sidebar").contentDocument;
        if (sidebar.location.href !== Sidebar.LOCATION) {
            return;
        }
        try {
            var current = getLabel(model.getCandidate(rdf, null));
            var complete = current;
            // TODO: stip : and ... at the end of the string
            if (current.length > 20) {
                current = current.substring(0, 20);
            }
            current = current.replace(/[.:]*/g, "");
            var score = model.getCandidate(rdf, null).getScore() * 100;
        } catch (e) {
            disable(rdf, true);
            setGroupVisibility(rdf, true);
            reset(rdf);
            return;
        }
        var position = model.getIndex(rdf) + 1;
        var size = model.size(rdf);
        var node = sidebar.getElementById(rdf + "Label");
        if (node) {
            node.label = current + " (" + position + "/" + size + ")";
            node.setAttribute("tooltiptext",
                "Bereich: " + complete + "\n"
                + "Nummer: " + position + " von " + size + "\n"
                + "Wahrscheinlichkeit: " + score + "%");
        }
        disable(rdf, false);
        setGroupVisibility(rdf, false);
        // display all input values from the model
        var values = model.getInputValues();
        var id = null;
        for (id in values) {
            if (values.hasOwnProperty(id)) {
                sidebar.getElementById(id).value = values[id];
            }
        }
    };
    Sidebar.reset = function (rdf) {
        // rdf not available (null, undefined, 0, "", NaN)?
        if (!rdf) {
            throw new Error("org.iswas.view.Sidebar.reset[resource description is not available]");
        }
        var sidebar = document.getElementById("sidebar").contentDocument;
        if (sidebar.location.href !== Sidebar.LOCATION) {
            return;
        }
        // reset the complete group of a resource description
        var group = sidebar.getElementById(rdf + "Group");
        var button = sidebar.getElementById(rdf + "Label");
        if (group) {
            resetNode(group);
        }
        if (button) {
            button.label = "";
        }
    };
    /**
     * Enable/disable all elements of the sidebar they among to the resource
     * description, e.g. for enabling write <tt>Instance.disable(rdf, false)</tt>
     * otherwise <tt>Instance.disable(rdf, true)</tt>.
     *
     * @param {Object} rdf - resource description
     * @param {Object} disabled - boolean value for the disabled attribute to be set
     */
    Sidebar.disable = function (rdf, disabled) {
        // rdf not available (null, undefined, 0, "", NaN)?
        if (!rdf) {
            throw new Error("org.iswas.view.Sidebar.disable[resource description is not available]");
        }
        // get the sidebar document object model (DOM)
        var sidebar = document.getElementById("sidebar").contentDocument;
        // sidebar of this extension is visible?
        if (sidebar.location.href !== Sidebar.LOCATION) {
            return;
        }
        var group = sidebar.getElementById(rdf + "Group");
        if (group) {
            disableNode(group, disabled);
        }
    };
    Sidebar.switchGroupVisibility = function (rdf) {
        var sidebar = document.getElementById("sidebar").contentDocument;
        var group = sidebar.getElementById(rdf + "Group");
        if (group.getAttribute("aria-expanded") === "false") {
            group.setAttribute("aria-expanded", true);
        } else {
            group.setAttribute("aria-expanded", false);
        }
    };
    function setGroupVisibility(rdf, disabled) {
        if (!rdf) {
            throw new Error("org.iswas.view.Sidebar.setGroupVisibility[resource description is not available]");
        }
        var sidebar = document.getElementById("sidebar").contentDocument;
        if (sidebar.location.href !== Sidebar.LOCATION) {
            return;
        }
        if (!sidebar.getElementById(rdf + "Group")) {
            return;
        }
        // yes, so get the groupbox for the resource description
        var prefCollapse = sidebar.getElementById(rdf + "Group").getAttribute("preferenceCollapse");
        var prefExpand = sidebar.getElementById(rdf + "Group").getAttribute("preferenceExpand");
        var expand = PreferenceManager.getBoolPref(sidebar.getElementById(prefExpand).name);
        var collapse = PreferenceManager.getBoolPref(sidebar.getElementById(prefCollapse).name);
        if (!collapse || (!disabled && expand)) {
            sidebar.getElementById(rdf + "Group").setAttribute("aria-expanded", true);
            sidebar.getElementById(rdf + "Expanded").setAttribute("checked", true);
        } else {
            sidebar.getElementById(rdf + "Group").setAttribute("aria-expanded", false);
            sidebar.getElementById(rdf + "Expanded").setAttribute("checked", false);
        }
    }
    function getLabel(candidate) {
        try {
            var expression = XPathExpression.create(content.document, candidate, null, "/descendant::input[@type='text' or not(@type) and @value]");
            var node = expression.getNode(content.document);
            if (node && node.value !== "") {
                return node.value;
            }
            expression = XPathExpression.create(content.document, candidate, null, "/descendant::legend/text()");
            node = expression.getNode(content.document);
            if (node) {
                return node.nodeValue;
            }
            expression = XPathExpression.create(content.document, candidate, null, "/descendant::input[@type='text' or not(@type)]/preceding-sibling::label/text()");
            node = expression.getNode(content.document);
            if (node) {
                return node.nodeValue;
            }
            expression = XPathExpression.create(content.document, candidate, null, "/descendant-or-self::node()[@title]");
            node = expression.getNode(content.document);
            if (node) {
                return node.getAttribute("title");
            }
            expression = XPathExpression.create(content.document, candidate, null, "/descendant-or-self::node()[@id]");
            node = expression.getNode(content.document);
            if (node) {
                return node.getAttribute("id");
            }
            expression = XPathExpression.create(document, candidate, null, "/descendant-or-self::node()[@name]");
            node = expression.getNode(content.document);
            if (node) {
                return node.getAttribute("name");
            }
            return "nothing";
        } catch (e) {
            return "nothing";
        }
        return "nothing";
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var controller;
    var model;

    function addUIEventHandler(rdf) {
        var sidebar = document.getElementById("sidebar").contentDocument;
        if (sidebar.location.href !== Sidebar.LOCATION) {
            return;
        }
        var check = sidebar.getElementById(rdf + "Expanded");
        var curr = sidebar.getElementById(rdf + "Label");
        var prev = sidebar.getElementById(rdf + "Prev");
        var next = sidebar.getElementById(rdf + "Next");
        var submit = sidebar.getElementById(rdf + "Submit");
        if (check) {
            check.addEventListener("command", function (event) {
                controller.getViewUIEventHandler().onCommandGroup(rdf, event);
            }, false);
        }
        if (curr) {
            curr.addEventListener("command", function (event) {
                controller.getViewUIEventHandler().onCommandCurrent(rdf, event);
            }, false);
        }
        if (prev) {
            prev.addEventListener("command", function (event) {
                controller.getViewUIEventHandler().onCommandPrev(rdf, event);
            }, false);
        }
        if (next) {
            next.addEventListener("command", function (event) {
                controller.getViewUIEventHandler().onCommandNext(rdf, event);
            }, false);
        }
        if (submit) {
            submit.addEventListener("command", function (event) {
                controller.getViewUIEventHandler().onCommandButton(rdf, event);
            }, false);
        }
        // reg all input fields.
        var i = 0;
        for (i = 0; sidebar.getElementById(rdf + "Input" + i); i++) {
            sidebar.getElementById(rdf + "Input" + i).addEventListener("keyup", function (event) {
                var key = event.which;
                switch (key) {
                // key == tab
                case 9:
                    controller.getViewUIEventHandler().onTabSwitchInput(rdf, event);
                    break;
                // key == enter
                case 13:
                    controller.getViewUIEventHandler().onSubmitInput(rdf, event);
                    break;
                // key == other
                default:
                    controller.getViewUIEventHandler().onKeyUpInput(rdf, event);
                    break;
                }
            }, false);
        }
    }
    function resetNode(node) {
        if (node.childNodes) {
            var i = null;
            for (i in node.childNodes) {
                if (node.childNodes.hasOwnProperty(i)) {
                    resetNode(node.childNodes[i]);
                }
            }
        }
        if (node.reset) {
            node.reset();
        }
    }
    /**
     * Disable/enable all nodes, e.g. captions or input fields.
     *
     * @param {Object} node - the node to be disable/enable
     * @param {Object} disabled - boolean value for the disabled attribute to be set
     */
    function disableNode(node, disabled) {
        if (!node) {
            return;
        }
        // any children of this node available, then enable/disable them too.
        if (node.childNodes) {
            var i = null;
            for (i in node.childNodes) {
                if (node.childNodes.hasOwnProperty(i)) {
                    disableNode(node.childNodes[i], disabled);
                }
            }
        }
        // set the attribute <tt>disabled</tt> for the node
        if (!(String(node.tagName).toUpperCase() === "CAPTION" || String(node.tagName).toUpperCase() === "CHECKBOX")) {
            node.disabled = disabled;
        } else {
            node.setAttribute("down", disabled);
        }
    }
}());