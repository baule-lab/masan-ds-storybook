export function joinStringArray(array: any[] | null | undefined, separator?: string): string {
  try {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return '';
    }

    return array
      .filter((item) => item !== false && item !== null && item !== undefined && item !== '')
      .join(separator || ', ');
  } catch (error) {
    console.error(error);
    return '';
  }
}

// uniq array of object by key
/**
 * Uniq array of object by key
 * @param array - The array to uniq.
 * @param key - The key to uniq the array.
 * @example
 * uniqArrayOfObjectByKey([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }], 'id') // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * @returns The uniq array.
 */
export function uniqArrayOfObjectByKey<T>(array: T[], key: keyof T): T[] {
  return array.filter((item, index, self) => self.findIndex((t) => t[key] === item[key]) === index);
}

export function uniqStringArray(array: string[]): string[] {
  return array.filter((item, index, self) => self.indexOf(item) === index);
}

/**
 * Check if the values of two arrays are equal
 * @param a - The first array
 * @param b - The second array
 * @example
 * arrayValuesAreEqual(['apple', 'banana', 'cherry'], ['banana', 'apple', 'cherry']) // true
 * @returns true if the values of the two arrays are equal, false otherwise
 */
export const arrayValuesAreEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};
