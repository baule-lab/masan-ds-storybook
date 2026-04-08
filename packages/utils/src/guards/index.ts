/**
 * Collection of "is" type guard functions.
 */

import { removeVietnameseAccents } from '../string';

// ==========================================
// 1. Primitive Checks
// ==========================================

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const isNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !isNaN(val);
};

export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === 'boolean';
};

export const isSymbol = (val: unknown): val is symbol => {
  return typeof val === 'symbol';
};

// ==========================================
// 2. Null & Undefined Checks
// ==========================================

export const isUndefined = (val: unknown): val is undefined => {
  return val === undefined;
};

export const isNull = (val: unknown): val is null => {
  return val === null;
};

/**
 * Checks if value is null or undefined
 */
export const isNil = (val: unknown): val is null | undefined => {
  return val === null || val === undefined;
};

/**
 * Checks if value is NOT null or undefined
 */
export const isDefined = <T>(val: T | undefined | null): val is T => {
  return val !== null && val !== undefined;
};

// ==========================================
// 3. Structural Checks (Objects & Arrays)
// ==========================================

export const isArray = <T = any>(val: unknown): val is T[] => {
  return Array.isArray(val);
};

/**
 * Checks if value is an object (excludes null)
 * Note: Arrays and Dates are technically objects in JS.
 */
export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object';
};

/**
 * Checks if value is a plain JavaScript object (POJO)
 * e.g. {} or new Object()
 */
export const isPlainObject = (val: unknown): val is Record<string, any> => {
  if (Object.prototype.toString.call(val) !== '[object Object]') {
    return false;
  }
  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
};

export const isFunction = (val: unknown): val is (...args: any[]) => any => {
  return typeof val === 'function';
};

// ==========================================
// 4. Specific Instance Checks
// ==========================================

export const isDate = (val: unknown): val is Date => {
  return Object.prototype.toString.call(val) === '[object Date]' && !isNaN((val as Date).getTime());
};

export const isRegExp = (val: unknown): val is RegExp => {
  return Object.prototype.toString.call(val) === '[object RegExp]';
};

export const isError = (val: unknown): val is Error => {
  return val instanceof Error;
};

export const isPromise = <T = unknown>(val: unknown): val is Promise<T> => {
  return (
    !!val &&
    (typeof val === 'object' || typeof val === 'function') &&
    typeof (val as any).then === 'function'
  );
};

// ==========================================
// 5. Utility / State Checks
// ==========================================

/**
 * Checks if the value is empty.
 * Returns true for: undefined, null, "", [], {}
 */
export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'boolean') return false;
  if (typeof val === 'number') return false;
  if (typeof val === 'string') return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
};

/**
 * Check if code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
};

/**
 * Check if the string is valid JSON
 */
export const isJSON = (str: string): boolean => {
  try {
    const obj = JSON.parse(str);
    return !!obj && typeof obj === 'object';
  } catch (e) {
    return false;
  }
};

// ==========================================
// 6. Comparison Utilities
// ==========================================

/**
 * Command filter comparison function for case-insensitive search
 * Used in Command components to filter options based on search input
 *
 * @param value - The value to search in
 * @param search - The user search query
 * @param keywords - Additional keywords to include in search
 * @returns 1 if match found, 0 otherwise
 */
export const compareSearching = (
  value: string | number | null | undefined,
  search: string | null | undefined,
  keywords?: string[]
): number => {
  const extendValue = removeVietnameseAccents(
    `${value} ${keywords?.join(' ') || ''}`
  ).toLowerCase();
  if (extendValue.includes(removeVietnameseAccents(search?.trim() || '').toLowerCase())) return 1;
  return 0;
};
