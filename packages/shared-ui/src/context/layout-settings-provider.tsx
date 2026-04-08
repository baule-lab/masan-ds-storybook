import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from '../lib/cookies';

export type Collapsible = 'offcanvas' | 'icon' | 'none';
export type Variant = 'inset' | 'sidebar' | 'floating';

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible';
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant';
const LAYOUT_FONT_SIZE_COOKIE_NAME = 'layout_font_size';
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const DEFAULT_VARIANT: Variant = 'inset';
const DEFAULT_COLLAPSIBLE: Collapsible = 'icon';
const DEFAULT_FONT_SIZE = 12;

type LayoutSettingsContextType = {
  resetLayout: () => void;

  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;

  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;

  defaultFontSize: number;
  fontSize: number;
  setFontSize: (size: number) => void;
};

const LayoutSettingsContext = createContext<LayoutSettingsContextType | null>(null);

type LayoutSettingsProviderProps = {
  children: React.ReactNode;
};

export function LayoutSettingsProvider({ children }: LayoutSettingsProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE;
  });

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = getCookie(LAYOUT_VARIANT_COOKIE_NAME);
    return (saved as Variant) || DEFAULT_VARIANT;
  });

  const [fontSize, _setFontSize] = useState<number>(() => {
    const saved = getCookie(LAYOUT_FONT_SIZE_COOKIE_NAME);
    return saved ? Number(saved) : DEFAULT_FONT_SIZE;
  });

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible);
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, newCollapsible, {
      maxAge: LAYOUT_COOKIE_MAX_AGE,
    });
  };

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, {
      maxAge: LAYOUT_COOKIE_MAX_AGE,
    });
  };

  const setFontSize = (newSize: number) => {
    const clampedSize = Math.min(18, Math.max(10, newSize));
    _setFontSize(clampedSize);
    setCookie(LAYOUT_FONT_SIZE_COOKIE_NAME, String(clampedSize), {
      maxAge: LAYOUT_COOKIE_MAX_AGE,
    });
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${clampedSize}px`;
    }
  };

  // Apply font-size on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const contextValue: LayoutSettingsContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
    defaultFontSize: DEFAULT_FONT_SIZE,
    fontSize,
    setFontSize,
  };

  return <LayoutSettingsContext value={contextValue}>{children}</LayoutSettingsContext>;
}

const NOOP = () => {};

/** Default values returned when no LayoutSettingsProvider is present */
const defaultSettings: LayoutSettingsContextType = {
  resetLayout: NOOP,
  defaultCollapsible: DEFAULT_COLLAPSIBLE,
  collapsible: DEFAULT_COLLAPSIBLE,
  setCollapsible: NOOP,
  defaultVariant: DEFAULT_VARIANT,
  variant: DEFAULT_VARIANT,
  setVariant: NOOP,
  defaultFontSize: DEFAULT_FONT_SIZE,
  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: NOOP,
};

export function useLayoutSettings() {
  const context = useContext(LayoutSettingsContext);
  return context ?? defaultSettings;
}
