//#region NLib Core

/**
 * module: NLib Core.
 * version: 1.0.8
 * required: none.
 */
nlib = function () {
    //---- Begin of Helper Class.
    /**
     * Constructor.
     * 
     * @param {any} nlib_instance The instance of nlib.
     */
    function _helpersClass(nlib_instance) {
        this._nlib = nlib_instance;
        this.ModuleName = 'Helpers';
    }
    /**
     * Register code add-in.
     * 
     * @param {any} instance
     * @param {string} addInName
     * @param {method} getMethod
     */
    _helpersClass.prototype.registerCodeAddIn = function (instance, addInName, getMethod) {
        if (!instance) {
            console.log('instance is null.');
            return;
        }
        //console.log("Module Name: " + addInName);
        Object.defineProperty(instance, addInName, {
            configurable: true,
            get: getMethod
        });
    };
    //---- End of Helper Class.

    //------------------------------------------------------
    // [==== NLib Helper register code add-in.         ====]
    //------------------------------------------------------
    var _instance = null; // for singelton instance.
    var _helpers = null; // for helper instance.

    /**
     * Constructor.
     */
    function _ctor() {
        // class definition
        var obj = {};
        if (!obj.prototype) obj.prototype = {};
        /**
         * Create new object with specificed factory. If factory is null new object returns.
         */
        obj.create = function (factory) {
            var result;
            if (!factory) {
                result = {};
                result.prototype = Object.create(Object.prototype);
            }
            else {
                result = new factory();
                result.prototype = Object.create(factory.prototype);
            } 
            return result;
        };
        /**
         * Get Type Name of specificed object.
         */
        obj.typeName = function(obj) {
            return (!obj || !obj.constructor) ? 'undefined' : obj.constructor.name;
        };
        // define helpers
        Object.defineProperty(obj, 'helpers', {
            get: function () {
                if (!_helpers)
                    _helpers = new _helpersClass(obj);
                return _helpers;
            }
        });
        // returns created instance.
        return obj;
    };
    /**
     * Gets Instance.
     * 
     * @returns {any} new instance if no exists instance otherwise returns exists instance.
     */
    function _getInstance() {
        if (!_instance)
            _instance = _ctor(); // Again no new keyword;
        return _instance;
    };

    // return new object that contains getInsance method to execute immediately.    
    return {
        getInstance: _getInstance
    };
}().getInstance();

//#endregion

//#region NLib Utils

/**
 * module: NLib Utils.
 * version  1.0.8
 * required: none.
 */
; (function () {
    /**
     * Constructor.
     */
    function Utils() { };
    /**
     * Checks is object is null or undefined.
     *
     * @param {any} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is null otherwist returns false.
     */
    Utils.prototype.isNull = function(value) {
        // Note. Empty string is evaluate is null.
        //return (value === null || value === 'undefined' || typeof value === 'undefined');
        return (!value || value === 'undefined');
    };
    /**
     * Checks is specificed string has white space.
     *
     * @param {string} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is contains one or more whitespace otherwise returns false.
     */
    Utils.prototype.hasWhiteSpace = function (value) {
        if (value === null || value === 'undefined' || typeof value === 'undefined')
            return false;
        return value.indexOf(' ') >= 0;
    };
    /**
     * Checks is valid email address text.
     * 
     * @param {string} value The object to checks is null or undefined.
     * @returns {boolean} Returns true if value is valid email format otherwist returns false.
     */
    Utils.prototype.isValidEmail = function (value) {
        if (!value || value === 'undefined')
            return false;
        var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
        return (value.match(r) == null) ? false : true;
    };
    /**
     * get expired date from current date by specificed expired day(s).
     * if nothing assigned 1 day returns.
     * 
     * @param {Number} value The number of expires days start from today.
     * @returns {Date} Returns expired date. If no expiredDays assigned. one day will used.
     */
    Utils.prototype.getExpiredDate = function (expiredDays) {
        var date = new Date();

        var day = expiredDays;
        if (expiredDays === null || expiredDays === 'undefined' || typeof expiredDays === 'undefined')
            day = 1;

        if (day < 1) day = 1;
        var seconds = 60 * 60 * 24 * day;

        date.setTime(date.getTime() + (seconds * 1000));
        return date;
    };
    /**
     * Generate new Unique Id.
     */
    Utils.prototype.newUId = function() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    };

    // declare namespace. If not exists create new one with assigned factory.
    if (!nlib.utils) {
        nlib.utils = nlib.create(Utils);
    }
    else nlib.utils = nlib.utils;
})();

//#endregion

//#region NLib Cookies

/**
 * module: NLib Cookies.
 * version: 1.0.8
 * required: none.
 * Source: JavaScript Cookie v2.1.3 from https://github.com/js-cookie/js-cookie
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack.
 * Released under the MIT license.
 */
; (function () {
    //---- Begin local methods.
    /**
     * converter function.
     */
    function converter() { }
    /**
     * extended function.
     */
    function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    };
    /**
     * api function.
     */
    function api(key, value, attributes) {
        var result;
        if (typeof document === 'undefined') {
            return;
        }
        // Write
        if (arguments.length > 1) {
            attributes = extend({ path: '/' }, this.defaults, attributes);

            if (typeof attributes.expires === 'number') {
                var expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                attributes.expires = expires;
            }

            try {
                result = JSON.stringify(value);
                if (/^[\{\[]/.test(result)) {
                    value = result;
                }
            } catch (e) { }

            if (!converter.write) {
                value = encodeURIComponent(String(value))
                    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            } else {
                value = converter.write(value, key);
            }

            key = encodeURIComponent(String(key));
            key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
            key = key.replace(/[\(\)]/g, escape);

            return (document.cookie = [
                key, '=', value,
                attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                attributes.path ? '; path=' + attributes.path : '',
                attributes.domain ? '; domain=' + attributes.domain : '',
                attributes.secure ? '; secure' : ''
            ].join(''));
        }

        // Read
        if (!key) {
            result = {};
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling "get()"
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var rdecode = /(%[0-9A-Z]{2})+/g;
        var i = 0;

        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                var name = parts[0].replace(rdecode, decodeURIComponent);
                cookie = converter.read ?
                    converter.read(cookie, name) : converter(cookie, name) ||
                    cookie.replace(rdecode, decodeURIComponent);

                if (this.json) {
                    try {
                        cookie = JSON.parse(cookie);
                    } catch (e) { }
                }

                if (key === name) {
                    result = cookie;
                    break;
                }

                if (!key) {
                    result[name] = cookie;
                }
            } catch (e) { }
        }

        return result;
    };
    //---- End local methods.

    /**
     * Constructor.
     */
    function Cookies() {
        this.defaults = {};
    };
    /**
     * Set Cookies value by key with attributes.
     */
    Cookies.prototype.set = function (key, value, attributes) {
        return api(key, value, attributes);
    };
    /**
     * Gets cookies value and attributes by key.
     */
    Cookies.prototype.get = function (key) {
        return api(key);
    };
    /**
     * Remove cookies by key.
     */
    Cookies.prototype.remove = function (key, attributes) {
        api(key, '', extend(attributes, { expires: -1 }));
    };
    /**
     * Gets cookies value and attributes by key in json format.
     */
    Cookies.prototype.getJSON = function () {
        return api.apply({ json: true }, [].slice.call(arguments));
    };
    /*
    Cookies.prototype.runTest = function () {
        console.log('Test Cookies.');
        console.log('Remove Cookies.');
        cookie1 = this.remove('key1');
        cookie1 = this.remove('key2');
        cookie1 = this.remove('key3');
        var cookie1;
        cookie1 = this.get('key1');
        console.log('Read Cookies value : ', cookie1);
        this.set('key1', 'joe1', { expires: 1 });
        this.set('key2', 'joe2', { expires: 1 });
        this.set('key3', 'joe3', { expires: 1 });
        console.log('Test Write Cookies.');
        cookie1 = this.get('key1');
        console.log('Read Cookies value : ', cookie1);
        var json_cookies1 = this.getJSON();
        console.log('Read Cookies in json : ', json_cookies1);
    };
    */
    // declare namespace. If not exists create new one with assigned factory.
    if (!nlib.cookies) {
        nlib.cookies = nlib.create(Cookies);
    }
    else nlib.cookies = nlib.cookies;
})();

//#endregion

//#region NLib (local)Storage

/**
 * module: NLib (local)Storage.
 * version: 1.0.8
 * required: none.
 * Source: simpleStorage.js (0.2.1) from https://github.com/ZaDarkSide/simpleStorage
 */
; (function () {
    //---- Begin local methods.
    var VERSION = '0.2.1';
    /* This is the object, that holds the cached values */
    var _storage = false;
    /* How much space does the storage take */
    var _storage_size = 0;

    var _storage_available = false;
    var _ttl_timeout = null;
    /* Status */
    var _lsStatus = 'OK';
    /* Error Code */
    var LS_NOT_AVAILABLE = 'LS_NOT_AVAILABLE';
    var LS_DISABLED = 'LS_DISABLED';
    var LS_QUOTA_EXCEEDED = 'LS_QUOTA_EXCEEDED';
    /**
     * This method might throw as it touches localStorage and doing so
     * can be prohibited in some environments
     */
    function _init() {
        //console.log('Execute local storage init code....');
        // this method throws if localStorage is not usable, otherwise returns true
        _storage_available = _checkAvailability();
        // Load data from storage
        _loadStorage();
        // remove dead keys
        _handleTTL();
        // start listening for changes
        _setupUpdateObserver();
        // handle cached navigation
        if ('addEventListener' in window) {
            window.addEventListener('pageshow', function (event) {
                if (event.persisted) {
                    _reloadData();
                }
            }, false);
        }
        _storage_available = true;
    }
    /**
     * Sets up a storage change observer
     */
    function _setupUpdateObserver() {
        if ('addEventListener' in window) {
            window.addEventListener('storage', _reloadData, false);
        } else {
            document.attachEvent('onstorage', _reloadData);
        }
    }
    /**
     * Reload data from storage when needed
     */
    function _reloadData() {
        try {
            _loadStorage();
        } catch (E) {
            _storage_available = false;
            return;
        }
        _handleTTL();
    }
    /**
     * Load.
     */
    function _loadStorage() {
        var source = localStorage.getItem('jsStorage');

        try {
            _storage = JSON.parse(source) || {};
        } catch (E) {
            _storage = {};
        }

        _storage_size = _get_storage_size();
    }
    /**
     * Save.
     */
    function _save() {
        try {
            localStorage.setItem('jsStorage', JSON.stringify(_storage));
            _storage_size = _get_storage_size();
        } catch (E) {
            return _formatError(E);
        }
        return true;
    }
    /**
     * Gets Storage Size.
     */
    function _get_storage_size() {
        var source = localStorage.getItem('jsStorage');
        return source ? String(source).length : 0;
    }
    /**
     * Handle TTL.
     */
    function _handleTTL() {
        var curtime, i, len, expire, keys, nextExpire = Infinity,
            expiredKeysCount = 0;

        clearTimeout(_ttl_timeout);

        if (!_storage || !_storage.__jsStorage_meta || !_storage.__jsStorage_meta.TTL) {
            return;
        }

        curtime = +new Date();
        keys = _storage.__jsStorage_meta.TTL.keys || [];
        expire = _storage.__jsStorage_meta.TTL.expire || {};

        for (i = 0, len = keys.length; i < len; i++) {
            if (expire[keys[i]] <= curtime) {
                expiredKeysCount++;
                delete _storage[keys[i]];
                delete expire[keys[i]];
            } else {
                if (expire[keys[i]] < nextExpire) {
                    nextExpire = expire[keys[i]];
                }
                break;
            }
        }

        // set next check
        if (nextExpire !== Infinity) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(nextExpire - curtime, 0x7FFFFFFF));
        }

        // remove expired from TTL list and save changes
        if (expiredKeysCount) {
            keys.splice(0, expiredKeysCount);

            _cleanMetaObject();
            _save();
        }
    }
    /**
     * Set TTL.
     */
    function _setTTL(key, ttl) {
        var curtime = +new Date(),
            i, len, added = false;

        ttl = Number(ttl) || 0;

        // Set TTL value for the key
        if (ttl !== 0) {
            // If key exists, set TTL
            if (_storage.hasOwnProperty(key)) {

                if (!_storage.__jsStorage_meta) {
                    _storage.__jsStorage_meta = {};
                }

                if (!_storage.__jsStorage_meta.TTL) {
                    _storage.__jsStorage_meta.TTL = {
                        expire: {},
                        keys: []
                    };
                }

                _storage.__jsStorage_meta.TTL.expire[key] = curtime + ttl;

                // find the expiring key in the array and remove it and all before it (because of sort)
                if (_storage.__jsStorage_meta.TTL.expire.hasOwnProperty(key)) {
                    for (i = 0, len = _storage.__jsStorage_meta.TTL.keys.length; i < len; i++) {
                        if (_storage.__jsStorage_meta.TTL.keys[i] === key) {
                            _storage.__jsStorage_meta.TTL.keys.splice(i);
                        }
                    }
                }

                // add key to keys array preserving sort (soonest first)
                for (i = 0, len = _storage.__jsStorage_meta.TTL.keys.length; i < len; i++) {
                    if (_storage.__jsStorage_meta.TTL.expire[_storage.__jsStorage_meta.TTL.keys[i]] > (curtime + ttl)) {
                        _storage.__jsStorage_meta.TTL.keys.splice(i, 0, key);
                        added = true;
                        break;
                    }
                }

                // if not added in previous loop, add here
                if (!added) {
                    _storage.__jsStorage_meta.TTL.keys.push(key);
                }
            } else {
                return false;
            }
        } else {
            // Remove TTL if set
            if (_storage && _storage.__jsStorage_meta && _storage.__jsStorage_meta.TTL) {

                if (_storage.__jsStorage_meta.TTL.expire.hasOwnProperty(key)) {
                    delete _storage.__jsStorage_meta.TTL.expire[key];
                    for (i = 0, len = _storage.__jsStorage_meta.TTL.keys.length; i < len; i++) {
                        if (_storage.__jsStorage_meta.TTL.keys[i] === key) {
                            _storage.__jsStorage_meta.TTL.keys.splice(i, 1);
                            break;
                        }
                    }
                }

                _cleanMetaObject();
            }
        }
        // schedule next TTL check
        clearTimeout(_ttl_timeout);
        if (_storage && _storage.__jsStorage_meta && _storage.__jsStorage_meta.TTL && _storage.__jsStorage_meta.TTL.keys.length) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(Math.max(_storage.__jsStorage_meta.TTL.expire[_storage.__jsStorage_meta.TTL.keys[0]] - curtime, 0), 0x7FFFFFFF));
        }

        return true;
    }
    /**
     * Clear Meta Object.
     */
    function _cleanMetaObject() {
        var updated = false,
            hasProperties = false,
            i;

        if (!_storage || !_storage.__jsStorage_meta) {
            return updated;
        }

        // If nothing to TTL, remove the object
        if (_storage.__jsStorage_meta.TTL && !_storage.__jsStorage_meta.TTL.keys.length) {
            delete _storage.__jsStorage_meta.TTL;
            updated = true;
        }

        // If meta object is empty, remove it
        for (i in _storage.__jsStorage_meta) {
            if (_storage.__jsStorage_meta.hasOwnProperty(i)) {
                hasProperties = true;
                break;
            }
        }

        if (!hasProperties) {
            delete _storage.__jsStorage_meta;
            updated = true;
        }

        return updated;
    }
    /**
     * Checks if localStorage is available or throws an error
     */
    function _checkAvailability() {
        var err;
        var items = 0;

        // Firefox sets localStorage to 'null' if support is disabled
        // IE might go crazy if quota is exceeded and start treating it as 'unknown'
        if (window.localStorage === null || typeof window.localStorage === 'unknown') {
            err = new Error('localStorage is disabled');
            err.code = LS_DISABLED;
            throw err;
        }

        // There doesn't seem to be any indication about localStorage support
        if (!window.localStorage) {
            err = new Error('localStorage not supported');
            err.code = LS_NOT_AVAILABLE;
            throw err;
        }

        try {
            items = window.localStorage.length;
        } catch (E) {
            throw _formatError(E);
        }

        try {
            // we try to set a value to see if localStorage is really usable or not
            window.localStorage.setItem('__jsStorageInitTest', (+new Date).toString(16));
            window.localStorage.removeItem('__jsStorageInitTest');
        } catch (E) {
            if (items) {
                // there is already some data stored, so this might mean that storage is full
                throw _formatError(E);
            } else {
                // we do not have any data stored and we can't add anything new
                // so we are most probably in Private Browsing mode where
                // localStorage is turned off in some browsers (max storage size is 0)
                err = new Error('localStorage is disabled');
                err.code = LS_DISABLED;
                throw err;
            }
        }

        return true;
    }
    /**
     * Format Error.
     */
    function _formatError(E) {
        var err;
        // No more storage:
        // Mozilla: NS_ERROR_DOM_QUOTA_REACHED, code 1014
        // WebKit: QuotaExceededError/QUOTA_EXCEEDED_ERR, code 22
        // IE number -2146828281: Out of memory
        // IE number -2147024882: Not enough storage is available to complete this operation
        if (E.code === 22 || E.code === 1014 || [-2147024882, -2146828281, -21474675259].indexOf(E.number) > 0) {
            err = new Error('localStorage quota exceeded');
            err.code = LS_QUOTA_EXCEEDED;
            return err;
        }

        // SecurityError, localStorage is turned off
        if (E.code === 18 || E.code === 1000) {
            err = new Error('localStorage is disabled');
            err.code = LS_DISABLED;
            return err;
        }

        // We are trying to access something from an object that is either null or undefined
        if (E.name === 'TypeError') {
            err = new Error('localStorage is disabled');
            err.code = LS_DISABLED;
            return err;
        }

        return E;
    };
    /**
     * Sets value for _lsStatus
     */
    function _checkError(err) {
        if (!err) {
            _lsStatus = 'OK';
            return err;
        }

        switch (err.code) {
            case LS_NOT_AVAILABLE:
            case LS_DISABLED:
            case LS_QUOTA_EXCEEDED:
                _lsStatus = err.code;
                break;
            default:
                _lsStatus = err.code || err.number || err.message || err.name;
        }

        return err;
    };
    //---- End local methods.

    //---- Begin of Local Storage Class.
    /**
     * Constructor.
     */
    function LocalStorage() {
        this.version = VERSION;
        this.status = _lsStatus;
    };
    /**
     * Checks can use local storage.
     */
    LocalStorage.prototype.canUse = function () {
        return _lsStatus === 'OK' && !!_storage_available;
    };
    /**
     * Sets Value to specificed key.
     */
    LocalStorage.prototype.set = function (key, value, options) {
        if (key === '__jsStorage_meta')
            return false;
        if (!_storage)
            return false;
        // undefined values are deleted automatically
        if (typeof value === 'undefined')
            return this.deleteKey(key);

        options = options || {};
        // Check if the value is JSON compatible (and remove reference to existing objects/arrays)
        try {
            value = JSON.parse(JSON.stringify(value));
        } catch (E) {
            return _formatError(E);
        }

        _storage[key] = value;
        _setTTL(key, options.TTL || 0);
        return _save();
    };
    /**
     * Checks specificed key is exists.
     */
    LocalStorage.prototype.hasKey = function (key) {
        return !!this.get(key);
    };
    /**
     * Gets Value by specificed key.
     */
    LocalStorage.prototype.get = function (key) {
        if (!_storage)
            return false;

        if (_storage.hasOwnProperty(key) && key !== '__jsStorage_meta') {
            // TTL value for an existing key is either a positive number or an Infinity
            if (this.getTTL(key)) {
                return _storage[key];
            }
        }
    };
    /**
     * Delete key.
     */
    LocalStorage.prototype.deleteKey = function (key) {
        if (!_storage)
            return false;

        if (key in _storage) {
            // delete from array.
            delete _storage[key];
            // update TTL to 0.
            _setTTL(key, 0);
            // Save to storage.
            return _save();
        }

        return false;
    };
    /**
     * Sets TTL value to specificed key.
     */
    LocalStorage.prototype.setTTL = function (key, ttl) {
        if (!_storage)
            return false;

        _setTTL(key, ttl);

        return _save();
    };
    /**
     * Gets TTL value from specificed key.
     */
    LocalStorage.prototype.getTTL = function (key) {
        var ttl;
        if (!_storage)
            return false;

        if (_storage.hasOwnProperty(key)) {
            if (_storage.__jsStorage_meta &&
                _storage.__jsStorage_meta.TTL &&
                _storage.__jsStorage_meta.TTL.expire &&
                _storage.__jsStorage_meta.TTL.expire.hasOwnProperty(key)) {

                ttl = Math.max(_storage.__jsStorage_meta.TTL.expire[key] - (+new Date()) || 0, 0);

                return ttl || false;
            } else {
                return Infinity;
            }
        }

        return false;
    };
    /**
     * Flush all data.
     */
    LocalStorage.prototype.flush = function () {
        if (!_storage)
            return false;

        _storage = {};
        try {
            localStorage.removeItem('jsStorage');
            return true;
        } catch (E) {
            return _formatError(E);
        }
    };
    /**
     * Retrieve all used keys as an array.
     */
    LocalStorage.prototype.index = function () {
        if (!_storage)
            return false;

        var index = [], i;
        for (i in _storage) {
            if (_storage.hasOwnProperty(i) && i !== '__jsStorage_meta') {
                index.push(i);
            }
        }
        return index;
    };
    /**
     * Gets storage size.
     */
    LocalStorage.prototype.storageSize = function () {
        return _storage_size;
    };
    /*
    // Run Test.
    LocalStorage.prototype.runTest = function () {
        console.log('Supports Local Storage: ', this.canUse());
        console.log('Set key1 to joe1');
        this.set('key1', 'joe1', { TTL: 100000 });
        this.set('key2', 'joe2', { TTL: 100000 });
        this.set('key3', 'joe3', { TTL: 100000 });
        console.log('Has key1: ', this.hasKey('key1'))
        var data1 = this.get('key1')
        console.log('Data for key1: ', data1);
        var keys = this.index();
        console.log('All index: ', keys);
    };
    */
    //---- End of Local Storage Class.

    // declare namespace. If not exists create new one with assigned factory.
    if (!nlib.storage) {
        try {
            _init();
        } catch (E) {
            _checkError(E);
        }            
        nlib.storage = nlib.create(LocalStorage);
    }
    else nlib.storage = nlib.storage; // re-assigned.
})();

//#endregion

//#region NLib Navigator

/**
 * module: NLib Navigator.
 * version  1.0.8
 * required: none.
 */
; (function () {
    /**
     * Constructor.
     */
    function Navigator() { }
    /**
     * Goto specificed url with supports assigned query string object.
     * 
     * @param {string} url The url to navigate.
     * @param {any} queryObject The object that all properties used as query string.
     */
    Navigator.prototype.gotoUrl = function (url, queryObject) {
        var queryString = this.getQueryString(queryObject);
        //console.log(queryString);
        var newUrl = url + queryString;
        //console.log(newUrl);
        document.location.replace(newUrl);
    };
    /**
     * Refresh url (force reload).
     */
    Navigator.prototype.refresh = function () {
        document.location.reload(true)
    };
    /**
     * Gets Query string for specificed query object.
     * @param {any} queryObject The object that all properties used as query string.
     */
    Navigator.prototype.getQueryString = function (queryObject) {
        var queryString = '';
        if (queryObject && Object.keys(queryObject).length > 0) {
            queryString = queryString + '?';
            var key;
            var prefix = '';
            for (key in queryObject) {
                if (!queryObject.hasOwnProperty(key))
                    continue;
                var paramStr = key.toString() + '=' + queryObject[key].toString();
                //console.log(paramStr);
                queryString = queryString + prefix + paramStr;
                if (prefix === '') prefix = '&';
            }
        }
        return queryString;
    };
    /**
     * Clear query string from url. (call when page loaded).
     */
    Navigator.prototype.clearQueryString = function () {
        var href = window.location.href;
        var newUrl = href.substring(0, href.indexOf('?'));
        //console.log(href);
        //console.log(newUrl);
        window.history.replaceState({}, document.title, newUrl);
    };

    // declare namespace. If not exists create new one with assigned factory.
    if (!nlib.nav) {
        nlib.nav = nlib.create(Navigator);
    }
    else nlib.nav = nlib.nav;
})();

//#endregion

//#region NLib data type extenstion methods

/**
 * module: NLib various data type extenstion methods.
 * version  1.0.8
 * required: none.
 */
; (function () {
    //-- String.format - The C# like format.
    // Usage:
    // let a = "welcome {0} to {1}";
    // a.format('Joe', 'My world');
    String.prototype.format = function () {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a
    };
    //-- Repeat character by specificed number.
    String.repeat = function (chr, count) {
        var str = "";
        for (var x = 0; x < count; x++) { str += chr };
        return str;
    };
    //-- Pad Left by specificed number.
    String.prototype.padL = function (width, pad) {
        if (!width || width < 1)
            return this;

        if (!pad) pad = " ";
        var length = width - this.length
        if (length < 1) return this.substr(0, width);

        return (String.repeat(pad, length) + this).substr(0, width);
    };
    //-- Pad Right by specificed number.
    String.prototype.padR = function (width, pad) {
        if (!width || width < 1)
            return this;

        if (!pad) pad = " ";
        var length = width - this.length
        if (length < 1) this.substr(0, width);

        return (this + String.repeat(pad, length)).substr(0, width);
    };
    //-- Date.format - The C# like DateTime.format.
    // Usage:
    // let a = new Date();
    // d.format();
    // d.format('yyyy-MM-dd');
    // The avaliable format:
    //   yyyy : year (4 digits)
    //     yy : year (2 digits)
    //     MM : month (1-12)
    //     dd : date (1-31)
    //      t : pm/am
    //     HH : hour (0-23)
    //     hh : hour (1-12)
    //     mm : minute (0-59)
    //     ss : second (0-59)
    //     ss : second (0-59)
    //    fff : milliseconds (0-999)
    Date.prototype.format = function (format) {
        var date = this;
        if (!format) format = "yyyy-MM-dd HH-mm-ss.fff";

        var month = date.getUTCMonth() + 1;
        var year = date.getUTCFullYear();
        // year.
        if (format.indexOf("yyyy") > -1)
            format = format.replace("yyyy", year.toString());
        else if (format.indexOf("yy") > -1)
            format = format.replace("yy", year.toString().substr(2, 2));
        // month
        format = format.replace("MM", month.toString().padL(2, "0"));            
        // date.
        format = format.replace("dd", date.getUTCDate().toString().padL(2, "0"));
        // hour - am/pm.
        var hours = date.getUTCHours();
        if (format.indexOf("t") > -1) {
            if (hours > 11)
                format = format.replace("t", "pm")
            else
                format = format.replace("t", "am")
        }
        // hour.
        if (format.indexOf("HH") > -1)
            format = format.replace("HH", hours.toString().padL(2, "0"));
        if (format.indexOf("hh") > -1) {
            if (hours > 12) hours - 12;
            if (hours == 0) hours = 12;
            format = format.replace("hh", hours.toString().padL(2, "0"));
        }
        // minute.
        if (format.indexOf("mm") > -1)
            format = format.replace("mm", date.getUTCMinutes().toString().padL(2, "0"));
        // second.
        if (format.indexOf("ss") > -1)
            format = format.replace("ss", date.getUTCSeconds().toString().padL(2, "0"));
        // millisecond.
        if (format.indexOf("fff") > -1) {
            format = format.replace("fff", date.getUTCMilliseconds().toString().padL(3, "0"));
        }

        return format;
    };
})();

//#endregion

//#region NLib JQuery $.when extenstion methods

/**
 * module: NLib JQuery $.when extenstion methods.
 * version  1.0.8
 * required: JQuery.
 */
; (function () {
    // Put somewhere in your scripting environment
    if (jQuery.when.all === undefined) {
        jQuery.when.all = function (deferreds) {
            var deferred = new jQuery.Deferred();
            $.when.apply(jQuery, deferreds).then(
                function () {
                    deferred.resolve(Array.prototype.slice.call(arguments));
                },
                function () {
                    deferred.fail(Array.prototype.slice.call(arguments));
                });

            return deferred;
        }
    }
})();

//#endregion

//#region NLib Event Classes

/**
 * NDelegate class. The .NET like delegate.
 */
class NDelegate {
    constructor() {
        this._locked = false;
        this._events = [];
    };
    //-- public methods.
    indexOf(value) {
        if (value && value instanceof Function)
            return this._events.indexOf(value);
        else return -1;
    };
    add(value) {
        if (value && value instanceof Function) {
            let index = this.indexOf(value);
            if (index === -1)
                this._events.push(value); // append.
            else this._events[index] = value; // replace.
        }
    };
    remove(value) {
        if (value && value instanceof Function) {
            let index = this.indexOf(value);
            if (index >= 0 && index < this._events.length) {
                this._events.splice(index, 1); // delete.
            }
        }
    };
    locked() { this._locked = true; };
    unlocked() { this._locked = false; };
    get isLocked() { return this._locked; };
    invoke(...args) {
        if (this._locked) return;
        let evtDataObj = this.createEventData(args);
        this._events.forEach((evt) => { this.raiseEvent(evt, evtDataObj); });
    };
    createEventData(...args) { return args; };
    raiseEvent(evt, evtDataObj) { evt(evtDataObj) };
};
/**
 * EventHandler class. The .NET like EventHandler.
 */
class EventHandler extends NDelegate {
    //-- overrides
    createEventData(...args) {
        let sender = null;
        let evtData = null;

        if (args && args.length >= 1 && args[0]) {
            var a0 = args[0];
            if (a0.length >= 1) sender = a0[0];
            if (a0.length >= 2) evtData = a0[1];

            if (!evtData) { evtData = { sender: null, handled: false }; }
        }
        return { "sender": sender, "evtData": evtData }
    };

    raiseEvent(evt, evtDataObj) {
        let evtData = (!evtDataObj) ? { sender: null, handled: false } : evtDataObj.evtData;

        if (!evtData) { evtData = { handled: false }; }

        if (typeof evtData.handled === 'undefined' || evtData.handled === null)
            evtData.handled = false;

        if (!evtData.handled) { evt(evtDataObj.sender, evtData); }
    };
};
/**
 * The Event Args class. The .NET like EventArgs.
 */
class EventArgs { static get Empty() { return null; } };
/**
 * The DataSource class.
 */
class DataSource {
    //-- constructor.
    constructor() {
        this._datasource = null;
        this._selectedIndex = -1;
        this._datasourceChanged = new EventHandler();
        this._selectedIndexChanged = new EventHandler();
    };
    //-- protected methods.
    onDatasourceChange() { };
    onSelectedIndexChange() { };
    //-- public properties.
    get datasource() { return this._datasource; };
    set datasource(value) {
        let oVal = this._datasource;
        let nVal = value;

        if (value && (value instanceof Array)) {
            this._datasource = value;

            this._datasourceChanged.invoke(this, { "oldValue": oVal, "newValue": nVal });

            if (this._datasource && this._datasource.length > 0)
                this.selectedIndex = 0;
            else this.selectedIndex = -1;
            // call protected method.
            this.onDatasourceChange();
        }
    };

    get selectedIndex() { return this._selectedIndex; };
    set selectedIndex(value) {        
        let oVal = this._selectedIndex;
        let nVal = -1;

        if (!this._datasource ||
            value < 0 || value >= this._datasource.length) {
            nVal = -1;
            this._selectedIndex = -1;
        }
        else {
            nVal = value;
            this._selectedIndex = value;
        }
        // call protected method.
        this.onSelectedIndexChange();
        // raise event
        this._selectedIndexChanged.invoke(self, { "oldValue": oVal, "newValue": nVal })
    };

    get selectedObject() {
        if (!this.datasource ||
            this.selectedIndex < 0 || this.selectedIndex >= this.datasource.length)
            return null;
        else return this.datasource[this.selectedIndex];
    };
    //-- event handlers.
    get datasourceChanged() { return this._datasourceChanged; };
    get selectedIndexChanged() { return this._selectedIndexChanged; };
};

//#endregion

//#region MockPromise

/**
 * The Mock Promise class. Use setTimeout to make function look like call from server.
 */
class MockPromise {
    //-- create promist
    // The fn parameter is the function that has no parameter and returns result.
    static create(fn, timeout) {
        let ret = new Promise((resolve, reject) => {
            let result = null;
            if (!fn || !(fn instanceof Function)) {
                console.error('The assigned value should be function.');
            }
            setTimeout(() => {
                result = fn();
                resolve(result);
            }, (timeout || !(typeof timeout !== 'Number')) ? timeout : 33);
        });

        return ret;
    };
};

//#endregion

//#region NJson

/**
 * NJson class. Provide helper functions to work with JSON object.
 */
class NJson {
    //- Create New object with clone all properties with supports ignore case sensitive.
    /**
     * Clone json object and change all properties name with auto change new 
     * object's property name to lowercase if required.
     * @param {Object} o The dest object (json object).
     * @param {Boolean} caseSensitive true if require returns object has all property name in lowercase.
     */
    static cloneJSON(o, caseSensitive) {
        var oRet = {}
        var ignoreCase = (caseSensitive) ? false : true;
        var keys = Object.keys(o);
        keys.forEach((key) => {
            oRet[(ignoreCase) ? key.toLowerCase() : key] = o[key];
        });
        return oRet;
    };
    /**
     * Assigned all properties value from src object to desc object.
     * @param {Object} dest The dest object (json object).
     * @param {Object} src The source object (json object).
     */
    static setValues(dest, src) {
        var keys = Object.keys(dest);
        keys.forEach(key => {
            let dKey = key.toLowerCase();
            dest[key] = (!src[dKey]) ? null : src[dKey];
        })
    };
};

//#endregion

//#region NDOM and related classes

//#region NDOM

NDOM = class {
    constructor(elem) {
        this._elem = elem;
        this._class = new NDOM.Class(this);
        this._event = new NDOM.Event(this);
        this._style = new NDOM.Style(this);
        this._attr = new NDOM.Attribute(this);
        this._selector = new NDOM.Selector(this);
        this._fluent = new NDOM.Fluent(this);
    };
    // class
    get class() { return this._class; }
    // event
    get event() { return this._event; }
    // attributes
    get attrs() { return this._attr; }
    // attribute
    attr(name, value) {
        if (!this._elem || !arguments) return undefined;
        if (arguments.length === 0) {
            return this._attr;
        }
        else if (arguments.length === 1) {
            return this._attr.get(name);
        }
        else if (arguments.length === 2) {
            this._attr.set(name, value);
        }
    };
    // styles
    get styles() { return this._style; }
    // style
    style(name, value) {
        if (!this._elem || !arguments) return undefined;
        if (arguments.length === 0) {
            return this._style;
        }
        else if (arguments.length === 1) {
            return this._style.get(name);
        }
        else if (arguments.length === 2) {
            this._style.set(name, value);
        }
    };
    // query selector
    query(selector) { 
        if (!this._elem || !arguments) return null;
        if (arguments.length === 0) {
            return this._selector;
        }
        else {
            return this._selector.gets(selector);
        }        
    };
    // element information.
    get tagName() {
        if (!this._elem) return '';
        return this._elem.tagName;
    }
    get text() {
        if (!this._elem) return '';
        return this._elem.textContent;
    }
    set text(value) {
        if (!this._elem) return;
        if (this._elem.textContent != value) {
            this._elem.textContent = value;
        }
    }
    get html() {
        if (!this._elem) return '';
        return this._elem.innerHTML;
    }
    set html(value) {
        if (!this._elem) return;
        if (this._elem.innerHTML != value) {
            this._elem.innerHTML = value;
        }
    }
    // parent/child access.
    get parent() {
        if (!this._elem) return null;
        if (!this._elem.parentElement) return null;
        return new NDOM(this._elem.parentElement);
    }
    get children() {
        let results = [];
        if (!this._elem) return results;
        let el = this._elem;
        let celems = el.children;
        if (celems && celems.length > 0) {
            let iMax = celems.length;
            for (let i = 0; i < iMax; i++) {
                let celem = celems[i];
                results.push(new NDOM(celem));
            }
        }
        return results;
    }
    // child node management.
    addChild(dom) {
        if (!this._elem || !dom || !dom.elem) return;
        this._elem.appendChild(dom.elem);
    };
    removeChild(value) {
        if (!this._elem || !dom || !dom.elem) return;
        this._elem.removeChild(dom.elem);
    };
    clearChildren() {
        if (!this._elem) return;
        while (this._elem.firstChild) {
            this._elem.removeChild(this._elem.firstChild);
        }
    };
    // offset
    get offsetLeft() {
        if (!this._elem) return undefined
        return this._elem.offsetLeft;
    }
    get offsetTop() { 
        if (!this._elem) return undefined
        return this._elem.offsetTop;
    }
    get offsetWidth() {
        if (!this._elem) return undefined
        return this._elem.offsetWidth;
    }
    get offsetHeight() {
        if (!this._elem) return undefined
        return this._elem.offsetHeight;
    }
    // behavior
    focus() { 
        if (!this._elem) return;
        this._elem.focus();
    };
    // fluent
    fluent() { return this._fluent; };
    get elem() { return this._elem; }
    // static
    static create(tagName, options) {
        return new NDOM(document.createElement(tagName, options));
    };
};

//#endregion

//#region NDOM.Class

NDOM.Class = class {
    constructor(dom) { this._dom = dom; };

    add(...classNames) {
        if (!this._dom || !this._dom.elem) return;
        let el = this._dom.elem;
        el.classList.add(...classNames);
    };
    remove(...classNames) {
        if (!this._dom || !this._dom.elem) return;
        let el = this._dom.elem;
        el.classList.remove(...classNames);
    };
    toggle(className, force) {
        if (!this._dom || !this._dom.elem) return;
        if (!className || className.trim() === '') return;
        let el = this._dom.elem;
        return el.classList.toggle(className, force);
    };
    has(className) {
        if (!this._dom || !this._dom.elem) return;
        if (!className || className.trim() === '') return;
        let el = this._dom.elem;
        return el.classList.contains(className);
    };
    replace(oldClassName, newClassName) {
        if (!this._dom || !this._dom.elem) return;
        if (!oldClassName || oldClassName.trim() === '') return;
        let el = this._dom.elem;
        el.classList.replace(oldClassName, newClassName);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Event

NDOM.Event = class {
    constructor(dom) { this._dom = dom; };

    // event
    add(eventName, handler, options) {
        if (!this._dom || !this._dom.elem) return;
        if (!eventName || eventName.trim() === '') return;
        if (!handler) return;
        let el = this._dom.elem;
        el.addEventListener(eventName, handler, options);
    };
    remove(eventName, handler, options) {
        if (!this._dom || !this._dom.elem) return;
        if (!eventName || eventName.trim() === '') return;
        let el = this._dom.elem;
        el.removeEventListener(eventName, handler, options);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Attribute

NDOM.Attribute = class {
    constructor(dom) { this._dom = dom; };

    get(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        return el.getAttribute(name);
    };
    set(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        let el = this._dom.elem;
        el.setAttribute(name, value);
    };
    remove(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        el.removeAttribute(name);
    };
    has(name) {
        if (!this._dom || !this._dom.elem) return false;
        if (!name || name.trim() === '') return false;
        let el = this._dom.elem;
        return el.hasAttribute(name);
    };
    toggle(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        if (this.has(name)) this.remove(name);
        else {
            let val = (value) ? value : '';
            this.set(name, val);
        }
    };
    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Style

NDOM.Style = class {
    constructor(dom) {
        this._dom = dom;
        this._margin = new NDOM.Margin(dom);
        this._padding = new NDOM.Padding(dom);
    };

    get(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        return el.style[name];
    };
    set(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        let el = this._dom.elem;
        el.style[name] = value;
    };
    remove(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        el.style[name] = undefined;
    };
    has(name) {
        if (!this._dom || !this._dom.elem) return false;
        if (!name || name.trim() === '') return false;
        let el = this._dom.elem;
        return (el.style[name] !== undefined && el.style[name] !== '');
    };

    // margin
    get margins() { return this._margin; }
    margin() {
        if (!this._margin) return undefined;
        if (!arguments || arguments.length === 0) {
            return this._margin.val();
        }
        else this._margin.val(...arguments);
    };
    // padding
    get paddings() { return this._padding; }
    padding() {
        if (!this._padding) return undefined;
        if (!arguments || arguments.length === 0)
            return this._padding.val();
        else this._padding.val(...arguments);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Style (wrapper)

//#region BlockStyle (common style)

NDOM.BlockStyle = class {
    constructor(dom) {
        this._dom = dom;
        this._prefix = '';
    };

    get prefix() { return this._prefix; }
    set prefix(value) { this._prefix = value; }

    get hasStyle() { return (this._dom && this._dom.elem); }

    val() {        
        if (!this.hasStyle) return undefined; 
        if (!arguments) return this.style(this._prefix);
        if (arguments.length === 1) {
            let value = arguments[0];
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 2) {
            let value = 
                arguments[0] + // top-bottom
                ' ' +
                arguments[1];  // right-left
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 3) {
            let value = 
                arguments[0] + // top
                ' ' + 
                arguments[1] + // right-left
                ' ' +
                arguments[2];  // bottom
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 4) {
            let value = 
                arguments[0] + // top
                ' ' + 
                arguments[1] + // right-left
                ' ' +
                arguments[2] + // bottom
                ' ' + 
                arguments[3];  // left
            this._dom.style(this._prefix, value);
        }
        else {
            return this._dom.style(this._prefix);
        }
    }
    get left() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-left');
    }
    set left(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-left', value);
    }
    get right() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-right');
    }
    set right(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-right', value);
    }
    get top() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-top');
    }
    set top(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-top', value);
    }
    get bottom() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-bottom');
    }
    set bottom(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-bottom', value);
    }

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }    
};

//#endregion

//#region Margin

NDOM.Margin = class extends NDOM.BlockStyle {
    constructor(dom) {
        super(dom);
        this.prefix = 'margin';
    };
};

//#endregion

//#region Padding

NDOM.Padding = class extends NDOM.BlockStyle {
    constructor(dom) {
        super(dom);
        this.prefix = 'padding';
    };
};

//#endregion

//#endregion

//#region NDOM.Selector

NDOM.Selector = class {
    constructor(dom) { this._dom = dom; };
    // returns the first child element that matches a specified CSS selector(s).
    // of an element. If not found null returns.
    get(selector) {
        if (!this._dom || !this._dom.elem) return null;
        if (!selector || selector.trim() === '') return null;
        let el = this._dom.elem;
        let element = el.querySelector(selector);
        return (element) ? element : null;
    };
    // returns a collection of an element's child elements that match a specified 
    // CSS selector(s), as a static NodeList object. If not found empty array returns.
    gets(selector) {
        let results = [];
        if (!this._dom || !this._dom.elem) return results;
        if (!selector || selector.trim() === '') return results;
        let el = this._dom.elem;
        let elements = el.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                let edom = new NDOM(element);
                results.push(edom);
            })
        }
        return results;
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Fluent - not implements.

NDOM.Fluent = class {
    constructor(dom) { this._dom = dom; };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#endregion

//#region NArray and related classes

//#region NArray

class NArray {
    /**
     * Create value map for spefificed array.
     * 
     * @param {Array} items The source array to create map.
     * @param {String} member The element property's name to get value.
     * @param {Boolean} lowerCase true for convert value to lowercase.
     */
    static map(items, member, lowerCase = true) {
        let results = null;
        if (!items) return results;
        // inline helper function.
        let isString = value => (typeof value === 'string');
        let hasMember = (item, name) => (Object.keys(item).indexOf(name) !== -1);
        // local variables
        results = items.map(item => {
            let val = (member && hasMember(item, member)) ? item[member] : item;
            return (isString(val) && lowerCase) ? String(val).toLowerCase() : val;
        });
        return results;
    };
    /**
     * Create multiple value maps for spefificed array.
     * 
     * @param {Array} items The source items.
     * @param {Array} members The member name array to gernate map array.
     * @param {Boolean} lowerCase True for convert value to string lowercase.
     */
    static maps(items, members, lowerCase = true) {
        let result = null;
        let isArray = value => (value instanceof Array);
        let isString = value => (typeof value === 'string');
        if (!items || items.length <= 0) return result;
        let omembers;
        let bValue = isString(members);
        if (bValue) omembers = [ members ];
        let bArray = isArray(members);
        if (bArray) omembers = members;
        if (!omembers) return result; // cannot create member array.
        // create lookup object
        result = {};
        items.forEach(item => {
            omembers.forEach(omember => {
                let smem = String(omember);
                if (!result[smem]) result[smem] = [];
                let oVal = String(item[smem]);
                let sVal = (lowerCase) ? oVal.toLowerCase() : oVal;
                result[smem].push(sVal);
            })
        });
        return result;
    };
    /**
     * Create new array from source array with exclude items or values in exclude array.
     * 
     * @param {Array} items The source array.
     * @param {Array} excludes The Array that contains items or values to exclude.
     * The exclude array must be same structure as source array or can be simple array
     * that contains only values (must be same data type as item's member) to exclude.
     * @param {String} member The element property's name to get value.
     * @param {Boolean} ignoreCase true for ignore case with compare.
     * @param {Boolean} compareAsString true for convert value to string for compare.
     */
    static exclude(items, excludes, member, ignoreCase, compareAsString = true) {
        let results = null;
        if (!items) return results;
        if (!excludes) return items;
        // inline helper function.
        let isString = value => (typeof value === 'string');
        // local vars.
        let idx, val, oVal, exmaps;
        // init exclude maps.
        exmaps = NArray.map(excludes, member, ignoreCase);
        exmaps = (compareAsString) ? exmaps.map(elem => String(elem)) : exmaps;

        results = items.filter(item => {
            val = (member) ? item[member] : item;
            oVal = (isString(val) && ignoreCase) ? val.toLowerCase() : val;
            idx = (compareAsString) ? exmaps.indexOf(String(oVal)) : exmaps.indexOf(oVal);
            return (idx === -1); // returns results if not found in exclude map.
        });
        return results;
    };
    /**
     * Gets filter items from specificed source array and filter string.
     * Returns object that contains 
     * items array (the filter items),
     * values array (the value of item's member that match filter),
     * indexes array (the index of item in source array) and
     * parts array that contains match information on each item.
     * 
     * @param {Array} items The source array.
     * @param {String} filter The filter string.
     * @param {String} member The element property's name to filter value.
     * @param {Boolean} ignoreCase true for ignore case with compare.
     */
    static filter(items, filter, member, ignoreCase = true) {
        // prepare results.
        let result = { items: null, values: null, indexes: null, parts: null };
        if (!items) return result;

        let sFilter = (ignoreCase) ? filter.toLowerCase() : filter;
        // get maps of all items
        let srcs = NArray.map(items, member, false); // with case sensitive.        
        let maps = NArray.map(items, member, ignoreCase); // with ignoreCase option.
        // filter
        let values = [], indexes = [];
        let matchs = maps.filter((elem, index) => {
            let val = (ignoreCase) ? String(elem).toLowerCase() : String(elem);
            let found = val.indexOf(sFilter) !== -1;
            if (found) {
                values.push(srcs[index]); // keep value of source item (case sensitive).
                indexes.push(index); // keep index of source item.
            }
            return found;
        });
        // build results.
        let outs = [], vals = [], idxs = [], parts = [];
        matchs.forEach((elem, index) => {
            let sVal = (ignoreCase) ? String(elem).toLowerCase() : String(elem);
            let ipos = sVal.indexOf(sFilter);
            if (ipos === -1) return; // item not match filter.

            let aVal = String(values[index]); // get source value from values array.
            // extract parts.
            let part = {
                pre: aVal.substr(0, ipos),
                match: aVal.substr(ipos, sFilter.length),
                post: aVal.substr(ipos + sFilter.length, elem.length - (ipos + sFilter.length))
            }
            outs.push(items[indexes[index]]); // append to items array.
            vals.push(values[index]) // append to values array.
            idxs.push(indexes[index]) // append to indexes array.
            parts.push(part); // append to parts array.
        });
        // set result arrays and returns.
        result.items = outs;
        result.values = vals;
        result.indexes = idxs;
        result.parts = parts;
        return result;
    };
    /**
     * Gets array which all items in source array that has all members's value match in lookup array.
     * The source array is acts like child table in database.
     * The lookup array is acts like master table in database.
     * 
     * @param {Array} items The source (or child) array.
     * @param {Array} members The source Mambers
     * @param {Array} lookupItems The lookup (or master) array.
     * @param {Array} lookupMembers The lookup Members
     * @param {Boolean} ignoreCase true for ignore case with compare.
     */
    static inArray(items, members, lookupItems, lookupMembers, ignoreCase = true) {
        let results = null;
        let isArray = value => (value instanceof Array);
        let isString = value => (typeof value === 'string');

        if (!isArray(items)) return results;
        if (!isArray(lookupItems)) return results;

        if (!items || items.length <= 0) return results;
        if (!lookupItems || lookupItems.length <= 0) return results;

        let smembers, lmembers;

        let bothIsValue = (isString(members) && isString(lookupMembers));
        if (bothIsValue) {
            // make an local array.
            smembers = [ members ];
            lmembers = [ lookupMembers ];
        }

        let bothIsArray = (isArray(members) && isArray(lookupMembers));
        if (bothIsArray) {
            if (members && lookupMembers && members.length !== lookupMembers.length) {
                console.error('Number of members not match');
                return results;
            }
            // set to local array.
            smembers = members;
            lmembers = lookupMembers;
        }

        if (!smembers || !lmembers) return results; // cannot create both member array.
        // create lookup object
        let lookup = NArray.maps(lookupItems, lookupMembers, ignoreCase);

        results = items.filter(item => {
            let matchCnt = 0;
            for (let i = 0; i < smembers.length; ++i) {
                let smember = String(smembers[i]);
                let dmember = String(lmembers[i]);
                let oVal = String(item[smember]);
                let sVal = (ignoreCase) ? oVal.toLowerCase() : oVal;
                // find is current src item's value is in desc value lookup array.
                let idx = lookup[dmember].indexOf(sVal)
                if (idx !== -1) matchCnt++; // found so increase match count.
            }
            return (matchCnt === smembers.length);
        });

        return results;
    };
    /**
     * Find index of item in source array.
     * 
     * @param {Array} items The source array to find index.
     * @param {String} member The element property's name to get value.
     * @param {Object} item The item to find index.
     * @param {Boolean} lowerCase true for convert value to lowercase.
     */
    static indexOf(items, member, item, lowerCase = true) {
        let idx = -1;
        if (!items) return idx;
        if (!item) return idx;
        let map = NArray.map(items, member, lowerCase);
        if (!map) return idx;
        // inline helper function.
        let isString = value => (typeof value === 'string');
        let hasMember = (item, name) => (Object.keys(item).indexOf(name) !== -1);
        let val = (member && hasMember(item, member)) ? item[member] : item;
        let sVal = (isString(val) && lowerCase) ? String(val).toLowerCase() : val;
        idx = map.indexOf(sVal);
        return idx;
    };
};

//#endregion

//#region NArray.Date (helper for generate date related array)

NArray.Date = class {
    /**
     * Gets Current Year.
     */
    static get currentYear() { return Number(new Date().getFullYear()); };
    /**
     * Create array of past years from current year with specificed parameter.
     * i.e. if delta is 2 and current year is 2012 the result is 2010, 2011, 2012.
     * 
     * @param {Number} delta The number of past years to generate.
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getYears(delta, asObj = true) {
        let currYr = Number(new Date().getFullYear());
        let idalta = (delta) ? delta : 5;
        let stYr = currYr - idalta;
        let edYr = currYr;
        let years = [];
        for (let i = stYr; i <= edYr; i++) {
            if (asObj)
                years.push({ id:i, text: String(i) });
            else years.push(i);
        }
        return years;
    };
    /**
     * Gets Month array.
     * 
     * @param {Number} year The target year.
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getMonths(year, asObj = true) {
        let results = [];
        let sYear = (year) ? year.toString() + '-' : '';
        for(var i = 1; i <= 12; i++) {
            if (asObj) {
                let m = String(i);
                let mm = (m.length === 1) ? '0' + m : m;
                results.push({ id: i, text: sYear +  mm});
            }
            else results.push(i);
        }
        return results;
    };
    /**
     * Gets days array by specificed year and month.
     * 
     * @param {Number} year The target year.
     * @param {Number} month The target month.
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getDays(year, month, asObj = true) {
        let results = [];
        if (!year) return results;
        if (!month) return results;
        let sYear = year.toString() + '-';
        let m = String(month);
        let mm = (m.length === 1) ? '0' + m : m;
        let sMonth = mm + '-';
        let maxDays = new Date(year, month, 0).getDate();
        for(var i = 1; i <= maxDays; i++) {
            if (asObj) {
                let d = String(i);
                let dd = (d.length === 1) ? '0' + d : d;
                results.push({ id: i, text: sYear + sMonth + dd });
            }
            else results.push(i);
        }
        return results;
    };

    static get today() { 
        let dt = new Date();
        let y = String(dt.getFullYear());
        let m = String(dt.getMonth() + 1); // month is zero based.
        let d = String(dt.getDate());
        let yy = y;
        let mm = (m.length === 1) ? '0' + m : m;
        let dd = (d.length === 1) ? '0' + d : d;
        //console.log('y:', yy, 'm:', mm, 'd:', dd);
        let result = yy.toString() + '-';
        result = result + mm.toString() + '-'
        result = result + dd.toString();
        return result;
    }

    static get yesterday() { 
        let dt = new Date();  
        dt.setDate(d.getDate() - 1);
        let y = String(dt.getFullYear());
        let m = String(dt.getMonth() + 1); // month is zero based.
        let d = String(dt.getDate());
        let yy = y;
        let mm = (m.length === 1) ? '0' + m : m;
        let dd = (d.length === 1) ? '0' + d : d;
        //console.log('y:', yy, 'm:', mm, 'd:', dd);
        let result = yy.toString() + '-';
        result = result + mm.toString() + '-'
        result = result + dd.toString();
        return result;
    }
};

//#endregion

//#region NArray.CaseSensitiveDataSource

NArray.CaseSensitiveDataSource = class {
    constructor() {
        this._ds = null; 
        this._valueMember = '';
        this._caseSensitive = false;
        this._values = null;
    };
    // reset values array.
    refresh() {
        this._values = null;
    };
    // Gets array of all item's property value that match value member.
    // Note: all value in array will convert to string.
    get values() {
        if (!this._ds) {
            this.refresh(); // make sure value is null if source is null.
            return null; // datasource is null.
        }
        if (this._values && this._items) {
            // already create values map but seem size is difference
            // so reset the values map.
            if (this._values.length !== this._items.length) {
                this.refresh();
            }
        }
        // values map is not created so created only if required.
        if (!this._values) {
            let self = this;
            let pName = (this._valueMember) ? String(this._valueMember).trim() : '';
            this._values = this._ds.map(elem => {
                let sVal = (pName !== '') ? String(elem[pName]) : String(elem);
                let result = sVal.trim();
                return (self._caseSensitive) ? result : result.toLowerCase();
            });
        }
        return this._values;
    };
    indexOf(search) {
        let map = this.values;
        if (!map || !search) return -1;
        let sSch = String(search).trim();
        let cSch = (self._caseSensitive) ? sSch : sSch.toLowerCase();
        return map.indexOf(cSch);
    };
    getitem(index) { 
        let ds = this._ds;
        return (ds && index >= 0 && index < ds.length) ? ds[index] : null;
    };
    get datasource() { return this._ds; }
    set datasource(value) {
        if (value && !(value instanceof Array)) {
            console.error('Assigned value must be array.');
            return;
        }
        this._ds = value;
        this.refresh(); // resets values map.
    }
    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
            this.refresh(); // resets values map.
        }
    }
    get caseSensitive() { return this._caseSensitive; }
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
            this.refresh(); // resets values map.
        }
    }
};

//#endregion

//#region NArray.AutoFilterDataSource

NArray.AutoFilterDataSource = class {
    constructor() {
        this._ds = new NArray.CaseSensitiveDataSource();
        this._input = '';
        this._items = null;
        this._parts = null;
    };
    // reset filters array.
    refresh() { 
        this._items = null;
        this._parts = null;
    };
    get items() {
        if (!this._ds || !this._ds.datasource) {            
            this.refresh(); // make sure value is null if source is null.         
            return this._items; // no data source assigned.
        }
        if (!this._items) {
            let vals = this._ds.values;
            if (!vals) {
                // if some case cannot generate values array
                // so reset items to null;
                this.refresh();
            }
            else {
                let filter = (this.caseSensitive) ? this._input : this._input.toLowerCase();
                let matchs = vals.filter((elem) => {
                    // The elem is string and in case-sensitive or 
                    // case-insensitive that match user setting.
                    let idx = elem.indexOf(filter);
                    let result = (idx !== -1);
                    return result;
                });
                let results = [];
                let parts = [];
                let ds = this._ds;
                let pName = this._ds.valueMember;
                matchs.forEach(elem => {
                    // find index that match elem (string).
                    let idx = vals.indexOf(elem);
                    if (idx !== -1) {
                        // push active item to result.
                        let aItem = ds.getitem(idx);
                        results.push(aItem);
                        // get active value string.
                        let sVal = (pName) ? aItem[pName] : aItem;
                        // calculate each parts position.
                        let ipos = elem.indexOf(filter);
                        let pos = {
                            pos1: 0,
                            len1: ipos,
                            pos2: ipos,
                            len2: filter.length,
                            pos3: ipos + filter.length,
                            len3: elem.length - (ipos + filter.length)
                        };
                        // extract parts
                        let part = {
                            pre: sVal.substr(pos.pos1, pos.len1),
                            match: sVal.substr(pos.pos2, pos.len2),
                            post: sVal.substr(pos.pos3, pos.len3)
                        }
                        // append to output array.
                        parts.push(part);
                    }
                });
                // setup results to related variables.
                this._items = results;
                this._parts = parts;
            }
        }
        return this._items;
    }
    get parts() { return this._parts; }
    indexOf(search) {
        if (!this._ds) return null -1;
        return this._ds.indexOf(search);
    };
    getitem(index) {
        if (!this._ds) return null;
        let item = this._ds.getitem(index);
        return item;
    };
    get datasource() { return this._ds.datasource; }
    set datasource(value) {
        if (value && !(value instanceof Array)) {
            console.error('Assigned value must be array.');
            return;
        }
        this._ds.datasource = value;
        this.refresh(); // resets filter items.
    }
    get valueMember() { return this._ds.valueMember; }
    set valueMember(value) {
        if (this._ds.valueMember != value) {
            this._ds.valueMember = value;
            this.refresh(); // resets filter items.
        }
    }
    get caseSensitive() { return this._ds.caseSensitive; }
    set caseSensitive(value) {
        if (this._ds.caseSensitive != value) {
            this._ds.caseSensitive = value;
            this.refresh(); // resets filter items.
        }
    }
    get filter() { return this._input; }
    set filter(value) {
        if (this._input != value) {
            this._input = (value) ? String(value) : ''; // null not allow.
            this.refresh(); // resets filter items.
        }
    };
};

//#endregion

//#region NArray.MultiSelectDataSource

NArray.MultiSelectDataSource = class {
    constructor() {
        this._ds = null;
        this._idMember = '';
        this._valueMember = '';
        this._caseSensitive = false;
        this._selectedIds = [];
        this._selectedItems = null;
        this._currentItems = null;
    };
    // public methods.
    clearSelection() {
        if (!this._selectedIds) this._selectedIds = [];
        else this._selectedIds.splice(0);
        this._selectedItems = null;
        this._currentItems = null;
    };
    refresh() {
        // reset array for recalculate.
        this._selectedItems = null;
        this._currentItems = null;
        if (!this._ds) return;
    };
    indexOf(value) {
        let self = this;
        let ignoreCase = (this._caseSensitive) ? false : true;
        let sMember = (this._valueMember) ? this._valueMember.trim() : null;
        let isMember = (sMember && sMember.length > 0) ? true : false;
        let oValue = (value) ? String(value).trim() : null;
        let sValue = (oValue) ? oValue.toLowerCase() : null;
        if (!sValue) return -1;
        if (!this._ds) return -1;
        let getitem = (item) => {
            let oItem = (isMember) ? item[sMember] : item;
            return (ignoreCase) ? String(oItem).toLowerCase() : String(oItem);
        };
        let map = this._ds.map(item => {
            let sItem = getitem(item);
            return sItem;
        });
        return map.indexOf(sValue);
    };
    selectValue(value) {
        let idx = this.indexOf(value);
        if (idx === -1) return;
        let isIndex = (!this._idMember || this._idMember === '');
        if (isIndex)
            this.selectId(idx);
        else {
            let item = this._ds[idx];
            if (!item) return -1;
            let sId = String(item[this._idMember]);
            this.selectId(sId);
        }
    }
    unselectValue(value) {
        let idx = this.indexOf(value);
        if (idx === -1) return;
        let isIndex = (!this._idMember || this._idMember === '');
        if (isIndex)
            this.unselectId(idx);
        else {
            let item = this._ds[idx];
            if (!item) return -1;
            let sId = String(item[this._idMember]);
            this.unselectId(sId);
        }
    }
    selectId(id) {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let sId;        
        if (isIndex) sId = String(id); // force to string.
        else sId = (id) ? String(id).trim().toLowerCase() : null;
        if (!sId) return;
        //console.log(sId);
        let idx = this._selectedIds.indexOf(sId);
        //console.log(idx);
        if (idx === -1) {
            this._selectedIds.push(sId);
            // reset array for recalculate.
            this._selectedItems = null;
            this._currentItems = null;
        }
    };
    unselectId(id) {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let sId;        
        if (isIndex) sId = String(id); // force to string.
        else sId = (id) ? String(id).trim().toLowerCase() : null;
        if (!sId) return;
        //console.log(sId);
        let idx = this._selectedIds.indexOf(sId);
        //console.log(idx);
        if (idx !== -1) {
            this._selectedIds.splice(idx, 1);
            // reset array for recalculate.
            this._selectedItems = null;
            this._currentItems = null;
        }
    };
    selectAll() {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let items = this.currentItems;
        if (!items || items.length <= 0) return;
        let pName = this._idMember;
        let sId;
        let self = this;
        items.forEach(item => {
            if (isIndex) sId = String(item)
            else sId = String(item[pName]);
            this.selectId(sId);
        });
    };
    // public properties.
    get datasource() {
        return this._ds;
    }
    set datasource(value) {
        this._ds = value;
        // Implement required: make sure the id member is same i.e. change language
        // the datasource should be changed but the id property of each item
        // should be same if not all exists selection must be clear.
        this.refresh(); // resets related items.
    }
    get idMember() { return this._idMember; }
    set idMember(value) {
        if (this._idMember != value) {
            this._idMember = value;
            this.clearSelection();
        }
    }
    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
            this.refresh(); // resets related items.
        }
    }
    get caseSensitive() { return this._caseSensitive; }
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
            this.refresh(); // resets related items.
        }
    }
    get selectedIds() { return this._selectedIds; }
    get selectedItems() {
        if (!this._selectedItems) {
            let idMember = (this._idMember) ? this._idMember.trim().toLowerCase() : null;
            let hasIdMember = (idMember && idMember.length > 0);
            let ids = this._selectedIds;
            if (this._ds) {
                let getitem = (item) => {
                    let oItem = (hasIdMember) ? item[idMember] : item;
                    return String(oItem).toLowerCase();
                };
                this._selectedItems = [];
                let oItems;
                ids.forEach(sId => {
                    if (hasIdMember) {
                        oItems = this._ds.filter((item) => {
                            let sItem = getitem(item);
                            return (sId === sItem);
                        });
                        if (oItems && oItems.length > 0) this._selectedItems.push(oItems[0]);
                    }
                    else {
                        let oItem = this._ds[sId];
                        this._selectedItems.push(oItem);
                    }
                });
            }
        }
        return this._selectedItems;
    }
    get currentItems() {
        if (!this._currentItems) {
            let idMember = (this._idMember) ? this._idMember.trim().toLowerCase() : null;
            let hasIdMember = (idMember && idMember.length > 0);            
            let ids = this._selectedIds;
            if (this._ds) {
                let items = this._ds;
                let map = this._ds.map((item) => {
                    let sVal = (hasIdMember) ? item[idMember] : item;
                    return String(sVal);
                });
                let results = [];
                if (hasIdMember) {
                    let index = 0;
                    map.forEach(id => {
                        let idx = ids.indexOf(id.toLowerCase());
                        if (idx === -1) {
                            // not in selection.
                            let item = items[index];
                            results.push(item);
                        }
                        index++;
                    });
                }
                else {
                    let index = 0;
                    map.forEach(item => {
                        let idx = ids.indexOf(String(index));
                        if (idx === -1) {
                            results.push(item);
                        }
                        index++;
                    });
                }
                this._currentItems = results;
            }
        }
        return this._currentItems;
    }
};

//#endregion

//#endregion

//#region NGui and related classes

//#region NGui

class NGui {};

//#endregion

//#region NGui.AutoFill and related classes

//#region NGui.AutoFill

NGui.AutoFill = class {
    constructor(elem, options) {
        this._dom = new NDOM(elem);
        this._gui = null;

        this._filterDS = new NArray.AutoFilterDataSource();
        this._filterDS.caseSensitive = false;        
        let opts = (options) ? options : {};

        this._onSelectItem = new EventHandler();
        this._onInputChanged = new EventHandler();

        this._onESC = new EventHandler();

        this.init(opts);
    };
    // private methods.
    init(options) {
        let dom = this._dom;
        dom.class.add('auto-fill'); // add auto-fill css class.
        // setup listeners.
        dom.event.add('click', this.click.bind(this));
        // create related gui elements.
        if (!this._gui) {
            let opt = options;
            // Create gui elements.
            let gui = {};
            gui.buttons = {};
            gui.buttons.left = new NGui.AutoFill.Buttons(this, this);
            gui.container = new NGui.AutoFill.Container(this, this);
            gui.buttons.right = new NGui.AutoFill.Buttons(this, this, { align: 'right' });

            if (opt.buttons) {
                opt.buttons.forEach(btn => {
                    if (btn.align && btn.align === 'left') {
                        gui.buttons.left.add(btn);
                    }
                    else {
                        gui.buttons.right.add(btn);
                    }
                });
            }

            gui.input = {};
            gui.input.hint = new NGui.AutoFill.Hint(this, gui.container);
            gui.input.filter = new NGui.AutoFill.Input(this, gui.container);
            gui.input.suggest = new NGui.AutoFill.Suggest(this, gui.container);

            gui.drop = {};
            gui.drop.panel = new NGui.AutoFill.DropPanel(this, gui.container);

            this._gui = gui;
        }
    };
    raiseOnSelectItem(item) {
        if (this._onSelectItem) this._onSelectItem.invoke(this,  { 'item': item });
    };
    raiseOnInputChanged(text) {
        if (this._onInputChanged) this._onInputChanged.invoke(this,  { 'text': text });
    };
    raiseOnESC() {
        if (this._onESC) this._onESC.invoke(this,  EventArgs.Empty);
    };
    // HTML Element Events
    click(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.focus();
        return false;
    };
    // public methods.
    focus() {
        if (!this._gui) return;
        if (!this._gui.input) return;
        if (!this._gui.input.filter) return;
        this._gui.input.filter.focus();
    };
    get isdroped() {
        if (!this._gui) return;
        if (!this._gui.drop) return;
        if (!this._gui.drop.panel) return;
        return this._gui.drop.panel.isdroped;
    }
    dropdown() {
        if (!this._gui) return;
        if (!this._gui.drop) return;
        if (!this._gui.drop.panel) return;
        //self.__checkRedirect();
        this._gui.drop.panel.dropdown();
    };
    close() {
        if (!this._gui) return;
        if (!this._gui.drop) return;
        if (!this._gui.drop.panel) return;
        this._gui.drop.panel.close();
    };
    refresh() { 
        // refresh drop panel.
        if (!this._gui) return;
        if (!this._gui.drop) return;
        if (!this._gui.drop.panel) return;
        this._gui.drop.panel.refresh();
    };
    selectItem(item) {
        if (!item) return;
        this.raiseOnSelectItem(item);
    };
    // public properties.
    // dom and HTMLElement access.
    get dom() { return this._dom; }
    get elem() { return (this._dom) ? this._dom.elem : null; }
    // get gui.
    get gui() { return this._gui; }
    get filter() {
        if (!this._gui) return undefined;
        if (!this._gui.input) return undefined;
        if (!this._gui.input.filter) return undefined;
        return this._gui.input.filter.text;
    }
    set filter(value) {
        if (!this._gui) return;
        if (!this._gui.input) return;
        if (!this._gui.input.filter) return;
        if (this._gui.input.filter.text != value) {
            this._gui.input.filter.text = value;
        }
    }
    get hint() {
        if (!this._gui) return undefined;
        if (!this._gui.input) return undefined;
        if (!this._gui.input.hint) return undefined;
        return this._gui.input.hint.text;
    }
    set hint(value) {
        if (!this._gui) return;
        if (!this._gui.input) return;
        if (!this._gui.input.hint) return;
        this._gui.input.hint.text = value;
    }
    // datasource related properties.
    get datasource() {
        if (!this._filterDS) return null;
        return this._filterDS.datasource;
    }
    set datasource(value) {
        if (!this._filterDS) return;
        this._filterDS.datasource = value;
        if (!this._gui) return;
        if (!this._gui.input) return;
        if (!this._gui.input.suggest) return;
        // clear suggest text.
        this._gui.input.suggest.text = '';
    }
    get valueMember() {
        if (!this._filterDS) return '';
        return this._filterDS.valueMember;
    }
    set valueMember(value) {
        if (!this._filterDS) return;
        if (this._filterDS.valueMember != value) {
            this._filterDS.valueMember = value;
        }
    }
    get caseSensitive() { 
        if (!this._filterDS) return false;        
        return this._filterDS.caseSensitive; 
    }
    set caseSensitive(value) {
        if (!this._filterDS) return;
        if (this._filterDS.caseSensitive != value) {
            this._filterDS.caseSensitive = value;
        }
    }
    get currentItems() {
        if (!this._filterDS) return null;
        if (this._filterDS.filter != this.filter) {
            this._filterDS.filter = this.filter;
        }
        return this._filterDS.items;
    }
    get currentParts() {
        if (!this._filterDS) return null;
        return this._filterDS.parts;
    }
    // public event
    get onSelectItem() { return this._onSelectItem; }
    get onInputChanged() { return this._onInputChanged; }
    get onESC() { return this._onESC; }
};

//#endregion

//#region NGui.AutoFill.Element (base class)

NGui.AutoFill.Element = class {
    constructor(autofill, parent, options) {
        this._autofill = autofill;
        this._parent = parent;
        this._options = options;
        this._dom = this.create(options);
    };
    // virtual methods.
    create() { return null; };
    // get the autofill instance.
    get autofill() { return this._autofill; }
    // get root/parent dom.
    get root() { return this._autofill; }
    get parent() { return this._parent; }
    // get options
    get options() { return this._options; }
    // get gui.
    get gui() { return (this._autofill) ? this._autofill.gui : null; }
    get dom() { return this._dom; }
};

//#endregion

//#region NGui.AutoFill.Buttons

NGui.AutoFill.Buttons = class extends NGui.AutoFill.Element {
    // override methods.
    create() {        
        this._buttons = [];
        if (!this.parent || !this.parent.dom) return null;
        let opts = this.options;
        let parent = this.parent.dom;
        // create new element.
        let dom = NDOM.create('div');
        // set css class.
        dom.class.add('auto-fill-buttons');
        // set align class.
        let sAlign = (!opts || !opts.align) ? 'left' : opts.align.trim().toLowerCase();
        if (sAlign !== 'left') dom.class.add('right'); // right align.
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // public methods.
    add(opt) {
        if (!opt) return;
        // create child element.
        let btn = new NGui.AutoFill.Button(this.autofill, this, opt);
        this._buttons.push(btn);
    };
    // public properties
    get buttons() { return this._buttons; }
};

//#endregion

//#region NGui.AutoFill.Button

NGui.AutoFill.Button = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        if (!this.parent || !this.parent.dom) return null;
        let opt = options;
        let parent = this.parent.dom;
        this._name = (opt) ? opt.name : null;
        // create new element.
        let dom = NDOM.create('span');
        // set css class.
        dom.class.add('auto-fill-button');
        // set css optional class.
        let classList = (opt && opt.css && opt.css.class) ? opt.css.class.split(' ') : [];
        classList.forEach(css => dom.class.add(css));
        // setup listeners.
        dom.event.add('click', this.click.bind(this));
        // set tooltip child element.
        let sTooltip = (opt) ? opt.tooltip : null;        
        if (sTooltip && sTooltip.trim().length > 0) {
            // has tooltip so add tooltip class
            dom.class.add('ntooltip');
            // create popup tooltip element.
            let tooltip = NDOM.create('span');
            tooltip.class.add('ntooltiptext');
            // set text.
            tooltip.text = sTooltip;
            // add to button (span) element.
            dom.addChild(tooltip);
        }
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // HTML Element Events
    click(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.options && this.options.click) {
            this.options.click(evt, this.autofill, this);
        }
        return false;
    };
    // public properties
    get name() { return this._name; }
};
//#endregion

//#region NGui.AutoFill.Container

NGui.AutoFill.Container = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        if (!this.parent || !this.parent.dom) return null;
        let parent = this.parent.dom;
        let dom = NDOM.create('div');
        // set css class.
        dom.class.add('auto-fill-container');
        // setup listeners.
        dom.event.add('click', this.click.bind(this));
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // HTML Element Events
    click(evt) {
        if (!this.autofill) return;
        evt.preventDefault();
        evt.stopPropagation();
        this.autofill.focus();
        return false;
    };
};

//#endregion

//#region NGui.AutoFill.Hint

NGui.AutoFill.Hint = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        if (!this.parent || !this.parent.dom) return null;
        let parent = this.parent.dom;
        let dom = NDOM.create('span');
        // set css class.
        dom.class.add('hint-text');
        dom.style('display', 'none'); // set default style to hide.
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    refresh() {
        if (!this.dom || !this.dom.elem) return;
        // check empty or undefined or null.
        if (!this.dom.text) {
            this.dom.style('display', 'none');
        }
        else this.dom.style('display', 'inline-block');
    };
    get text() {
        if (!this.dom || !this.dom.elem) return null;
        return this.dom.text;
    }
    set text(value) {
        if (!this.dom || !this.dom.elem) return;
        if (this.dom.text != value) {
            this.dom.text = value;
        }
        this.refresh();
    }
};

//#endregion

//#region NGui.AutoFill.Input

NGui.AutoFill.Input = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        this._current = null; // init the current text variable.
        if (!this.parent || !this.parent.dom) return null;
        let parent = this.parent.dom;
        let dom = NDOM.create('span');
        // set attribute.
        dom.attr('contenteditable', 'true');
        // set css class.
        dom.class.add('input-text');
        // setup listeners.
        dom.event.add('focus', this.gotfocus.bind(this));
        dom.event.add('blur', this.lostfocus.bind(this));
        dom.event.add('input', this.input.bind(this));
        dom.event.add('keydown', this.keydown.bind(this));
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // private methods.
    setEndOfContenteditable(contentEditableElem) {
        if (!contentEditableElem) return;
        var range, sel;
        if (document.createRange) {
            range = document.createRange();
            range.selectNodeContents(contentEditableElem);
            range.collapse(false);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(contentEditableElem);
            range.collapse(false);
            range.select();
        }
    };
    syncupdate(raiseInputEvent = false) {
        let autofill = this.autofill;
        if (!autofill) return;
        if (!autofill.gui) return;
        if (!autofill.gui.drop) return;
        if (!autofill.gui.drop.panel) return;
        let val = this.dom.text;
        if (this._current != val) {
            this._current = val; // update last value.
            autofill.gui.drop.panel.refresh();
            if (raiseInputEvent) {
                // raise event.
                autofill.raiseOnInputChanged(this._current);
            }
        }
    };
    updateSuggestion() {
        if (!this.autofill) return;
        if (!this.autofill.gui) return;
        if (!this.autofill.gui.input) return;
        if (!this.autofill.gui.input.filter) return;
        if (!this.autofill.gui.input.suggest) return;

        let input = this.autofill.gui.input.filter;
        let suggest = this.autofill.gui.input.suggest;

        let curritems = this.autofill.currentItems;
        if (!curritems) {
            suggest.text = '';
            return;
        }
        if (!curritems.length < 0) {
            suggest.text = '';
            return;
        }
        if (!curritems[0]) {
            suggest.text = '';
            return;
        }
        let fItem = curritems[0];
        let valMember = this.autofill.valueMember;
        let caseSensitive = this.autofill.caseSensitive;

        if (input.text === '') {
            suggest.text = '';
            return;
        }

        let ipt = input.text;
        let text = (valMember) ? String(fItem[valMember]) : String(fItem);
        let bFound = false;

        //freakin NO-BREAK SPACE needs extra care
        if (caseSensitive) {
            bFound = (text && text.indexOf(ipt) === 0);
        }
        else {
            bFound = (text && text.toLowerCase().indexOf(ipt.toLowerCase()) === 0);
        }
        if (bFound) {
            let suggestText = text.substr(ipt.length, text.length);
            suggest.text = suggestText;
        }
        else {
            suggest.text = '';
        }
    };
    // HTML Element Events
    gotfocus(evt) {
        if (!this.autofill) return;
        evt.preventDefault();
        evt.stopPropagation();
        this.autofill.dropdown();
        return false;
    };
    lostfocus(evt) {
        if (!this.autofill) return;
        evt.preventDefault();
        evt.stopPropagation();
        this.autofill.close();
        let self = this;        
        if (self.autofill && self.autofill.dom) {
            let root = self.autofill.dom;
            root.class.remove('focused');
        }
        
        return false;
    };
    input(evt) {
        if (!this.autofill) return;
        let autofill = this.autofill;
        if (!autofill.isdroped) autofill.dropdown();
        this.updateSuggestion();
        this.syncupdate(true);
    };
    keydown(evt) {
        let afill = this.autofill;
        switch (evt.key) {
            case 'Enter':
                evt.preventDefault();
                evt.stopPropagation();
                let items = afill.currentItems;
                if (items && items.length > 0) {
                    let item = items[0];
                    if (item) {
                        if (!afill.gui.input) return;
                        if (!afill.gui.input.filter) return;
                        if (!afill.gui.input.suggest) return;
                        let input = afill.gui.input.filter;
                        let suggest = afill.gui.input.suggest;
                        // in some case like nested selection (year->month-date)
                        // required to clear exists input and suggestion text
                        // before call selectItem method to raise select item event.                        
                        input.text = '';
                        suggest.text = '';
                        afill.selectItem(item);
                    }
                }
                break;
            case 'Escape':
            case '?':
            case '@':
                evt.preventDefault();
                evt.stopPropagation();
                afill.raiseOnESC();
                break;
            case 'ArrowUp':
                evt.preventDefault();
                evt.stopPropagation();
                break;
            case 'ArrowDown':
                evt.preventDefault();
                evt.stopPropagation();
                break;
            default:
                //console.log(evt);
                break;
        };
    };
    // public methods
    focus() {
        if (!this.dom || !this.dom.elem) return;
        this.setEndOfContenteditable(this.dom.elem);
        let self = this;        
        setTimeout(function () {
            if (self.autofill && self.autofill.dom) {
                let root = self.autofill.dom;
                root.class.add('focused');
            }
            self.dom.focus();
        }, 0);
    };
    get text() {
        if (!this.dom || !this.dom.elem) return null;
        return this.dom.text;
    }
    set text(value) {
        if (!this.dom || !this.dom.elem) return;
        if (this.dom.text != value) {
            this.dom.text = value;
            // move selection to last character.
            this.setEndOfContenteditable(this.dom.elem);
            this.syncupdate();
        }        
    }
};

//#endregion

//#region NGui.AutoFill.Suggest

NGui.AutoFill.Suggest = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        if (!this.parent || !this.parent.dom) return null;
        let parent = this.parent.dom;
        let dom = NDOM.create('span');
        // set css class.
        dom.class.add('suggest-text');
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    get text() {
        if (!this.dom || !this.dom.elem) return null;
        return this.dom.text;
    }
    set text(value) {
        if (!this.dom || !this.dom.elem) return;
        if (this.dom.text != value) {
            this.dom.text = value;
        }        
    }
};

//#endregion

//#region NGui.AutoFill.DropPanel

NGui.AutoFill.DropPanel = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        this._items = [];
        if (!this.parent || !this.parent.dom) return null;
        let parent = this.parent.dom;
        let dom = NDOM.create('div');
        // set css class.
        dom.class.add('drop-panel');
        dom.class.add('hide');
        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // public methods.
    get isdroped() {
        if (!this.dom) return false;
        let isHide = this.dom.class.has('hide');
        return !isHide;
    };
    dropdown() {
        if (!this.dom) return;
        let dom = this.dom;
        dom.class.remove('hide');

        if (!this.autofill || !this.autofill.gui) return null;
        if (!this.autofill.gui.buttons) return;
        if (!this.autofill.gui.buttons.left) return;
        if (!this.autofill.gui.buttons.left.dom) return;
        if (!this.autofill.gui.buttons.right) return;
        if (!this.autofill.gui.buttons.right.dom) return;
        let lfdom = this.autofill.gui.buttons.left.dom;
        let rtdom = this.autofill.gui.buttons.right.dom;
        // recalc position.
        let left = -lfdom.offsetWidth - 9;
        let right = rtdom.offsetWidth - 4;
        // update position.
        dom.style('left', left + 'px');
        dom.style('right', right + 'px');
        //dom.style('top', top + 'px');
        this.refresh();
    };
    clear() {
        this.dom.clearChildren();
        this._items.splice(0);
    };
    refresh() {
        this.clear();
        if (!this.autofill || !this.autofill.datasource) return;
        let items = this.autofill.currentItems;
        let parts = this.autofill.currentParts;
        if (items && items.length > 0) {
            let self = this;
            let idx = 0;
            items.forEach(item => {
                let afItem = new NGui.AutoFill.AutoFillItem(self.autofill, self, {
                    index: idx,
                    item: item,
                    part: parts[idx]
                })
                if (idx === 0) afItem.selected();
                this._items.push(afItem);
                idx++;
            });
        };
    };
    close() {
        if (!this.dom) return;
        this.dom.class.add('hide');
    };
    // public properties
    get items() { return this._items; }
}

//#endregion

//#region NGui.AutoFill.AutoFillItem

NGui.AutoFill.AutoFillItem = class extends NGui.AutoFill.Element {
    // override methods.
    create(options) {
        this._item = null;
        this._selected = false;
        if (!this.autofill || !this.autofill.datasource) return;
        if (!this.parent || !this.parent.dom) return null;
        if (!options || !options.item || !options.part) return;
        if (!this.gui || !this.gui.input) return;
        if (!this.gui.input.filter || !this.gui.input.filter.dom) return;
        let parent = this.parent.dom;

        let item = options.item;
        let part = options.part;

        this._item = item; // assigned item.

        let dom = NDOM.create('div');
        // set css class.
        dom.class.add('auto-fill-item');
        dom.attr('href', 'javascript:;');
        
        let preSpan = NDOM.create('span');
        preSpan.text = part.pre;
        dom.addChild(preSpan);

        let inputBold = NDOM.create('b');
        inputBold.text = part.match;
        dom.addChild(inputBold);

        let postSpan = NDOM.create('span');
        postSpan.text = part.post;
        dom.addChild(postSpan);
        
        // setup listeners.
        let self = this;
        dom.event.add('mousedown', self.mousedown.bind({
            self: self,
            target: dom.elem,
            item: item
        }));
        dom.event.add('mouseup', self.mouseup.bind({
            self: self,
            target: dom.elem,
            item: item
        }));

        // add to parent element.
        parent.addChild(dom);

        return dom;
    };
    // HTML Element Events
    mousedown(evt) {
        //let pObj = this;
        //console.log('mouse down:', pObj);
        evt.preventDefault();
    };
    mouseup(evt) {
        //let pObj = this;
        //console.log('mouse up:', pObj);
        evt.preventDefault();
        evt.stopPropagation();
        let item = this.item;
        let self = this.self;        
        self.autofill.selectItem(item);
    };
    // public methods.
    selected() {
        if (!this.dom) return;
        this.dom.class.add('selected');
        this._selected = true;
    }
    // public properties.
    get item() { return this._item; }
}

//#endregion

//#endregion

//#region NGui.TagBox and related classes

//#region NGui.TagBox

NGui.TagBox = class {
    constructor(elem) {
        this._dom = new NDOM(elem);

        this._caption = 'Category';
        this._itemSeparator = '';
        this._valueMember = '';
        this._items = null;

        this._clearItems = new EventHandler();
        this._removeItem = new EventHandler();

        this.init();
    };
    // private methods.
    init() {
        let dom = this._dom;
        dom.class.add('tag-box'); // add tag-box css class.
        // set left column
        this._captionDOM = new NGui.TagBox.Caption(this);
        let capdom = this._captionDOM;
        capdom.text = this._caption;
        // append to parent.
        dom.addChild(capdom);
        this._itemsDOM = new NGui.TagBox.Items(this);
        let itemsdom = this._itemsDOM;
        // append to parent.
        dom.addChild(itemsdom);
        this.refresh();
    };
    raiseClearItems() {
        if (this._clearItems) this._clearItems.invoke(this, EventArgs.Empty);
    }
    raiseRemoveItem(item) {
        if (this._removeItem) this._removeItem.invoke(item, EventArgs.Empty);
    }
    // public methods.
    refresh() {
        let dom = this._dom;
        if (!dom) return;
        let hasItems = (this._items && this._items.length > 0) ? true : false;
        
        if (hasItems === false) {
            dom.class.add('hide');
        }
        else dom.class.remove('hide');

        if (this._captionDOM) this._captionDOM.text = this._caption;

        if (!this._itemsDOM) return;
        this._itemsDOM.refresh();
    };
    // public properties.
    // dom and HTMLElement access.
    get dom() { return this._dom; }
    get elem() { return (this._dom) ? this._dom.elem : null; }
    // gets or sets caption.
    get caption() { return this._caption; }
    set caption(value) {
        if (this._caption != value) {
            this._caption = value;
            this.refresh(); // resets related items.
        }
    }
    // gets or sets item separator.
    get itemSeparator() { return this._itemSeparator; }
    set itemSeparator(value) {
        if (this._itemSeparator != value) {
            this._itemSeparator = value;
            this.refresh(); // resets related items.
        }
    }
    // gets or sets value member.
    // gets or sets value member.
    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
            this.refresh(); // resets related items.
        }
    }
    // gets or sets items.
    get items() { return this._items; }
    set items(value) {
        this._items = value;
        this.refresh();
    }
    // public events
    get clearItems() { return this._clearItems; }
    get removeItem() { return this._removeItem; }
};

//#endregion

//#region NGui.TagBox.Caption

NGui.TagBox.Caption = class {
    constructor(tagbox) {
        this._tagbox = tagbox;
        this._dom = null;
        this._textdom = null;
        this.init();
    };
    // private methods.
    init() {
        this._dom = NDOM.create('div');
        let dom = this._dom;
        dom.class.add('tag-left-col'); // add tag-caption css class.
        // add span for close and span for text.
        let cleardom = NDOM.create('span');
        cleardom.class.add('tag-clear');
        cleardom.event.add('click', this.clearClick.bind(this));
        // append to dom.
        dom.addChild(cleardom);

        let textdom = NDOM.create('span');
        textdom.class.add('tag-caption');
        this._textdom = textdom;
        textdom.text = this._text;
        // append to dom.
        dom.addChild(textdom);
    };
    // DOM Event Handler.
    clearClick(evt) {
        let self = this;
        evt.preventDefault();
        evt.stopPropagation();
        let tagbox = self.tagbox;
        if (!tagbox) return;
        tagbox.raiseClearItems(self._item);
    };
    // public properties.
    // dom and HTMLElement access.
    get dom() { return this._dom; }
    get elem() { return (this._dom) ? this._dom.elem : null; }
    // TagBox element access.
    get tagbox() { return this._tagbox; }
    get text() { return (this._textdom) ? this._textdom.text : null; }
    set text(value) {
        if (!this._textdom) return;
        if (this._textdom.text !== value) {
            this._textdom.text = value;
        }
    }
};

//#endregion

//#region NGui.TagBox.Items

NGui.TagBox.Items = class {
    constructor(tagbox) {
        this._tagbox = tagbox;
        this._dom = null;
        this.init();
    };
    // private methods.
    init() {
        this._dom = NDOM.create('div');
        let dom = this._dom;
        dom.class.add('tag-right-col');
    };
    // public methods.
    refresh() {
        if (!this.tagbox) return;
        let dom = this._dom;
        if (!dom) return;
        dom.clearChildren();

        let items = this.tagbox.items;
        let pName = this.tagbox.valueMember;
        let hasMember = (pName && pName.length > 0) ? true : false;
        if (!items) return;
        let self = this;
        let itemdom = null;
        let hasSeperator = (this.tagbox.itemSeparator) ? true : false;
        let iCnt = 0, iMax = (items) ? items.length : 0;
        items.forEach(item => {            
            itemdom = new NGui.TagBox.Item(self, item);
            itemdom.text = (hasMember) ? String(item[pName]) : String(item);
            if (hasSeperator && (iCnt + 1 !== iMax)) {
                let sepdom = NDOM.create('span');
                sepdom.class.add('tag-seperator');
                sepdom.text = this.tagbox.itemSeparator;
                dom.addChild(sepdom);
            }
            ++iCnt;
        });
    };
    // public properties.
    // dom and HTMLElement access.
    get dom() { return this._dom; }
    get elem() { return (this._dom) ? this._dom.elem : null; }
    // TagBox element access.
    get tagbox() { return this._tagbox; }
};

//#endregion

//#region NGui.TagBox.Item

NGui.TagBox.Item = class {
    constructor(itemsDom, item) {
        this._itemsDom = itemsDom;
        this._item = item;
        this._dom = null;
        this._textdom = null;
        this._closedom = null;
        this.init();
    };
    // private methods.
    init() {
        if (!this._itemsDom || !this._itemsDom.dom) return;
        let itemsDom = this._itemsDom.dom;

        this._dom = NDOM.create('span');
        let dom = this._dom;
        dom.class.add('tag-item'); // tag-item css class.

        let textdom = NDOM.create('span');
        textdom.class.add('tag-text');
        this._textdom = textdom;
        dom.addChild(textdom);

        let closedom = NDOM.create('span');
        closedom.class.add('tag-close');
        closedom.event.add('click', this.closeClick.bind(this));
        this._closedom = closedom;
        dom.addChild(closedom);
        // add to parent container.
        itemsDom.addChild(dom);
    };
    // DOM Event Handler
    closeClick(evt) {
        let self = this;
        evt.preventDefault();
        evt.stopPropagation();
        let tagbox = self.tagbox;
        if (!tagbox) return;
        if (!self._item) return;
        tagbox.raiseRemoveItem(self._item);
    };
    // public properties.
    // dom and HTMLElement access.
    get dom() { return this._dom; }
    get elem() { return (this._dom) ? this._dom.elem : null; }
    // TagBox element access.
    get tagbox() { return (this._itemsDom) ? this._itemsDom.tagbox : null; }
    get text() { return (this._textdom) ? this._textdom.text : null }
    set text(value) {
        if (!this._textdom) return;
        if (this._textdom.text !== value) {
            this._textdom.text = value;
        }
    }
    get item() { return this._item; }
};

//#endregion

//#endregion

//#endregion
