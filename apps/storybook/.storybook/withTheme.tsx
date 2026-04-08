import type { Decorator } from '@storybook/react';
import { useEffect } from 'react';

export const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Update Storybook background color based on theme
    const backgroundColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    document.body.style.backgroundColor = backgroundColor;

    // Also update the preview iframe background if it exists
    const previewBody = document.querySelector('.docs-story')?.parentElement;
    if (previewBody) {
      (previewBody as HTMLElement).style.backgroundColor = backgroundColor;
    }
  }, [theme]);

  return <Story />;
};
