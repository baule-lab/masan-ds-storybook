import { describe, it, expect } from 'vitest';
import {
  CSV_SEPARATOR,
  toCSV,
  fromCSV,
  fromCSVNumbers,
  toCSVParams,
  fromCSVParams,
  toCSVPayload,
} from './csvSerializer';

describe('CSV_SEPARATOR', () => {
  it('should be comma', () => {
    expect(CSV_SEPARATOR).toBe(',');
  });
});

describe('toCSV', () => {
  it('serializes string array to CSV', () => {
    expect(toCSV(['a', 'b', 'c'])).toBe('a,b,c');
  });

  it('serializes number array to CSV', () => {
    expect(toCSV([1, 2, 3])).toBe('1,2,3');
  });

  it('returns undefined for empty array', () => {
    expect(toCSV([])).toBeUndefined();
  });

  it('returns undefined for undefined input', () => {
    expect(toCSV(undefined)).toBeUndefined();
  });

  it('returns undefined for null input', () => {
    expect(toCSV(null)).toBeUndefined();
  });

  it('trims whitespace by default', () => {
    expect(toCSV([' a ', ' b ', ' c '])).toBe('a,b,c');
  });

  it('filters empty strings by default', () => {
    expect(toCSV(['a', '', 'c'])).toBe('a,c');
  });

  it('returns undefined when all values are empty after filtering', () => {
    expect(toCSV(['', '', ''])).toBeUndefined();
  });

  it('respects custom separator', () => {
    expect(toCSV(['a', 'b', 'c'], { separator: ';' })).toBe('a;b;c');
  });

  it('can disable trimming', () => {
    expect(toCSV([' a ', ' b '], { trimValues: false })).toBe(' a , b ');
  });

  it('can disable empty filtering', () => {
    expect(toCSV(['a', '', 'c'], { filterEmpty: false })).toBe('a,,c');
  });

  it('handles mixed string and number arrays', () => {
    expect(toCSV(['a', 'b'] as (string | number)[])).toBe('a,b');
    expect(toCSV([1, 2] as (string | number)[])).toBe('1,2');
  });
});

describe('fromCSV', () => {
  it('deserializes CSV to string array', () => {
    expect(fromCSV('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty string', () => {
    expect(fromCSV('')).toEqual([]);
  });

  it('returns empty array for undefined', () => {
    expect(fromCSV(undefined)).toEqual([]);
  });

  it('returns empty array for null', () => {
    expect(fromCSV(null)).toEqual([]);
  });

  it('trims whitespace by default', () => {
    expect(fromCSV(' a , b , c ')).toEqual(['a', 'b', 'c']);
  });

  it('filters empty strings by default', () => {
    expect(fromCSV('a,,c')).toEqual(['a', 'c']);
  });

  it('respects custom separator', () => {
    expect(fromCSV('a;b;c', { separator: ';' })).toEqual(['a', 'b', 'c']);
  });

  it('can disable trimming', () => {
    expect(fromCSV(' a , b ', { trimValues: false })).toEqual([' a ', ' b ']);
  });

  it('can disable empty filtering', () => {
    expect(fromCSV('a,,c', { filterEmpty: false })).toEqual(['a', '', 'c']);
  });

  it('handles single value', () => {
    expect(fromCSV('single')).toEqual(['single']);
  });
});

describe('fromCSVNumbers', () => {
  it('deserializes CSV to number array', () => {
    expect(fromCSVNumbers('1,2,3')).toEqual([1, 2, 3]);
  });

  it('filters out NaN values', () => {
    expect(fromCSVNumbers('1,a,3')).toEqual([1, 3]);
  });

  it('returns empty array for empty string', () => {
    expect(fromCSVNumbers('')).toEqual([]);
  });

  it('returns empty array for undefined', () => {
    expect(fromCSVNumbers(undefined)).toEqual([]);
  });

  it('handles decimal numbers', () => {
    expect(fromCSVNumbers('1.5,2.5,3.5')).toEqual([1.5, 2.5, 3.5]);
  });

  it('handles negative numbers', () => {
    expect(fromCSVNumbers('-1,2,-3')).toEqual([-1, 2, -3]);
  });

  it('respects custom config', () => {
    expect(fromCSVNumbers('1;2;3', { separator: ';' })).toEqual([1, 2, 3]);
  });
});

describe('toCSVParams', () => {
  it('converts multiple array fields to CSV', () => {
    const result = toCSVParams({
      brand: ['A', 'B'],
      region: ['North', 'South'],
    });
    expect(result).toEqual({
      brand: 'A,B',
      region: 'North,South',
    });
  });

  it('excludes empty arrays', () => {
    const result = toCSVParams({
      brand: ['A', 'B'],
      empty: [],
    });
    expect(result).toEqual({ brand: 'A,B' });
    expect(result).not.toHaveProperty('empty');
  });

  it('excludes undefined values', () => {
    const result = toCSVParams({
      brand: ['A', 'B'],
      missing: undefined,
    });
    expect(result).toEqual({ brand: 'A,B' });
    expect(result).not.toHaveProperty('missing');
  });

  it('handles empty object', () => {
    expect(toCSVParams({})).toEqual({});
  });

  it('respects custom config', () => {
    const result = toCSVParams({ items: ['a', 'b'] }, { separator: ';' });
    expect(result).toEqual({ items: 'a;b' });
  });

  it('handles number arrays', () => {
    const result = toCSVParams({ ids: [1, 2, 3] });
    expect(result).toEqual({ ids: '1,2,3' });
  });
});

describe('fromCSVParams', () => {
  it('parses multiple CSV fields', () => {
    const result = fromCSVParams({ brand: 'A,B', region: 'North,South' }, [
      'brand',
      'region',
    ] as const);
    expect(result).toEqual({
      brand: ['A', 'B'],
      region: ['North', 'South'],
    });
  });

  it('handles missing fields', () => {
    const result = fromCSVParams({ brand: 'A,B' }, ['brand', 'region'] as const);
    expect(result).toEqual({
      brand: ['A', 'B'],
      region: [],
    });
  });

  it('handles null and undefined values', () => {
    const result = fromCSVParams({ a: null, b: undefined, c: 'x,y' }, ['a', 'b', 'c'] as const);
    expect(result).toEqual({
      a: [],
      b: [],
      c: ['x', 'y'],
    });
  });

  it('respects custom config', () => {
    const result = fromCSVParams({ items: 'a;b;c' }, ['items'] as const, { separator: ';' });
    expect(result).toEqual({ items: ['a', 'b', 'c'] });
  });
});

describe('toCSVPayload', () => {
  it('converts flat string arrays to CSV', () => {
    const result = toCSVPayload({
      name: 'Test',
      brands: ['A', 'B', 'C'],
    });
    expect(result).toEqual({
      name: 'Test',
      brands: 'A,B,C',
    });
  });

  it('converts number arrays to CSV', () => {
    const result = toCSVPayload({
      ids: [1, 2, 3],
    });
    expect(result).toEqual({
      ids: '1,2,3',
    });
  });

  it('recursively processes nested objects', () => {
    const result = toCSVPayload({
      name: 'Test',
      outlet_scope: {
        channel: ['MT', 'GT'],
        region: ['North', 'South'],
        dc: 'DC1',
      },
      product_scope: {
        brand: ['A', 'B'],
        category: 'Food',
      },
    });
    expect(result).toEqual({
      name: 'Test',
      outlet_scope: {
        channel: 'MT,GT',
        region: 'North,South',
        dc: 'DC1',
      },
      product_scope: {
        brand: 'A,B',
        category: 'Food',
      },
    });
  });

  it('handles empty arrays by setting to undefined', () => {
    const result = toCSVPayload({
      brands: [],
      regions: ['North'],
    });
    expect(result).toEqual({
      brands: undefined,
      regions: 'North',
    });
  });

  it('preserves null and undefined values', () => {
    const result = toCSVPayload({
      a: null,
      b: undefined,
      c: 'test',
    });
    expect(result).toEqual({
      a: null,
      b: undefined,
      c: 'test',
    });
  });

  it('preserves non-array primitive values', () => {
    const result = toCSVPayload({
      name: 'Test',
      count: 42,
      active: true,
      ratio: 0.5,
    });
    expect(result).toEqual({
      name: 'Test',
      count: 42,
      active: true,
      ratio: 0.5,
    });
  });

  it('preserves complex arrays (objects)', () => {
    const planItems = [
      { timestamp: '2024-01', value: 100 },
      { timestamp: '2024-02', value: 200 },
    ];
    const result = toCSVPayload({
      name: 'Test',
      plan_items: planItems,
    });
    expect(result).toEqual({
      name: 'Test',
      plan_items: planItems,
    });
  });

  it('preserves Date objects', () => {
    const date = new Date('2024-01-01');
    const result = toCSVPayload({
      start_date: date,
    });
    expect(result.start_date).toBe(date);
  });

  it('trims whitespace in array values', () => {
    const result = toCSVPayload({
      brands: [' A ', ' B '],
    });
    expect(result).toEqual({
      brands: 'A,B',
    });
  });

  it('filters empty strings in arrays', () => {
    const result = toCSVPayload({
      brands: ['A', '', 'C'],
    });
    expect(result).toEqual({
      brands: 'A,C',
    });
  });

  it('handles deeply nested objects', () => {
    const result = toCSVPayload({
      level1: {
        level2: {
          level3: {
            items: ['x', 'y'],
          },
        },
      },
    });
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            items: 'x,y',
          },
        },
      },
    });
  });
});
