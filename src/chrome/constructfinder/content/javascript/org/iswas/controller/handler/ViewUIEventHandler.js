// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);

    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    ViewUIEventHandler = Module.createNS("org.iswas.controller.handler.ViewUIEventHandler", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    ViewUIEventHandler.EXPORTED_SYMBOLS= ["onCommandButton","onCommandCurrent","onKeyUpInput",
    "onTabSwitchInput","onSubmitInput","isValid","addViewUIEventHandler","removeViewUIEventHandler",];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // set up short names for used modules in this class
        // e.g. ClassName = org.iswas.package.ClassName;

        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        ViewUIEventHandler.init = init;
        ViewUIEventHandler.onCommandButton = onCommandButton;
        ViewUIEventHandler.onCommandCurrent = onCommandCurrent;
        ViewUIEventHandler.onCommandNext = onCommandNext;
        ViewUIEventHandler.onCommandPrev = onCommandPrev;
        ViewUIEventHandler.onKeyUpInput = onKeyUpInput;
        ViewUIEventHandler.onTabSwitchInput = onTabSwitchInput;
        ViewUIEventHandler.onSubmitInput = onSubmitInput;
        ViewUIEventHandler.onCommandGroup = onCommandGroup;
        ViewUIEventHandler.isValid = isValid;
        ViewUIEventHandler.transform = transform;
        ViewUIEventHandler.addUIEventHandler = addUIEventHandler;
        ViewUIEventHandler.deleteUIEventHandler = deleteUIEventHandler;    
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        function init(model, view) {
            _model = model;
            _view = view;
        }
        function addUIEventHandler(rdf, handler) {
            if (!rdf) {
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.addUIEventHandler[resource description not available]");
                return false;
            }
            _handler[rdf] = handler;
            return true;
        }
        function deleteUIEventHandler(rdf) {
            if (!rdf) {
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.deleteUIEventHandler[can't delete without a resource description]");
                return false;
            }
            return delete _handler[rdf];
        }
        function onCommandButton(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onCommandButton[resource description not available]");
            if(event.currentTarget.disabled)
                return;
            _handler[rdf].onCommandButton(rdf, event);
        }
        function onCommandCurrent(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onCommandCurrent[resource description not available]");
            if(!event || event.currentTarget.disabled)
                return;
            try {
                content.window.location.host;
            } catch (exception) {
                return;
            }
            _handler[rdf].onCommandCurrent(rdf, event);
        }
        function onKeyUpInput(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onWriteInput[resource description not available]");
            _handler[rdf].onKeyUpInput(rdf, event);
            _model.setInputValue(rdf, event.currentTarget);
        }
        function onSubmitInput(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.handler.ViewUIEventHandler.onSubmitInput[resource description not available]");
            _handler[rdf].onSubmitInput(rdf, event);
        }
        function onTabSwitchInput(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onTabSwitchInput[resource description not available]");
            _handler[rdf].onTabSwitchInput(rdf, event);
        }
        function onCommandNext(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onCommandNext[rdf not available]");
            if(event.currentTarget.disabled)
                return;
            _model.next(rdf);
        }
        function onCommandPrev(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onCommandPrev[rdf not available]");
            if(event.currentTarget.disabled)
                return;
            _model.prev(rdf);
        }
        function onCommandGroup(rdf, event) {
            if(!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.onCommandPrev[rdf not available]");
            _view.switchGroupVisibility(rdf);
        }
        function isValid(rdf, candidate) {
            if (!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.isValid[there is no resource description available]");
            if (!candidate)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.isValid[there is no candidate be validate]");
            if (!_handler[rdf])
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.isValid[there is no ViewUIEventHandler for rdf=" + rdf + "]");
            return _handler[rdf].isValid(candidate);
        }
        function transform(rdf, candidate) {
            if (!rdf)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.transform[there is no resource description available]");
            if (!candidate)
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.transform[there is no candidate to annotate]");
            if (!_handler[rdf])
                throw new Error("org.iswas.controller.handler.ViewUIEventHandler.transfrom[there is no RDFExtensionlistener for rdf=" + rdf + "]");
            _handler[rdf].transform(candidate);
            //XSLTTransform(rdf, candidate);
        }
        function XSLTTransform(rdf, candidate) {
            var processor = new XSLTProcessor();
            var stylesheet = document.implementation.createDocument("",rdf,null);
            stylesheet.addEventListener("load",onload, false);
            stylesheet.load("chrome://constructfinder/content/xslt/" + rdf + ".xslt");
            function onload(e) {
                processor.importStylesheet(e.target);
                var expression = XPathExpression.create(content.document, candidate, null);
                var element = expression.getNode(content.document);
                var frag = processor.transformToFragment(element,e.target);
                //dump(new XMLSerializer().serializeToString(frag));
                //element.innerHTML = "";
                //element.appendChild(frag);
            }
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _handler = {};
        var _model;
        var _view;
    })();
})();