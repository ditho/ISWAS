// define the class in a closure and do not overfill the global namespace
(function () {
    //'use strict';
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    var PreferenceManager = Module.createNS("org.iswas.preferences.PreferenceManager", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    PreferenceManager.EXPORTED_SYMBOLS = ["setBoolPref", "getBoolPref"];
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch2);
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * Set the value of the given preference. This method handle the mozilla
     * preference service and converts the String "false" into an real false
     * Boolean value and notnew Boolean("false") that converts any defined
     * String into a <tt>true</tt> boolean value. The conversion is made
     * here because this would not be done by the mozilla preference service
     * method setBoolPref.
     *
     * @param {String} pref - the preference to set
     * @param {Boolean/String} value - the new value to set
     * @throws Error - if the preference is not defined (see->about:config)
     */
    PreferenceManager.setBoolPref = function (pref, value) {
        // stops that: new Boolean("false") -> true
        try {
            if (typeof pref === "string" && value.toLowerCase() === "false") {
                prefManager.setBoolPref(pref, false);
            }
            prefManager.setBoolPref(pref, value);
        } catch (exception) {
            throw new Error("org.iswas.preferences.PreferenceManager.setBoolPref[msg=\"pref not found\",pref=\"" + pref + "\",value=\"" + value + "\"]");
        }
    };
    /**
     * Get the value of the given preference. This method handle the mozilla
     * preference service and converts the String into a boolean value given
     * by the service method getBoolPref of mozilla that returns normally a
     * String.
     *
     * @param {Boolean/String} pref - the preference to get the value from
     * @throws Error - if the preference is not defined (see->about:config)
     * @return boolean - of the preference
     */
    PreferenceManager.getBoolPref = function (pref) {
        // for now the getBoolPref method of mozilla returns type String. Be
        // sure that will be also in the future. At last convert the type of
        // this method into a real boolean value and <tt>stops that</tt>:
        // new Boolean("false") -> true, e.g. if you try this in an if clause
        // you can get abnormally functionality of your code.
        try {
            if ((prefManager.getBoolPref(pref)).toString().toLowerCase() === "false") {
                return false;
            }
            return true;
        } catch (exception) {
            throw new Error("org.iswas.preferences.PreferenceManager.getBoolPref[msg=\"pref not found\",pref=\"" + pref + "\"]");
        }
    };
}());