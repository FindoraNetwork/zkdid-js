"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContentByKey = exports.getContentByKey = void 0;
const types_1 = require("../types");
class MemoryStorage {
    constructor() {
        this._data = {};
    }
    /** Returns the number of key/value pairs. */
    get length() {
        return Object.keys(this._data).length;
    }
    /**
     * Removes all key/value pairs, if there are any.
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    clear() {
        for (const key in this._data) {
            delete this._data[key];
        }
    }
    /** Returns the current value associated with the given key, or null if the given key does not exist. */
    getItem(key) {
        if (key in this._data)
            return this._data[key];
        return null;
    }
    /** Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. */
    key(index) {
        const keys = Object.keys(this._data);
        if (index >= keys.length)
            return null;
        return this.getItem(keys[index]);
    }
    /**
     * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    removeItem(key) {
        delete this._data[key];
    }
    /**
     * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
     *
     * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
     *
     * Dispatches a storage event on Window objects holding an equivalent Storage object.
     */
    setItem(key, value) {
        this._data[key] = value;
    }
}
const storage = typeof window === 'undefined' ? new MemoryStorage() : window.localStorage;
const getContentByKey = (eCacheType, key) => {
    const res = storage.getItem(`${eCacheType}:${key}`);
    if (res === null)
        return null;
    return JSON.parse(res);
};
exports.getContentByKey = getContentByKey;
const setContentByKey = (eCacheType, key, data) => {
    return storage.setItem(`${eCacheType}:${key}`, JSON.stringify(data));
};
exports.setContentByKey = setContentByKey;
