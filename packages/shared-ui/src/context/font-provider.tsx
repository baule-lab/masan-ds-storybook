import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, removeCookie, setCookie } from '../lib/cookies';

const FONT_COOKIE_NAME = 'font';
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type FontContextType = {
  font: string;
  setFont: (font: string) => void;
  resetFont: () => void;
};

const FontContext = createContext<FontContextType | null>(null);

type FontProviderProps = {
  /** List of available font names (e.g. ['inter', 'geist']). First item is the default. */
  fonts: readonly string[];
  children: React.ReactNode;
};

export function FontProvider({ fonts, children }: FontProviderProps) {
  const defaultFont = fonts[0] ?? '';

  const [font, _setFont] = useState<string>(() => {
    const savedFont = getCookie(FONT_COOKIE_NAME);
    return fonts.includes(savedFont as string) ? (savedFont as string) : defaultFont;
  });

  useEffect(() => {
    const applyFont = (currentFont: string) => {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls);
      });
      root.classList.add(`font-${currentFont}`);
    };

    applyFont(font);
  }, [font]);

  const setFont = (newFont: string) => {
    setCookie(FONT_COOKIE_NAME, newFont, { maxAge: FONT_COOKIE_MAX_AGE });
    _setFont(newFont);
  };

  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME);
    _setFont(defaultFont);
  };

  return <FontContext value={{ font, setFont, resetFont }}>{children}</FontContext>;
}

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
