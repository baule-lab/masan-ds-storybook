/**
 * Cookie utility functions with proper security and encoding
 * Replaces js-cookie dependency for better consistency
 */
/** biome-ignore-all lint/suspicious/noDocumentCookie: Standard browser API for setting cookies */

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Safely build a cookie string with proper encoding and security flags
 */
function buildCookieString(name: string, value: string, options: CookieOptions = {}): string {
  const {
    maxAge = DEFAULT_MAX_AGE,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'Lax',
  } = options;

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);

  const parts = [`${encodedName}=${encodedValue}`];

  if (maxAge !== undefined) {
    parts.push(`max-age=${maxAge}`);
  }

  if (path) {
    parts.push(`path=${path}`);
  }

  if (domain) {
    parts.push(`domain=${domain}`);
  }

  if (secure) {
    parts.push('secure');
  }

  if (sameSite) {
    parts.push(`samesite=${sameSite}`);
  }

  return parts.join('; ');
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.split('=');
    if (cookieName === encodedName) {
      const cookieValue = cookieValueParts.join('=');
      return decodeURIComponent(cookieValue);
    }
  }

  return undefined;
}

/**
 * Set a cookie with name, value, and optional configuration
 */
export function setCookie(name: string, value: string, options?: CookieOptions): void {
  if (typeof document === 'undefined') return;

  try {
    const cookieString = buildCookieString(name, value, options);
    document.cookie = cookieString;
  } catch (error) {
    console.error('Failed to set cookie:', error);
  }
}

/**
 * Remove a cookie by setting its max age to 0
 */
export function removeCookie(name: string, options?: Omit<CookieOptions, 'maxAge'>): void {
  if (typeof document === 'undefined') return;

  try {
    const cookieString = buildCookieString(name, '', { ...options, maxAge: 0 });
    document.cookie = cookieString;
  } catch (error) {
    console.error('Failed to remove cookie:', error);
  }
}
