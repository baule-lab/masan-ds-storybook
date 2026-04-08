# Storybook Theme Configuration

This Storybook instance is configured with dark/light theme support for both the Storybook UI and component previews.

## Features

### 1. Component Theme Switching
- **Toolbar Toggle**: Click the theme icon in the Storybook toolbar to switch between light and dark modes
- **Icons**: Sun icon for light mode, Moon icon for dark mode
- **Applies to**: All component previews in the canvas

### 2. Storybook UI Theme
- **Auto-detection**: Storybook UI theme automatically matches your system preferences
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Dark interface for reduced eye strain

## Files

### `preview.ts`
- Configures component preview settings
- Adds theme decorator to all stories
- Defines global theme toolbar control

### `withTheme.tsx`
- Custom decorator that applies theme classes to the document root
- Syncs with toolbar theme selection
- Adds/removes `light` or `dark` class to `<html>` element

### `manager.ts`
- Configures Storybook UI theme
- Detects system color scheme preference
- Applies appropriate theme to Storybook interface

## Usage in Stories

All stories automatically inherit theme support. No additional configuration needed!

```typescript
// Your story file
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@workspace/shared-ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

// This story will automatically support theme switching
export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Click me',
  },
};
```

## Testing Dark Mode

1. Open Storybook
2. Click the theme icon in the toolbar (top right)
3. Select "Dark" from the dropdown
4. All components will render in dark mode

## Customization

### Change Default Theme

Edit `preview.ts`:

```typescript
globalTypes: {
  theme: {
    defaultValue: 'dark', // Change to 'dark' for dark default
    // ...
  },
}
```

### Customize Storybook UI Colors

Edit `manager.ts`:

```typescript
const lightTheme = create({
  base: 'light',
  colorPrimary: '#your-color', // Change primary color
  colorSecondary: '#your-color', // Change secondary color
  // ...
});
```

## Integration with Main App

The theme system uses the same CSS classes as the main application:
- `.light` class for light mode
- `.dark` class for dark mode

This ensures components look identical in Storybook and the main app.
