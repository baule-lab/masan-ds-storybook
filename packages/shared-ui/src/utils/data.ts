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
