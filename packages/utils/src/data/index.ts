// data utils

/**
 * getValidValue function. Returns fallback value if value arg is falsy or undefined, otherwise applies format function.
 * @param value - The value to check.
 * @param format - The function to format the value if it's valid.
 * @param fallback - The fallback value to return if value is falsy or undefined.
 * @returns The formatted value or fallback.
 */

export function getValidValue<ReturnType = string>(
  value: any,
  format?: (value: any) => ReturnType,
  fallback?: ReturnType
): ReturnType {
  if (value === undefined || value === null || value === '' || value === false) {
    return fallback !== undefined ? fallback : ('-' as ReturnType);
  }

  if (Array.isArray(value) && value.length === 0) {
    return fallback !== undefined ? fallback : ('-' as ReturnType);
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return fallback !== undefined ? fallback : ('-' as ReturnType);
  }

  if (format) {
    return format(value);
  }

  return value as ReturnType;
}
