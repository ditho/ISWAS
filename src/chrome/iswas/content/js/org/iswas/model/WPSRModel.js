// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);
    Module.require("org.iswas.rdf.RDFPreference");
    //Module.require("org.iswas.utils.InstanceCache");
    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    WPSRModel = Module.createNS("org.iswas.model.WPSRModel",0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS= ["@symbols"];
    WPSRModel.EXPORTED_SYMBOLS= ["addObserver","deleteObserver","deleteObservers"
                                ,"checkFrequency","setInputValue","getInputValues"
                                ,"getCandidate","deleteCandidate","getIndex","next"
                                ,"prev","size","trigger","isTriggered","clear"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // set up short names for used modules in this class
        // e.g. ClassName = org.iswas.package.ClassName;
        //InstanceCache = org.iswas.utils.InstanceCache;
        Components.utils.import("resource://org/iswas/utils/InstanceCache.jsm");
        Components.utils.import("resource://org/iswas/utils/Observeable.jsm");
        RDFPreference = org.iswas.rdf.RDFPreference;
        WPSRClassLoader = org.iswas.utils.WPSRClassLoader;
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        WPSRModel.addObserver = addObserver;
        WPSRModel.deleteObserver = deleteObserver;
        WPSRModel.deleteObservers = deleteObservers;
        WPSRModel.checkFrequency = checkFrequency;
        WPSRModel.setInputValue = setInputValue;
        WPSRModel.getInputValues = getInputValues;
        WPSRModel.getCandidate = getCandidate;
        WPSRModel.deleteCandidate = deleteCandidate;
        WPSRModel.addCandidate = addCandidate;
        WPSRModel.getIndex = getIndex;
        WPSRModel.next = next;
        WPSRModel.prev = prev;
        WPSRModel.size = size;
        WPSRModel.trigger = trigger;
        WPSRModel.isTriggered = isTriggered;
        WPSRModel.clear = clear;
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        /**
         * Creates a new WPSRModel handled private by this module. If any 
         * instance is available then the method return a cached one. All
         * complex data will be stored by the update frequency of the specified
         * URI.
         *
         * @throws Error - if the resource description is not available
         */
        function create(rdf) {
            if(!rdf)
                throw new Error("org.iswas.model.WPSRModel[no resource description available]");
            var frequency = RDFPreference.get(rdf).getUpdateFrequency(content.window.location);
            var key = rdf + frequency;
            if(_cache.hasInstance(key)) {
                return _cache.getInstance(key);
            }
            var instance = new Instance(rdf);
            _cache.setInstance(key, instance);
            return instance;
        }
        /**
         * Add an Observer to inform about model changes.
         *
         * @param {Object} o - observer to inform
         */
        function addObserver(o) {
            _observeable.addObserver(o);
        }
        /**
         * Delete an Observer and do not inform anymore about model changes.
         *
         * @param {Object} o - observer to delete
         */
        function deleteObserver(o) {
            _observeable.deleteObserver(o);
        }
        /**
         * Delete all Observers and do not inform anyone about model changes.
         */
        function deleteObservers() {
            _observeable.deleteObservers();
        }
        /**
         * Set the input for the current page.
         *
         * @param rdf
         * @param input
         */
        function setInputValue(rdf, input) {
            var host = content.window.location.host;
            if(!_inputMap[host])
                _inputMap[host] = {};
            _inputMap[host][input.getAttribute("id")] = input.value;
            _observeable.setChanged();
            _observeable.notifyObserver(WPSRModel, rdf);
        }
        /**
         * Get the inputs for the current page
         */
        function getInputValues() {
            return _inputMap[content.window.location.host];
        }
        /**
         * Set the uri for the resource description. If the uri is changed for
         * that then the model inform any Observer about the change.
         *
         * @param rdf
         */
        function checkFrequency(rdf) {
            //dump("org.iswas.model.WPSRModel.setURI[rdf=" + rdf + "]\n");
            var frequency = RDFPreference.get(rdf).getUpdateFrequency(content.window.location);
            if(!_frequency[rdf] || _frequency[rdf] != frequency) {
                _frequency[rdf] = frequency;
                _observeable.setChanged();
                _observeable.notifyObserver(WPSRModel, rdf);
            }
        }
        /**
         * Get a Candidate from the stored results of the specific annotation 
         * type. If no index is given, then the current will be returned.
         * 
         * @param rdf - the annotation type to get the candidate for
         * @param index - to get
         */
        function getCandidate(rdf, index) {
            //dump("org.iswas.model.WPSRModel.getCandidate[rdf=" + rdf + ",index=" + index + "]\n");
            var inst = create(rdf);
            return inst.getCandidate(index);
        }
        /**
         * Delete a candidate from the list of results. If no index is given
         * the current will be deleted.
         * 
         * @param rdf - the annotation type to delete a candidate for
         * @param index - to delete
         */
        function deleteCandidate(rdf, index) {
            //dump("org.iswas.model.WPSRModel.deleteCandidate[rdf=" + rdf + ",index=" + index + "]\n");
            var inst = create(rdf);
            inst.deleteCandidate(index);
        }
        /**
         * Add a candidate to list of results.
         *
         * @param rdf
         * @param can
         */
        function addCandidate(rdf, can) {
            //dump("org.iswas.model.WPSRModel.addCandidate[rdf=" + rdf + ",candidate=" + can + "]\n");
            var inst = create(rdf);
            inst.addCandidate(can);
        }
        /**
         * Get the current index from the list of results for the resource 
         * description
         * 
         * @param rdf - the index to get for
         */
        function getIndex(rdf) {
            //dump("org.iswas.model.WPSRModel.getIndex[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            return inst.getIndex();
        }
        /**
         * Increase the current index.
         *
         * @param rdf - to increase the index for
         */
        function next(rdf) {
            //dump("org.iswas.model.WPSRModel.next[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            inst.next();
        }
        /**
         * Decrease the current index.
         *
         * @param rdf - to decrease the index for
         */
        function prev(rdf) {
            //dump("org.iswas.model.WPSRModel.prev[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            inst.prev();
        }
        /**
         * Get the size of the result list
         * 
         * @param rdf - to get the size for
         */
        function size(rdf) {
            //dump("org.iswas.model.WPSRModel.size[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            return inst.size();
        }
        /**
         * Trigger the analysis in WPSR
         * 
         * @param rdf - to trigger WPSR for
         */
        function trigger(rdf) {
            var begin = new Date();
            //dump("org.iswas.model.WPSRModel.trigger[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            inst.trigger();
            dump("org.iswas.model.WPSRModel.trigger[rdf=" + rdf + ",time=" + (new Date().getTime() - begin.getTime()) + "ms]\n");
        }
        /**
         * Show whether the analysis was triggered or not
         * 
         * @param rdf - to show if triggered
         */
        function isTriggered(rdf) {
            //dump("org.iswas.model.WPSRModel.isTrigger[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            return inst.isTriggered();
        }
        /**
         * Set the model not triggered for the resource description.
         * 
         * @param rdf - to clear up the trigger flag
         */
        function clear(rdf) {
            //dump("org.iswas.model.WPSRModel.clear[rdf=" + rdf + "]\n");
            var inst = create(rdf);
            inst.clear();
        }
        /**
         * Constructor
         *
         * @param rdf - name of the resource description
         */
        function Instance(rdf) {
            this.rdf = rdf;
            this.index = 0;
            this.triggered = false;
        }
        /**
         * Get a candidate of the WPSR candidate list. If there is no index then
         * the candidate of the current position will be returned. The Observers
         * will not be informed because there is no change done by the model.
         *
         * TODO: build a map with tagNameModels
         *
         * @param {Number} index - of the candidate in the list
         * @throws Error - if the analysis is not triggered before
         * @return the candidate or null if there is no one.
         */
        Instance.prototype.getCandidate = function(index){
            if(!this.triggered)
                throw new Error("org.iswas.model.WPSRModel.getCandidate[can not fetch any candidate, trigger the analysis first]");
            if(!this.candidateList || this.candidateList.isEmpty())
                return null;
            if(index != 0 && !index) {
                return this.candidateList.get(this.index);
            }
            return this.candidateList.get(index);
        };
        /**
         * Delete a candidate of the WPSR candidate list. If there is no index
         * then the candidate of the current position will be deleted. All
         * Observers will be notify by the change.
         *
         * @param {Number} index
         * @throws Error - if the analysis is not triggered before
         */
        Instance.prototype.deleteCandidate = function(index) {
            if(!this.triggered)
                throw new Error("org.iswas.model.WPSRModel.deleteCandidate[can not delete any candidate, trigger the analysis first]");
            if(!this.candidateList || this.candidateList.isEmpty())
                return;
            if(index != 0 && !index) {
                this.candidateList.remove(this.index);
            } else {
                this.candidateList.remove(index);
            }
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
        };
        /**
         * Add an candidate to the list of candidates.
         *
         * TODO: do not proof any method -> instanceof
         *
         * @param {Object} candidate - to add
         * @throws Error - if the candidate is not defined
         */
        Instance.prototype.addCandidate = function(candidate) {
            if(!candidate)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate is not defined]");
            if(!candidate.getXMLString)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate.getXMLString is not defined]");
            if(!candidate.getRole)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate.getRole is not defined]");
            if(!candidate.getXPathExpression)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate.getXPathExpression is not defined]");
            if(!candidate.setXPathExpression)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate.setXPathExpression is not defined]");
            if(!candidate.getScore)
                throw new Error("org.iswas.model.WPSRModel.addCandidate[candidate.getScore is not defined]");
            this.candidateList.add(candidate);
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
        };
        /**
         * Get the index of the current candidate.
         *
         * @return Number - the index
         */
        Instance.prototype.getIndex = function() {
            return this.index;
        };
        /**
         * Cycling positive pass through of the WPSR candidate list. All
         * Observers will be notify by the change.
         *
         * @throws Error - if the analysis is not triggered before
         */
        Instance.prototype.next = function() {
            // ArrayList<String> candidateList
            if(!this.triggered)
                throw new Error("org.iswas.model.WPSRModel.next[can not increase the index, trigger the analysis first]");
            if(this.candidateList == null || this.candidateList.isEmpty())
                return;
            this.index++;
            this.index %= this.size();
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
        };
        /**
         * Cycling negative pass throug of the WPSR candidate list. All
         * Observers will be notify by the change.
         *
         * @throws Error - if the analysis is not triggered before
         */
        Instance.prototype.prev = function() {
            // ArrayList<String> candidateList
            if(!this.triggered)
                throw new Error("org.iswas.model.WPSRModel.prev[can not decrease the index, trigger the analysis first]");
            if(this.candidateList == null || this.candidateList.isEmpty())
                return;
            this.index--;
            this.index += this.size();
            this.index %= this.size();
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
        };
        /**
         * Get the number of the available WPSR candidates.
         *
         * @returns Number - the size
         */
        Instance.prototype.size = function() {
            // ArrayList<String> candidateList
            if(!this.candidateList)
                return 0;
            return this.candidateList.size();
        };
        /**
         * Trigger the WPSR analysis and get new candidates.
         */
        Instance.prototype.trigger = function() {
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
            this.candidateList = WPSRClassLoader.trigger(this.rdf, "wpsr.WPSR");
            //this.cnadidateList = WPSRClassLoader.trigger(this.rdf, "wpsr.WPSRDOM");
            this.triggered = true;
            _observeable.setChanged();
            _observeable.notifyObserver(this, this.rdf);
        };
        /**
         * Show whether the analysis is also triggered or not. Note: if it is
         * triggered there are candidates available for this model.
         *
         * @return boolean - trigged or not
         */
        Instance.prototype.isTriggered = function() {
            return this.triggered;
        };
        /**
         * Set the model not triggered for the resource description.
         */
        Instance.prototype.clear = function() {
            this.triggered = false;
        }
        /**
         * debug information
         */
        Instance.prototype.toString = function() {
            return "org.iswas.model.WPSRModel[rdf=" + this.rdf + "]";
        };
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
        var _observeable = Observeable.create();
        var _cache = InstanceCache.create("org.iswas.model.WPSRModel");
        var _frequency = {};
        var _inputMap = {};
    })();
})();