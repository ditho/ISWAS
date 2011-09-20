// define the class in a closure and do not overfill the global namespace
(function() {
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);

    // define the namespace for Statusbar
    Statusbar = Module.createNS("org.iswas.view.Statusbar", 0.1);
    // symbols that can be imported by other modules
    Statusbar.EXPORTED_SYMBOLS = ["setTooltip"];
    // define public and private methods in a closure to get real private methods
    // do not forget to register the public methods in the class!
    (function() {
        //AT FIRST DEFINE ALL @public METHODS

        /**
         * Show a message in the statusbar.
         *
         * @param {String} msg the message to show
         */
        function setTooltip(msg) {
            var stringBundle = document.getElementById("strings_constructFinder");
            document.getElementById("RDFStatusbar").label = stringBundle.getString(msg);
        }
        // NOW DEFINE THE @private METHODS
        // NOW DEFINE THE @private MEMBERS
        // AT LAST REGISTER THE @public METHODS IN THE CLASS
        Statusbar.setTooltip = setTooltip;
    })();
})();