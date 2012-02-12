// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    Components.utils.import("resource://org/iswas/utils/InstanceCache.jsm");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    WPSRClassLoader = Module.createNS("org.iswas.utils.WPSRClassLoader",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    WPSRClassLoader.EXPORTED_SYMBOLS = ["trigger","load"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        WPSRClassLoader.trigger = trigger;
        WPSRClassLoader.load = load;

        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        /**
         * Trigger the process method of a specific namespace.
         *
         * @param rdf - the description to search for
         * @param ns - the namespace to execute
         * @throws Error - if rdf is not defined
         * @throws Error - if ns is not defined
         * @throws Error - if ns is not loaded
         */
        function trigger(rdf, ns) {
            if(!rdf)
                throw new Error("org.iswas.utils.WPSRClassLoader.trigger[rdf not defined]");
            if(!ns)
                throw new Error("org.iswas.utils.WPSRClassLoader.trigger[namespace not defined]");
            if(!_cache.hasInstance(ns))
                throw new Error("org.iswas.utils.WPSRClassLoader[nothing loaded for namespace=" + ns + "]");

            var serializer = new XMLSerializer();
            var xml = serializer.serializeToString(content.document);
            var uri = content.window.location;
            return _cache.getInstance(ns).process(xml, uri, rdf);
            //return _cache.getInstance(ns).process(content.document, uri, rdf);
        }
        /**
         * Load a Class from the given namespace.
         *
         * @param ns - the namespace to load
         */
        function load(ns) {
            //Get extension folder installation path...
            if(!_extPath) {
                window.setTimeout(_load, 500);
                return false;
            }
            dump("org.iswas.utils.WPSRClassLoader[extensioPath=" + _extPath.path + "]\n");
            if(!ns)
                throw new Error("org.iswas.utils.WPSRClassLoader[namespace not defined]");
            //var extensionPath = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getInstallLocation("iswas@uni-rostock.de").getItemLocation("iswas@uni-rostock.de");
            // Get path to the JAR files (the following assumes your JARs are within a
            // directory called "java" at the root of your extension's folder hierarchy)
            // You must add this utilities (classloader) JAR to give your extension full privileges
            // the line below have to be uncomment for the prod version of the firefox extension
            var classLoader = "file:///" + _extPath.path.replace(/\\/g, "/") + "/java/javaFirefoxExtensionUtils.jar";
            // Add the paths for all the other JAR files that you will be using
            // seems you don't actually have to replace the backslashes as they work as well
            // the line below have to be uncomment for the prod version of the firefox extension
            var jarPath = "file:///" + _extPath.path.replace(/\\/g, "/") + "/java/wpsr.jar";
            // build a regular JavaScript array (LiveConnect will auto-convert to a Java array)
            var urls = [];
            urls[0] = new java.net.URL(jarPath);
            urls[1] = new java.net.URL(classLoader);
            var cl = java.net.URLClassLoader.newInstance(urls);
            //Set security policies using the above policyAdd() function
            _addPolicy(cl, urls);
            //load the java class
            var myClass = cl.loadClass(ns);
            // create an instance of this class
            _cache.setInstance(ns, myClass.newInstance());
            return true;
        // TODO: fire an event ClassLoaded
        }
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _cache = InstanceCache.create("org.iswas.utils.WPSRClassLoader");
        var _extPath;


        AddonManager.getAddonByID("iswas@uni-rostock.de", function(addon) {
            _extPath = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
        });


        /**
         * This function will be called to give the necessary privileges to your JAR files
         *
         * Error calling method on NPObject!
         * [plugin exception: java.lang.SecurityException:no manifiest section for signature file entry
         * com/sun/java/help/impl/TagProperties.class].::undefined -> answer can be found in installKSWS.pdf
         *
         * @param loader
         * @param urls
         * @return
         */
        function _addPolicy(loader, urls) {
            try {
                var extensionUtilsPolicy = "edu.mit.simile.javaFirefoxExtensionUtils.URLSetPolicy";
                var policyClass = java.lang.Class.forName(extensionUtilsPolicy, true, loader);
                var policy = policyClass.newInstance();
                policy.setOuterPolicy(java.security.Policy.getPolicy());
                java.security.Policy.setPolicy(policy);
                policy.addPermission(new java.security.AllPermission());
                for (var i in urls) {
                    policy.addURL(urls[i]);
                }
            }catch(ex) {
                dump("org.iswas.utils.WPSRClassLoader[exception=" + ex + "]");
            }
        }
    })();
})();