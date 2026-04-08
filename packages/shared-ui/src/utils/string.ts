export function toCapitalize(str: string | null | undefined, allWords = false) {
  try {
    if (!str) return '';
    const temp = str.replace(/_/g, ' ');
    if (allWords) {
      return temp
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return temp.charAt(0).toUpperCase() + temp.slice(1).toLowerCase();
  } catch (error) {
    console.error(error);
    return '';
  }
}

export function toSnakeCase(str: string | null | undefined) {
  try {
    if (!str) return '';
    return str.toLowerCase().replace(/ /g, '_');
  } catch (error) {
    console.error(error);
    return '';
  }
}

export function toCamelCase(str: string | null | undefined) {
  try {
    if (!str) return '';
    return str.toLowerCase().replace(/ /g, '_');
  } catch (error) {
    console.error(error);
    return '';
  }
}

// replace all space with replacement
export function replaceSpaceWith(str: string | null | undefined, replacement: string) {
  try {
    if (!str) return '';
    return str.replace(/ /g, replacement || '');
  } catch (error) {
    console.error(error);
    return '';
  }
}

/**
 * remove vietnamese accents
 */
export function removeVietnameseAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
