// define the class in a closure and do not overfill the global namespace
(function () {
    //'use strict';
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    var AbstractPane = Module.createNS("org.iswas.preferences.AbstractPane", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    AbstractPane.EXPORTED_SYMBOLS = ["switchAutorun", "addListener"];
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * The user trigger the autorun checkbox. If the checkbox is clicked
     * then the other have to be set on checked too. To that result in the
     * preferences the clicked() function is used to set them.
     *
     * @param {Object} event
     */
    function switchAutorun(event) {
        if (event.target.getAttribute("id") === "abstractGroupCheckAutorun") {
            var auto = document.getElementById("abstractGroupCheckAutorun").checked;
            // the autorun checkbox is clicked
            var g = document.getElementById("abstractGroupAutorun");
            //var c = event.target.checked;
            var i = null;
            for (i in g.childNodes) {
                if (g.childNodes[i] !== event.target) {
                    if (!g.childNodes[i].checked && !auto) {
                        g.childNodes[i].click();
                    } else if (g.childNodes[i].checked && auto) {
                        g.childNodes[i].click();
                    }
                }
            }
        }
    }
    /**
     * Add some listener to the autorun groupbox
     */
    function addListener() {
        document.getElementById("abstractGroupAutorun").addEventListener("click",
            org.iswas.preferences.AbstractPane.switchAutorun, true);
    }

    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol

    // init the abstract autorun preferences
    if (document.readyState !== "complete") {
        window.addEventListener("load", org.iswas.preferences.AbstractPane.addListener, false);
    } else {
        addListener();
    }
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    AbstractPane.switchAutorun = switchAutorun;
    AbstractPane.addListener = addListener;
}());