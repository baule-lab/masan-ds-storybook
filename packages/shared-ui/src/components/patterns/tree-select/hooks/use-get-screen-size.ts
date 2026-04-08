'use client';

import type { ScreenSize } from '../../../../types/screen';
import React from 'react';
import type { ResponsiveConfig } from '../types';

const getResponsiveSettings = (
  responsive: ResponsiveConfig,
  maxCount: number,
  screenSize: ScreenSize
) => {
  if (!responsive) {
    return {
      maxCount: maxCount,
      hideIcons: false,
      compactMode: false,
    };
  }
  if (responsive === true) {
    const defaultResponsive = {
      mobile: { maxCount: 2, hideIcons: false, compactMode: true },
      tablet: { maxCount: 4, hideIcons: false, compactMode: false },
      desktop: { maxCount: 6, hideIcons: false, compactMode: false },
    };
    const currentSettings = defaultResponsive[screenSize];
    return {
      maxCount: currentSettings?.maxCount ?? maxCount,
      hideIcons: currentSettings?.hideIcons ?? false,
      compactMode: currentSettings?.compactMode ?? false,
    };
  }
  const currentSettings = responsive[screenSize];
  return {
    maxCount: currentSettings?.maxCount ?? maxCount,
    hideIcons: currentSettings?.hideIcons ?? false,
    compactMode: currentSettings?.compactMode ?? false,
  };
};

type UseGetScreenSizeProps = {
  responsive: ResponsiveConfig | undefined;
  maxCount: number;
};

export function useGetScreenConfigTreeSelect(props: UseGetScreenSizeProps) {
  const { responsive, maxCount } = props;
  const [screenSize, setScreenSize] = React.useState<ScreenSize>('desktop');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const responsiveSetting = getResponsiveSettings(responsive ?? false, maxCount, screenSize);

  return {
    screenSize,
    responsiveSetting,
  };
}
