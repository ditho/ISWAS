// define the class in a closure and do not overfill the global namespace
(function () {
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    /**
     * Listen for the URLbar.
     *
     * @see https://developer.mozilla.org/en/Code_snippets/On_pageload
     * @see https://developer.mozilla.org/En/Listening_to_events_on_all_tabs
     *
     */
    ProgressListener = Module.createNS("org.iswas.listener.ProgressListener", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    ProgressListener.EXPORTED_SYMBOLS = ["QueryInterface", "onLinkIconAvailable",
        "onLocationChange", "onProgressChange", "onRefreshAttempted",
        "onSecurityChange", "onStateChange", "onStatusChange"];
    // set up short names for used modules in this class
    // e.g. ClassName = org.iswas.package.ClassName;

    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    ProgressListener.QueryInterface = QueryInterface;
    ProgressListener.onLinkIconAvailable = onLinkIconAvailable;
    ProgressListener.onLocationChange = onLocationChange;
    ProgressListener.onProgressChange = onProgressChange;
    ProgressListener.onRefreshAttempted = onRefreshAttempted;
    ProgressListener.onSecurityChange = onSecurityChange;
    ProgressListener.onStateChange = onStateChange;
    ProgressListener.onStatusChange = onStatusChange;
    ProgressListener.load = load;

    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    /**
     *
     * @param {Object} aIID
     */
    function QueryInterface(aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
                aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
                aIID.equals(Components.interfaces.nsISupports)) {
            return ProgressListener;
        }
        throw Components.results.NS_NOINTERFACE;
    }
    /**
     * Called when the URI of the document displayed in the tab changes.
     *
     * TODO: init the Progresslistener with the controller
     *
     * @param {Object} webProgress - the progress instance responsible for handling events
     * @param {Object} request - representing the associated request
     * @param {Object} location - indicating the tab's new URI
     */
    function onLocationChange(webProgress, request, location) {
        // This fires when the location bar changes; i.e load event is confirmed
        // or when the user switches tabs. If you use ProgressListener for more than one tab/window,
        // use webProgress.DOMWindow to obtain the tab/window which triggered the change.
        // website loaded?
        dump("org.iswas.listener.ProgessListener[location changed]\n");
        if (content.document.readyState === "complete" || !hasChanged()) {
            // process the new location(URI).
            org.iswas.controller.ISWASController.autorun(false);
        } else {
            // no, register EventListener that fired if the webpage is loaded completely.
            // TODO: the eventListener is sometimes loaded twice
            window.content.addEventListener("load", load, false);
        }
        clearChanged();
    }
    /**
     * Called when the document is not loaded.
     */
    function load() {
        // process the new location(URI).
        org.iswas.controller.ISWASController.autorun(true);
        window.content.removeEventListener("load", load, false);
    }
    /**
     * Notification that a refresh or redirect has been requested in aWebProgress
     * for example, via a <meta http-equiv="refresh"> or an HTTP Refresh: header.
     * If any registered progress listener returns false from this method then the
     * attempt to refresh will be blocked.
     *
     * @param {Object} webProgress - instance that fired the notification.
     * @param {Object} refreshURI - new URI that a webProgress has requested redirecting to.
     * @param {Object} msec - delay in milliseconds before refresh.
     * @param {Object} sameURI - true if a webProgress is requesting a refresh of the current URI.
     */
    function onRefreshAttempted(webProgress, refreshURI, msec, sameURI) {
    }
    /**
     * Notification indicating the state has changed for one of the requests
     * associated with aWebProgress.
     *
     * @param {Object} webProgress - the progress instance responsible for handling events
     * @param {Object} request - representing the associated request
     * @param {Object} flag - indicating the new state. This value is a combination of one of the State Transistion Flags and State Type Flags
     * @param {Object} status - status code associated with the state change (whether or not the request was successful)
     */
    function onStateChange(webProgress, request, flag, status) {
        // If you use ProgressListener for more than one tab/window, use
        // aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
        if (flag & 0x00000001) {
            // fires when the load event is initiated
            setChanged();
        }
        if (flag & 0x00000004) {
            // fires when the data for a request is being transferred to an end consumer.
            // This flag indeicates that the request has been targeted, and that the user may
            // start seeing content corresponding to the request.
        }
        if (flag & 0x00000010) {
            // fires when the load finishes
        }
    }
    /**
     * Called when updated progress information for the download of a document is available.
     *
     * @param {Object} webProgress - the progress instance responsible for handling events
     * @param {Object} request - representing the associated request
     * @param {Object} curSelf - current progress for the request indicated by the request parameter
     * @param {Object} maxSelf - representing 100% complete for the request indicated by the request parameter
     * @param {Object} curTot - current progress for all requests associated with webProgress
     * @param {Object} maxTot - total progress for all requests associated with webProgress
     */
    function onProgressChange(webProgress, request, curSelf, maxSelf, curTot, maxTot) {
    }
    /**
     * Notification that the status of a request has changed. The status message
     * is intended to be displayed to the user (e.g., in the status bar of the browser).
     *
     * @param {Object} webProgress - the progress instance responsible for handling events
     * @param {Object} request - representing the associated request
     * @param {Object} status - is not an error code. Instead, it is a numeric value that indicates the current status of the request.
     * @param {Object} message - localized text corresponding to a status.
     */
    function onStatusChange(webProgress, request, status, message) {
    }
    /**
     *
     * @param {Object} webProgress - the progress instance responsible for handling events
     * @param {Object} request - representing the associated request that has new security state
     * @param {Object} state - a value composed of the Security State flags and the security strength Flags
     */
    function onSecurityChange(webProgress, request, state) {
    }
    /**
     * Notification that the site icon for a browser has been found.
     */
    function onLinkIconAvailable() {
    }
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    var loaded = false;
    function setChanged() {
        loaded = true;
    }
    function hasChanged() {
        return loaded;
    }
    function clearChanged() {
        loaded = false;
    }
})();