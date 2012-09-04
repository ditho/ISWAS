/*
 * @(#)Observable.java	1.39 05/11/17
 *
 * Copyright 2006 Sun Microsystems, Inc. All rights reserved.
 * SUN PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * @ FOR YOUR INFO:
 * I do not use the java.util.Observeable because a class must be inheret from
 * java.util.Observeable and some methods are protected. This is not what I want to do.

 * This class represents an observable object, or "data"
 * in the model-view paradigm. It can be subclassed to represent an
 * object that the application wants to have observed.
 * <p>
 * An observable object can have one or more observers. An observer
 * may be any object that implements interface <tt>Observer</tt>. After an
 * observable instance changes, an application calling the
 * <code>Observable</code>'s <code>notifyObservers</code> method
 * causes all of its observers to be notified of the change by a call
 * to their <code>update</code> method.
 * <p>
 * The order in which notifications will be delivered is unspecified.
 * The default implementation provided in the Observable class will
 * notify Observers in the order in which they registered interest, but
 * subclasses may change this order, use no guaranteed order, deliver
 * notifications on separate threads, or may guarantee that their
 * subclass follows this order, as they choose.
 * <p>
 * Note that this notification mechanism is has nothing to do with threads
 * and is completely separate from the <tt>wait</tt> and <tt>notify</tt>
 * mechanism of class <tt>Object</tt>.
 * <p>
 * When an observable object is newly created, its set of observers is
 * empty. Two observers are considered the same if and only if the
 * <tt>equals</tt> method returns true for them.
 *
 * @author  Chris Warth
 * @version 1.39, 11/17/05
 * @see     java.util.Observable#notifyObservers()
 * @see     java.util.Observable#notifyObservers(java.lang.Object)
 * @see     java.util.Observer
 * @see     java.util.Observer#update(java.util.Observable, java.lang.Object)
 * @since   JDK1.0
 */
// define a new classname by setting their namespace and an optional version
// e.g. ClassName = Module.createNamespace("namespace", version);
Observeable = {};
// define the symbols that can be imported by other modules
// e.g. var EXPORTED_SYMBOLS = ["@symbols"];
var EXPORTED_SYMBOLS = ["Observeable"];

// define your symbols in a closure to get real privacy :-)
// and do not forget to register the @public/@static symbols for the class!
(function () {
    'use strict';
    // DEFINE THE @private SYMBOLS FOR THE CLOSURE
    // note it is quite good to set an underscore before each symbol
    function Instance(model) {
        this.changed = false;
        this.obs = [];
    }
    // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
    function create() {
        return new Instance();
    }
    // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
    // e.g. ClassName.method = method;
    Observeable.create = create;
    /**
     * Adds an observer to the set of observers for this object, provided
     * that it is not the same as some observer already in the set.
     * The order in which notifications will be delivered to multiple
     * observers is not specified. See the class comment.
     *
     * @param   o   an observer to be added.
     * @throws NullPointerException   if the parameter o is null.
     */
    Instance.prototype.addObserver = function (o) {
        if (!o) {
            throw new Error("org.iswas.utils.Observeable.addObserver[observer not defined]");
        }
        if (!o.update) {
            throw new Error("org.iswas.utils.Observeable.addObserver[observer o=" + o + " does not implement update]");
        }
        var i = null;
        for (i in this.obs) {
            if (this.obs[i] === o) {
                return;
            }
        }
        this.obs.push(o);
    };
    /**
     * Deletes an observer from the set of observers of this object.
     * Passing <CODE>null</CODE> to this method will have no effect.
     * @param   o   the observer to be deleted.
     */
    Instance.prototype.deleteObserver = function (o) {
        var i = null;
        for (i in this.obs) {
            if (this.obs[i] === o) {
                this.obs.splice(i, 1);
                return;
            }
        }
    };
    /**
     * Clears the observer list so that this object no longer has any observers.
     */
    Instance.prototype.deleteObservers = function () {
        this.obs = [];
    };
    /**
     * If this object has changed, as indicated by the
     * <code>hasChanged</code> method, then notify all of its observers
     * and then call the <code>clearChanged</code> method to indicate
     * that this object has no longer changed.
     * <p>
     * Each observer has its <code>update</code> method called with two
     * arguments: this observable object and the <code>arg</code> argument.
     *
     * @param   arg   any object.
     * @param   o the object that will inform the Observers
     * @see     java.util.Observable#clearChanged()
     * @see     java.util.Observable#hasChanged()
     * @see     java.util.Observer#update(java.util.Observable, java.lang.Object)
     */
    Instance.prototype.notifyObserver = function (o, arg) {
        // a temporary array buffer, used as a snapshot of the state of current Observers.
        var arrLocal = [];
        if (!this.changed) {
            return;
        }
        var i = null;
        for (i in this.obs) {
            if (this.obs.hasOwnProperty(i)) {
                arrLocal[i] = this.obs[i];
            }
        }
        this.clearChanged();
        for (i in arrLocal) {
            if (arrLocal.hasOwnProperty(i)) {
                arrLocal[i].update(o, arg);
            }
        }
    };
    /**
     * Marks this <tt>Observable</tt> object as having been changed; the
     * <tt>hasChanged</tt> method will now return <tt>true</tt>.
     */
    Instance.prototype.setChanged = function () {
        this.changed = true;
    };
    /**
     * Indicates that this object has no longer changed, or that it has
     * already notified all of its observers of its most recent change,
     * so that the <tt>hasChanged</tt> method will now return <tt>false</tt>.
     * This method is called automatically by the
     * <code>notifyObservers</code> methods.
     *
     * @see     java.util.Observable#notifyObservers()
     * @see     java.util.Observable#notifyObservers(java.lang.Object)
     */
    Instance.prototype.clearChanged = function () {
        this.changed = false;
    };
    /**
     * Tests if this object has changed.
     *
     * @return  <code>true</code> if and only if the <code>setChanged</code>
     *          method has been called more recently than the
     *          <code>clearChanged</code> method on this object;
     *          <code>false</code> otherwise.
     * @see     java.util.Observable#clearChanged()
     * @see     java.util.Observable#setChanged()
     */
    Instance.prototype.hasChanged = function () {
        return this.changed;
    };
    /**
     * Returns the number of observers of this <tt>Observable</tt> object.
     *
     * @return  the number of observers of this object.
     */
    Instance.prototype.countObservers = function () {
        return this.obs.length;
    };
}());