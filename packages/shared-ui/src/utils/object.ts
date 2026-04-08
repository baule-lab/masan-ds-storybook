import { isEmpty } from './is';

/**
 * standardize object to remove undefined, null, empty string, empty array, empty object values
 * Recursively processes nested objects and arrays
 * @param obj - the object to standardize
 * @returns the standardized object
 * @example
 * standardizeObject({ a: 1, b: undefined, c: '', d: [], e: {} }) // { a: 1 }
 * standardizeObject({ a: 1, b: { c: 2, d: undefined }, e: { f: {} } }) // { a: 1, b: { c: 2 } }
 */
export function standardizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // If it's a plain object (not array, not Date, not null), recurse
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      const nested = standardizeObject(value as Record<string, unknown>);
      if (!isEmpty(nested)) {
        result[key] = nested;
      }
    }
    // If it's an array, process each item recursively
    else if (Array.isArray(value)) {
      const processed = value
        .map((item) =>
          item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date)
            ? standardizeObject(item)
            : item
        )
        .filter((item) => !isEmpty(item));

      if (processed.length > 0) {
        result[key] = processed;
      }
    }
    // For primitives and other values
    else if (!isEmpty(value)) {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Trim all string values in an object recursively
 * Processes nested objects and arrays
 * @param obj - the object to trim
 * @returns the object with all string values trimmed
 * @example
 * trimObject({ a: '  hello  ', b: 'world  ' }) // { a: 'hello', b: 'world' }
 * trimObject({ a: { b: '  nested  ' }, c: ['  item  '] }) // { a: { b: 'nested' }, c: ['item'] }
 */
export function trimObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = value.trim();
    }
    // If it's a plain object (not array, not Date, not null), recurse
    else if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = trimObject(value as Record<string, unknown>);
    }
    // If it's an array, process each item recursively
    else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }
        if (item && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date)) {
          return trimObject(item);
        }
        return item;
      });
    }
    // For other values (numbers, booleans, dates, etc.)
    else {
      result[key] = value;
    }
  }

  return result as T;
}
