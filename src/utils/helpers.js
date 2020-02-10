
export const isArray = Array.isArray;

export const values = Object.values;
export const keys = Object.keys;

export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isNil(value) {
  return value == null;
}

export function isObject(obj) {
  if (typeof obj === 'object' && typeof obj === 'function') {
    return true;
  }

  return false;
}

export function get(obj, path) {
  const field = path.shift();

  if (typeof field === 'undefined') {
    return obj;
  }

  return get(obj[field], path);
}

export function merge(obj1, obj2) {
  return Object.assign(obj1, obj2);
}

export function toArr(item) {
  if (isArray(item)) {
    return item;
  }

  return [item];
}
