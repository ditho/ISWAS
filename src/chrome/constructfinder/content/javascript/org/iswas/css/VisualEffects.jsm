// define a new classname by setting their namespace and an optional version
// e.g. ClassName = Module.createNS("namespace", version);
VisualEffects = {};
// define the symbols that can be imported by other modules
// e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
var EXPORTED_SYMBOLS = ["VisualEffects"];
// define your symbols in a closure to get real privacy :-)
// and do not forget to register the @public/@static symbols for the class!
(function(){
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;
    //PreferenceManager = org.iswas.preferences.PreferenceManager;

    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    VisualEffects.show = show;

    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE

    /**
     * Let us show the visual effect the user choose in the
     * preferences.
     *
     * @public
     * @param {Object} node
     */
    function show(node) {
        // TODO: preference not set (about:config)
        /*if(PreferenceManager.getBoolPref("extensions.iswas.design.animation.basic")) {
                _standard(node);
                return;
            }
            if(PreferenceManager.getBoolPref("extensions.iswas.design.animation.complex")) {
                _advanced(node);
                return;
            }*/
        // no other effect is set so lets get the default one
        _no(node);
    }

    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var _currentNode;
    var _tabindex;
    /**
     * The user choose no effect for any WPSR candidate.
     *
     * @private
     * @param {Object} node
     */
    function _no(node) {
        if(_currentNode) {
            _currentNode.style.outline = "none";
            if(_tabindex) {
                _currentNode.setAttribute("tabindex", _tabindex);
            } else {
                _currentNode.removeAttribute("tabindex");
            }
        }
        if(node.focus) {
            if(node.hasAttribute("tabindex"))
                _tabindex = node.getAttribute("tabindex");
            node.setAttribute("tabindex", -1);
            node.focus();
        }
        if(node.select)
            node.select();
        node.style.outline = "black solid thick";
        _currentNode = node;
    }
    /**
     * The user choose the standard effect for any WPSR candidate.
     *
     * @private
     * @param {Object} node
     */
    function _standard(node) {
    // TODO: add visuell effect
    }
    /**
     *
     *
     * @private
     * @param {Object} node
     */
    function _advanced(node) {
    // TODO: add visuell effect
    }
})();
