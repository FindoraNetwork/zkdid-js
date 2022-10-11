class MemoryStorage extends Storage {
  /** Returns the number of key/value pairs. */
  get length() {
    return Object.keys(this._data).length;
  }

  private _data: Record<string, string> = {};
  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  clear(): void {
    for (const key in this._data) {
      delete this._data[key];
    }
  }
  /** Returns the current value associated with the given key, or null if the given key does not exist. */
  getItem(key: string): string | null {
    if (key in this._data) return this._data[key];
    return null;
  }
  /** Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. */
  key(index: number): string | null {
    const keys = Object.keys(this._data);
    if (index >= keys.length) return null;
    return this.getItem(keys[index]);
  }
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  removeItem(key: string): void {
    delete this._data[key];
  }
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  setItem(key: string, value: string): void {
    this._data[key] = value;
  }
}

const storage = globalThis === window ? localStorage : new MemoryStorage();

interface CacheDataType {
  [CacheType.DID]: DID;
  [CacheType.CIRCUIT]: CircuitObj;
  [CacheType.CIRCUIT_FAMILY]: boolean;
  [CacheType.ZKCredential]: string;
}

export const getContentByKey = <T extends CacheType>(cacheType: T, key: string) => {
  const res = storage.getItem(`${cacheType}:${key}`);
  if (res === null) return null;
  return JSON.parse(res) as CacheDataType[T];
};

export const setContentByKey = <T extends CacheType>(cacheType: T, key: string, data: CacheDataType[T]) => {
  return storage.setItem(`${cacheType}:${key}`, JSON.stringify(data));
};
