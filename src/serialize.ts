const serialize = require('serialize-javascript');

/**
 * Checks if `x` is a class
 * @param {any} x
 * @returns {boolean}
 */
export function isClass(x: any) {
  return (
    !Array.isArray(x) &&
    !x?.hasOwnProperty('arguments') &&
    typeof x === 'object' &&
    x !== null
    // x?.hasOwnProperty('IS_CLASS')
  );
}

/**
 * Transforms a class into a plain object
 * @param { object } classInstance
 * @returns { object }
 */
function classToObj(classInstance: object): object {
  const res = {};

  /* eslint guard-for-in: */
  for (const i in classInstance) {
    // @ts-ignore
    if (isClass(classInstance[i])) {
      // @ts-ignore
      res[i] = classToObj(classInstance[i]);
      continue;
    }

    // @ts-ignore
    res[i] = classInstance[i];
  }

  return res;
}

/**
 * Serializes an object to a string, complete with functions
 * @param {object} obj
 * @returns {string}
 */
export function serializeObj(obj: object) {
  return serialize(classToObj(obj)).replace(/[\r\n]+/g, '');
}
