import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../../../lib/utils';
import { useBadgeVariant } from '../../../../hooks/use-badge-variant';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 font-medium text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        primary: '',
        destructive: '',
        success: '',
        warning: '',
        info: '',
      },
      appearance: {
        primary: '',
        outline: '',
        light: '',
      },
    },
    compoundVariants: [
      // Primary - Primary appearance (solid)
      {
        variant: 'primary',
        appearance: 'primary',
        class: 'border-transparent bg-primary text-primary-foreground',
      },
      // Primary - Outline appearance
      {
        variant: 'primary',
        appearance: 'outline',
        class: 'border-primary bg-transparent text-primary',
      },
      // Primary - Light appearance
      {
        variant: 'primary',
        appearance: 'light',
        class: 'border-transparent bg-primary/10 text-primary dark:bg-primary/20',
      },
      // Destructive - Primary appearance (solid)
      {
        variant: 'destructive',
        appearance: 'primary',
        class:
          'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
      },
      // Destructive - Outline appearance
      {
        variant: 'destructive',
        appearance: 'outline',
        class: 'border-destructive bg-transparent text-destructive',
      },
      // Destructive - Light appearance
      {
        variant: 'destructive',
        appearance: 'light',
        class: 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20',
      },
      // Success - Primary appearance (solid)
      {
        variant: 'success',
        appearance: 'primary',
        class: 'border-transparent bg-green-600 text-white dark:bg-green-400 dark:text-green-950',
      },
      // Success - Outline appearance
      {
        variant: 'success',
        appearance: 'outline',
        class:
          'border-green-600 bg-transparent text-green-600 dark:border-green-400 dark:text-green-400',
      },
      // Success - Light appearance
      {
        variant: 'success',
        appearance: 'light',
        class:
          'border-transparent bg-green-600/10 text-green-600 dark:bg-green-400/20 dark:text-green-400',
      },
      // Warning - Primary appearance (solid)
      {
        variant: 'warning',
        appearance: 'primary',
        class: 'border-transparent bg-amber-600 text-white dark:bg-amber-400 dark:text-amber-950',
      },
      // Warning - Outline appearance
      {
        variant: 'warning',
        appearance: 'outline',
        class:
          'border-amber-600 bg-transparent text-amber-600 dark:border-amber-400 dark:text-amber-400',
      },
      // Warning - Light appearance
      {
        variant: 'warning',
        appearance: 'light',
        class:
          'border-transparent bg-amber-600/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400',
      },
      // Info - Primary appearance (solid)
      {
        variant: 'info',
        appearance: 'primary',
        class: 'border-transparent bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950',
      },
      // Info - Outline appearance
      {
        variant: 'info',
        appearance: 'outline',
        class:
          'border-blue-600 bg-transparent text-blue-600 dark:border-blue-400 dark:text-blue-400',
      },
      // Info - Light appearance
      {
        variant: 'info',
        appearance: 'light',
        class:
          'border-transparent bg-blue-600/10 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      appearance: 'primary',
    },
  }
);

/**
 * Helper function to calculate if a color is light or dark
 * Returns true if the color is light (should use dark text), false if dark (should use light text)
 */
function isLightColor(color: string): boolean {
  // Remove any whitespace
  const cleanColor = color.trim();

  // Handle CSS variables
  if (cleanColor.startsWith('var(') || cleanColor.startsWith('--')) {
    // For CSS variables, default to dark background assumption
    return false;
  }

  // Handle rgb/rgba colors
  const rgbMatch = cleanColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1] || '0', 10);
    const g = Number.parseInt(rgbMatch[2] || '0', 10);
    const b = Number.parseInt(rgbMatch[3] || '0', 10);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  // Handle hex colors (3 or 6 digits)
  const hexMatch = cleanColor.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i);
  if (hexMatch?.[1]) {
    let hex = hexMatch[1];
    // Expand 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  // Handle hsl colors
  const hslMatch = cleanColor.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/i);
  if (hslMatch) {
    const lightness = Number.parseInt(hslMatch[3] || '0', 10);
    return lightness > 50;
  }

  // Default to dark background assumption for unknown formats
  return false;
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
type BadgeAppearance = NonNullable<VariantProps<typeof badgeVariants>['appearance']>;

interface BadgeProps
  extends React.ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /**
   * Custom color for the badge. Accepts any CSS color value (hex, rgb, rgba, hsl, hsla, or CSS variable).
   * When provided, it overrides the variant-based colors.
   * For outline appearance, this sets the border and text color.
   * For light appearance, this sets the text color and creates a light background.
   * For primary appearance, this sets the background color and auto-calculates text color.
   */
  color?: string;
  /**
   * Icon to display in the badge. Can be a React node or a function that returns a React node.
   */
  icon?: React.ReactNode | (() => React.ReactNode);

  value?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    variant,
    appearance,
    asChild = false,
    color,
    icon,
    style,
    children,
    value,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : 'span';
  const { getVariant } = useBadgeVariant();

  // If value prop is provided (even if empty/null/undefined), use hook
  // We check if value is not strictly undefined (could be null or empty string)
  const shouldUseHook = value !== undefined;
  const hookResult = shouldUseHook
    ? getVariant({
        value: value ?? '', // Convert null/undefined to empty string
        appearance: appearance ?? undefined,
        icon: icon as (() => React.ReactNode) | undefined,
      })
    : null;

  // Use hook results if available, otherwise use props
  const finalVariant = hookResult?.variant ?? variant;
  const finalAppearance = hookResult?.appearance ?? appearance;
  const finalIcon = hookResult?.icon ?? icon;
  const finalLabel = hookResult?.label ?? children;

  // Build inline styles when color is provided
  const inlineStyles: React.CSSProperties = { ...style };

  if (color) {
    const isLight = isLightColor(color);
    const currentAppearance = finalAppearance || 'light';

    if (currentAppearance === 'outline') {
      // Outline: color as border and text
      inlineStyles.borderColor = color;
      inlineStyles.color = color;
      inlineStyles.backgroundColor = 'transparent';
    } else if (currentAppearance === 'light') {
      // Light: color as text, light background
      inlineStyles.color = color;
      // Create a light version of the color (10% opacity)
      if (color.startsWith('#')) {
        // For hex, convert to rgba with opacity
        let hex = color.replace('#', '');
        // Expand 3-digit hex to 6-digit
        if (hex.length === 3) {
          hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
        }
        const r = Number.parseInt(hex.slice(0, 2), 16);
        const g = Number.parseInt(hex.slice(2, 4), 16);
        const b = Number.parseInt(hex.slice(4, 6), 16);
        inlineStyles.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
      } else if (color.startsWith('rgb')) {
        // For rgb/rgba, modify opacity
        inlineStyles.backgroundColor = color.replace(/rgba?\(([^)]+)\)/, (_match, values) => {
          const parts = values.split(',').map((v: string) => v.trim());
          if (parts.length === 4) {
            // Already rgba
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.1)`;
          }
          // rgb to rgba
          return `rgba(${values}, 0.1)`;
        });
      } else {
        // For other formats, use CSS color-mix or opacity
        inlineStyles.backgroundColor = `color-mix(in srgb, ${color} 10%, transparent)`;
      }
      inlineStyles.borderColor = 'transparent';
    } else {
      // Primary (solid): color as background, auto text color
      inlineStyles.backgroundColor = color;
      inlineStyles.color = isLight ? '#000000' : '#ffffff';
      inlineStyles.borderColor = 'transparent';
    }
  }

  const renderIcon = () => {
    if (!finalIcon) return null;
    return typeof finalIcon === 'function' ? finalIcon() : finalIcon;
  };

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: finalVariant, appearance: finalAppearance }),
        className
      )}
      style={inlineStyles}
      {...props}
    >
      {renderIcon()}
      {finalLabel}
    </Comp>
  );
});

export { Badge, badgeVariants };
export type { BadgeProps, BadgeVariant, BadgeAppearance };
