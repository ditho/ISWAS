// define the class in a closure and do not overfill the global namespace
(function () {
    //'use strict';
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    var XPathExpression = Module.createNS("org.iswas.utils.XPathExpression", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    XPathExpression.EXPORTED_SYMBOLS = ["create"];
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    XPathExpression.create = create;
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    function create(context, candidate, namespaces, append) {
        var range = document.createRange();
        var fragment = range.createContextualFragment(candidate.getXMLString());
        var element = fragment.firstChild;
        var xpathText = "//" + element.tagName;
        var i = null;
        for (i in element.attributes) {
            if (element.attributes.hasOwnProperty(i)) {
                var name = element.attributes[i].name;
                var value = element.attributes[i].value;
                if (name && value) {
                    value = value.replace(/"([^"]*)/g, "U+0022$1U+0022");
                    xpathText += "[@" + name + "=\"" + value + "\"]";
                }
            }
        }
        if (append) {
            xpathText += append;
        }
        return new Instance(context, xpathText, namespaces);
    }

    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    /**
     * XPathExpression is a class that encapsulates an XPath query and its
     * associated namespace prefix-to-URL mapping.  Once an XPathExpression
     * object has been created, it can be evaluated one or more times (in
     * one or more contexts) using the getNode() or getNodes() methods.
     *
     * If the expression includes any XML namespaces, the second argument
     * must be a JavaScript object that maps namespace prefixes to the URLs
     * that define those namespaces e.g. like this: URL = namespace[prefix].
     *
     * The current content.document will be the root context of the
     * expression.
     *
     * @param context - the expression to create for
     * @param xpathText - the  of the XPath expression.
     * @param namespaces - null or namespace map
     */
    Instance = function (context, xpathText, namespaces) {
        this.xpathText = xpathText;
        this.namespaces = namespaces;
        try {
            this.expression = context.createExpression(
                xpathText,
                // This function is passed a
                // namespace prefix and returns the URL.
                function (prefix) {
                    return namespaces[prefix];
                }
            );
        } catch (ex) {
            dump("org.iswas.utils.XPathExpression.error[xpathText=" + xpathText + "]\n");
        }
    };
    /**
     * This is the getNodes() method of XPathExpression. It evaluates the
     * XPath expression in the specified context. The context argument
     * should be a Document or Element object. The return value is an array
     * or array-like object containing the nodes that match the expression.
     *
     * @param context
     */
    Instance.prototype.getNodes = function (context) {
        if (this.expression) {
            // We now evaluate that compiled expression in the specified context
            var result = this.expression.evaluate(context,
                // This is the result type we want
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null);

            // Copy the results we get into an array.
            var a = new Array(result.snapshotLength);
            var i = 0;
            for (i = 0; i < result.snapshotLength; i++) {
                a[i] = result.snapshotItem(i);
            }
            return a;
        }
        throw new Error("org.iswas.utils.XPathExpression[there is no expression!]");
    };
    /**
     * This is the getNode() method of XPathExpression. It evaluates the
     * XPath expression in the specified context and returns a single
     * matching node (or null if no node matches). If more than one node
     * matches, this method returns the first one in the document. The
     * implementation differs from getNodes() only in the return type.
     *
     * @param context
     */
    Instance.prototype.getNode = function (context) {
        if (this.expression) {
            var result = this.expression.evaluate(context,
                // We just want the first match
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null);
            return result.singleNodeValue;

        }
        throw new Error("org.iswas.utils.XPathExpression[there is no expression!]");
    };
}());