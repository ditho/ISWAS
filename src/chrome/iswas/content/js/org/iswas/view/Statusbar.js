// define the class in a closure and do not overfill the global namespace
(function () {
    // define the namespace for Statusbar
    Statusbar = Module.createNS("org.iswas.view.Statusbar", 0.1);
    // symbols that can be imported by other modules
    Statusbar.EXPORTED_SYMBOLS = ["setTooltip"];
    /**
     * Show a message in the statusbar.
     *
     * @param {String} msg the message to show
     */
    function setTooltip(msg) {
        var stringBundle = document.getElementById("strings_iswas");
        document.getElementById("RDFStatusbar").label = stringBundle.getString(msg);
    }
    // NOW DEFINE THE @private METHODS
    // NOW DEFINE THE @private MEMBERS
    // AT LAST REGISTER THE @public METHODS IN THE CLASS
    Statusbar.setTooltip = setTooltip;
}());