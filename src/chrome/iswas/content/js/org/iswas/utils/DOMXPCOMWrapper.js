// define the class in a closure and do not overfill the global namespace
(function () {
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    DOMXPCOMWrapper = Module.createNS("org.iswas.utils.DOMXPCOMWrapper", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    DOMXPCOMWrapper.EXPORTED_SYMBOLS = ["upgradeXPCOMnsIURI"];
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    DOMXPCOMWrapper.upgradeXPCOMnsIURI = upgradeXPCOMnsIURI;
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     * Upgrade an XPCOM URI with the location object from the document object
     * model as follows:
     * <ul>
     *  <li>complete URI: (spec|href) or</li>
     *  <li>(scheme|protocol)://(userPass|(username:password))@(host)(port)(pathname)(query|search)(hash|fragment)</li>
     *  <li>prePath: (scheme|protocol)://(userPass|(username:password))@(host)(port)</li>
     *  <li>path: (pathname)(query|search)(hash|fragment)</li>
     * </ul>
     *
     * @param {nsIURI} uri
     * @param {location} location
     */
    function upgradeXPCOMnsIURI(uri, location) {
        if (!uri) {
            var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
            uri = ioService.newURI(location.href, null, null);
        }
        if (!location) {
            throw new Error("org.iswas.utils.DOMXPCOMWrapper.upgradeXPCOMnsIURI[no location available]");
        }
        var newURI = [];
        var i = null;
        for (i in uri) {
            if (uri.hasOwnProperty(i)) {
                try {
                    newURI[i] = uri[i];
                } catch (exception) {
                    // do nothing
                }
            }
        }
        newURI.query = location.search;
        newURI.search = location.search;
        newURI.hash = location.hash;
        newURI.fragment = location.hash;
        newURI.href = location.href;
        newURI.protocol = location.protocol;
        newURI.pathname = location.pathname;
        newURI.isUpgraded = true;
        return newURI;
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
}());