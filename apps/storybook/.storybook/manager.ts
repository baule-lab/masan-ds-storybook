import { addons } from 'storybook/internal/manager-api';
import { create } from 'storybook/internal/theming';

const lightTheme = create({
  base: 'light',
  brandTitle: 'Loyalty Bos',
  brandUrl: '/',
  brandImage: '/logo-masan.png',
  brandTarget: '_self',

  // UI colors
  colorPrimary: '#3b82f6',
  colorSecondary: '#3b82f6',

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Loyalty Bos',
  brandUrl: '/',
  brandImage: '/logo-masan-dark.png',
  brandTarget: '_self',

  // UI colors
  colorPrimary: '#3b82f6',
  colorSecondary: '#3b82f6',

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',
});

// Function to update theme based on system preference
function updateTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? darkTheme : lightTheme;

  addons.setConfig({
    theme,
  });
}

// Set initial theme
updateTheme();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  updateTheme();
});
