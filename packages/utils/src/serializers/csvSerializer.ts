/**
 * Centralized CSV (Comma-Separated Values) param serialization/deserialization utilities.
 * Used by service layer for API communication.
 *
 * @module params/csvSerializer
 */

export const CSV_SEPARATOR = ',';

/**
 * Configuration for CSV serialization
 */
export interface CsvSerializerConfig {
  separator?: string;
  trimValues?: boolean;
  filterEmpty?: boolean;
}

const defaultConfig: Required<CsvSerializerConfig> = {
  separator: CSV_SEPARATOR,
  trimValues: true,
  filterEmpty: true,
};

/**
 * Serialize array to comma-separated string for API params.
 * Returns undefined if array is empty (to exclude from query params).
 *
 * @example
 * toCSV(['a', 'b', 'c']) // 'a,b,c'
 * toCSV([1, 2, 3])       // '1,2,3'
 * toCSV([])              // undefined
 * toCSV(undefined)       // undefined
 */
export function toCSV<T extends string | number>(
  arr: T[] | undefined | null,
  config?: CsvSerializerConfig
): string | undefined {
  if (!arr || arr.length === 0) return undefined;

  const { separator, trimValues, filterEmpty } = { ...defaultConfig, ...config };

  let result = arr.map(String);

  if (trimValues) {
    result = result.map((s) => s.trim());
  }

  if (filterEmpty) {
    result = result.filter((s) => s.length > 0);
  }

  return result.length > 0 ? result.join(separator) : undefined;
}

/**
 * Deserialize comma-separated string to array.
 * Returns empty array if input is empty/undefined.
 *
 * @example
 * fromCSV('a,b,c')     // ['a', 'b', 'c']
 * fromCSV('1,2,3')     // ['1', '2', '3']
 * fromCSV('')          // []
 * fromCSV(undefined)   // []
 */
export function fromCSV(str: string | undefined | null, config?: CsvSerializerConfig): string[] {
  if (!str || str.length === 0) return [];

  const { separator, trimValues, filterEmpty } = { ...defaultConfig, ...config };

  let result = str.split(separator);

  if (trimValues) {
    result = result.map((s) => s.trim());
  }

  if (filterEmpty) {
    result = result.filter((s) => s.length > 0);
  }

  return result;
}

/**
 * Deserialize to number array with validation.
 * Filters out NaN values automatically.
 *
 * @example
 * fromCSVNumbers('1,2,3')     // [1, 2, 3]
 * fromCSVNumbers('1,a,3')     // [1, 3]
 * fromCSVNumbers('')          // []
 */
export function fromCSVNumbers(
  str: string | undefined | null,
  config?: CsvSerializerConfig
): number[] {
  return fromCSV(str, config)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

/**
 * Type-safe helper to convert multiple fields to CSV params.
 * Useful for batch conversion of filter objects.
 *
 * @example
 * const params = toCSVParams({
 *   brand: ['A', 'B'],
 *   region: ['North', 'South'],
 *   empty: [],
 * });
 * // { brand: 'A,B', region: 'North,South' }
 */
export function toCSVParams<T extends Record<string, (string | number)[] | undefined>>(
  obj: T,
  config?: CsvSerializerConfig
): { [K in keyof T]?: string } {
  const result: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(obj)) {
    const csv = toCSV(value, config);
    if (csv !== undefined) {
      result[key] = csv;
    }
  }

  return result as { [K in keyof T]?: string };
}

/**
 * Type-safe helper to parse multiple CSV fields from API response.
 *
 * @example
 * const data = fromCSVParams(apiResponse, ['brand', 'region']);
 * // { brand: ['A', 'B'], region: ['North', 'South'] }
 */
export function fromCSVParams<K extends string>(
  obj: Record<string, string | undefined | null>,
  keys: readonly K[],
  config?: CsvSerializerConfig
): { [P in K]: string[] } {
  const result: Record<string, string[]> = {};

  for (const key of keys) {
    result[key] = fromCSV(obj[key], config);
  }

  return result as { [P in K]: string[] };
}

/**
 * Recursively convert string[] and number[] fields to CSV strings in a payload object.
 * Used for submit payloads where nested objects contain array fields that need
 * to be converted to CSV strings before sending to the API.
 *
 * @example
 * const payload = toCSVPayload({
 *   name: 'Test',
 *   outlet_scope: {
 *     channel: ['MT', 'GT'],
 *     region: ['North', 'South'],
 *     dc: 'DC1',
 *   },
 *   product_scope: {
 *     brand: ['A', 'B'],
 *     codes: [1, 2, 3],
 *   },
 * });
 * // Result:
 * // {
 * //   name: 'Test',
 * //   outlet_scope: {
 * //     channel: 'MT,GT',
 * //     region: 'North,South',
 * //     dc: 'DC1',
 * //   },
 * //   product_scope: {
 * //     brand: 'A,B',
 * //     codes: '1,2,3',
 * //   },
 * // }
 */
export function toCSVPayload<T extends object>(payload: T): T {
  const result = { ...payload } as Record<string, unknown>;

  for (const [key, value] of Object.entries(result)) {
    if (value === null || value === undefined) continue;

    // If it's an array, check if it's valid for CSV conversion
    if (Array.isArray(value)) {
      // Empty arrays become undefined (exclude from payload)
      if (value.length === 0) {
        result[key] = undefined;
        continue;
      }

      // Check if all elements are strings or numbers
      const isValidCsvArray = value.every((v) => typeof v === 'string' || typeof v === 'number');

      if (isValidCsvArray) {
        // Use centralized toCSV for proper handling (trimming, empty filtering)
        result[key] = toCSV(value as (string | number)[]);
      }
      // Mixed arrays or non-primitive arrays are left as-is
      // This preserves complex array types like plan_items[]
    }
    // If it's a nested object (not an array, Date, etc.), recursively process
    else if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof RegExp)) {
      result[key] = toCSVPayload(value as object);
    }
  }

  return result as T;
}
