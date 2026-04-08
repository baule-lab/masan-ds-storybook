import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../../lib/utils';
import { Spinner } from '../../feedback/spinner';

const buttonVariantsInternal = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        secondary: '',
        success: '',
        warning: '',
        info: '',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      appearance: {
        primary: '',
        outline: '',
        ghost: '',
        light: '',
        glass: '',
        shine: '',
        gradient: '',
        pulse: '',
        neumorphic: '',
        cyberpunk: '',
        retro: '',
        brutalism: '',
        minimal: '',
        blur: '',
      },
      size: {
        default: 'h-8 px-3 py-1.5 has-[>svg]:px-2.5',
        xs: 'h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5',
        sm: 'h-7 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2',
        lg: 'h-9 rounded-md px-4 has-[>svg]:px-3',
        icon: 'size-8',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },
    compoundVariants: [
      // Default - Primary appearance (solid)
      {
        variant: 'default',
        appearance: 'primary',
        class: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      // Default - Outline appearance
      {
        variant: 'default',
        appearance: 'outline',
        class:
          'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
      },
      // Default - Ghost appearance
      {
        variant: 'default',
        appearance: 'ghost',
        class: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      // Destructive - Primary appearance (solid)
      {
        variant: 'destructive',
        appearance: 'primary',
        class:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
      },
      // Destructive - Outline appearance
      {
        variant: 'destructive',
        appearance: 'outline',
        class:
          'border border-destructive bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/60 dark:text-destructive/60',
      },
      // Destructive - Ghost appearance
      {
        variant: 'destructive',
        appearance: 'ghost',
        class:
          'text-destructive hover:bg-destructive/10 hover:text-destructive dark:text-destructive/60',
      },
      // Secondary - Primary appearance (solid)
      {
        variant: 'secondary',
        appearance: 'primary',
        class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      // Secondary - Outline appearance
      {
        variant: 'secondary',
        appearance: 'outline',
        class:
          'border border-secondary bg-transparent text-secondary-foreground hover:bg-secondary/10 dark:border-secondary/60',
      },
      // Secondary - Ghost appearance
      {
        variant: 'secondary',
        appearance: 'ghost',
        class: 'text-secondary-foreground hover:bg-secondary/10 dark:hover:bg-secondary/20',
      },
      // Success - Primary appearance (solid)
      {
        variant: 'success',
        appearance: 'primary',
        class:
          'bg-green-600 text-white hover:bg-green-700 dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-500',
      },
      // Success - Outline appearance
      {
        variant: 'success',
        appearance: 'outline',
        class:
          'border border-green-600 bg-transparent text-green-600 hover:bg-green-600/10 hover:text-green-700 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400/10',
      },
      // Success - Ghost appearance
      {
        variant: 'success',
        appearance: 'ghost',
        class:
          'text-green-600 hover:bg-green-600/10 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-400/10',
      },
      // Warning - Primary appearance (solid)
      {
        variant: 'warning',
        appearance: 'primary',
        class:
          'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-500',
      },
      // Warning - Outline appearance
      {
        variant: 'warning',
        appearance: 'outline',
        class:
          'border border-amber-600 bg-transparent text-amber-600 hover:bg-amber-600/10 hover:text-amber-700 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400/10',
      },
      // Warning - Ghost appearance
      {
        variant: 'warning',
        appearance: 'ghost',
        class:
          'text-amber-600 hover:bg-amber-600/10 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-400/10',
      },
      // Info - Primary appearance (solid)
      {
        variant: 'info',
        appearance: 'primary',
        class:
          'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-500',
      },
      // Info - Outline appearance
      {
        variant: 'info',
        appearance: 'outline',
        class:
          'border border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600/10 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10',
      },
      // Info - Ghost appearance
      {
        variant: 'info',
        appearance: 'ghost',
        class:
          'text-blue-600 hover:bg-blue-600/10 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-400/10',
      },
      // Default - Light appearance
      {
        variant: 'default',
        appearance: 'light',
        class:
          'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30',
      },
      // Destructive - Light appearance
      {
        variant: 'destructive',
        appearance: 'light',
        class:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30',
      },
      // Secondary - Light appearance
      {
        variant: 'secondary',
        appearance: 'light',
        class:
          'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 dark:bg-secondary/20 dark:hover:bg-secondary/30',
      },
      // Success - Light appearance
      {
        variant: 'success',
        appearance: 'light',
        class:
          'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900',
      },
      // Warning - Light appearance
      {
        variant: 'warning',
        appearance: 'light',
        class:
          'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900',
      },
      // Info - Light appearance
      {
        variant: 'info',
        appearance: 'light',
        class:
          'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900',
      },
      // Default - Glass appearance (Premium Glassmorphism)
      {
        variant: 'default',
        appearance: 'glass',
        class:
          'relative overflow-hidden border border-white/40 bg-gradient-to-b from-white/50 via-white/30 to-white/10 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl transition-all duration-300 ease-out before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] hover:brightness-110 active:scale-[0.98] active:shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.1)] active:brightness-95 dark:border-white/20 dark:from-white/20 dark:via-white/10 dark:to-transparent dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]',
      },
      // Default - Shine appearance
      {
        variant: 'default',
        appearance: 'shine',
        class:
          'relative overflow-hidden bg-primary text-primary-foreground before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:bg-primary/90',
      },
      // Default - Gradient appearance
      {
        variant: 'default',
        appearance: 'gradient',
        class:
          'bg-gradient-to-r from-primary to-violet-600 text-white shadow-md transition-all hover:scale-[1.02] hover:from-primary/90 hover:to-violet-600/90 hover:shadow-lg',
      },
      // Default - Pulse appearance
      {
        variant: 'default',
        appearance: 'pulse',
        class: 'animate-pulse bg-primary text-primary-foreground hover:bg-primary/90',
      },
      // Default - Neumorphic appearance
      {
        variant: 'default',
        appearance: 'neumorphic',
        class:
          'rounded-xl border-none bg-background text-foreground shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] transition-shadow duration-300 hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#2e2e2e] dark:hover:shadow-[inset_5px_5px_10px_#1a1a1a,inset_-5px_-5px_10px_#2e2e2e]',
      },
      // Destructive - Glass appearance (Premium Glassmorphism)
      {
        variant: 'destructive',
        appearance: 'glass',
        class:
          'relative overflow-hidden border border-destructive/40 bg-gradient-to-b from-destructive/50 via-destructive/30 to-destructive/10 text-white shadow-[0_8px_32px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all duration-300 ease-out before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-[0.98] active:shadow-[0_4px_20px_rgba(239,68,68,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] active:brightness-95 dark:border-destructive/30 dark:from-destructive/40 dark:via-destructive/20 dark:to-destructive/5',
      },
      // Destructive - Shine appearance
      {
        variant: 'destructive',
        appearance: 'shine',
        class:
          'relative overflow-hidden bg-destructive text-destructive-foreground before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:bg-destructive/90',
      },
      // Destructive - Gradient appearance
      {
        variant: 'destructive',
        appearance: 'gradient',
        class:
          'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md transition-all hover:scale-[1.02] hover:from-red-600 hover:to-orange-600 hover:shadow-lg',
      },
      // Destructive - Pulse appearance
      {
        variant: 'destructive',
        appearance: 'pulse',
        class: 'animate-pulse bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      // Secondary - Glass appearance (Premium Glassmorphism)
      {
        variant: 'secondary',
        appearance: 'glass',
        class:
          'relative overflow-hidden border border-secondary/40 bg-gradient-to-b from-secondary/50 via-secondary/30 to-secondary/10 text-secondary-foreground shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all duration-300 ease-out before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-[0.98] active:shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.1)] active:brightness-95 dark:border-secondary/30 dark:from-secondary/30 dark:via-secondary/15 dark:to-secondary/5',
      },
      // Success - Glass appearance (Premium Glassmorphism)
      {
        variant: 'success',
        appearance: 'glass',
        class:
          'relative overflow-hidden border border-green-500/40 bg-gradient-to-b from-green-500/50 via-green-500/30 to-green-500/10 text-white shadow-[0_8px_32px_rgba(34,197,94,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl transition-all duration-300 ease-out before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(34,197,94,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-[0.98] active:shadow-[0_4px_20px_rgba(34,197,94,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] active:brightness-95 dark:border-green-500/30 dark:from-green-500/40 dark:via-green-500/20 dark:to-green-500/5',
      },
      // Success - Shine appearance
      {
        variant: 'success',
        appearance: 'shine',
        class:
          'relative overflow-hidden bg-green-600 text-white before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
      },
      // Success - Gradient appearance
      {
        variant: 'success',
        appearance: 'gradient',
        class:
          'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md transition-all hover:scale-[1.02] hover:from-green-600 hover:to-emerald-700 hover:shadow-lg',
      },
      // Warning - Gradient appearance
      {
        variant: 'warning',
        appearance: 'gradient',
        class:
          'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transition-all hover:scale-[1.02] hover:from-amber-600 hover:to-orange-600 hover:shadow-lg',
      },
      // Info - Gradient appearance
      {
        variant: 'info',
        appearance: 'gradient',
        class:
          'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg',
      },
      // Default - Cyberpunk appearance
      {
        variant: 'default',
        appearance: 'cyberpunk',
        class:
          'clip-path-polygon-[10%_0,100%_0,100%_70%,90%_100%,0_100%,0_30%] rounded-none border-2 border-cyan-400 bg-slate-900 font-mono text-cyan-400 uppercase tracking-widest shadow-[0_0_10px_cyan] transition-all duration-300 before:absolute before:inset-0 before:bg-cyan-400/20 before:opacity-0 before:content-[""] hover:bg-cyan-950 hover:text-white hover:shadow-[0_0_20px_cyan] hover:before:opacity-100',
      },
      // Default - Retro appearance
      {
        variant: 'default',
        appearance: 'retro',
        class:
          'rounded-none border-2 border-black bg-blue-600 font-mono text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
      },
      // Default - Brutalism appearance
      {
        variant: 'default',
        appearance: 'brutalism',
        class:
          'rounded-none border-4 border-black bg-white font-black text-black uppercase tracking-wide shadow-[6px_6px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none',
      },
      // Default - Minimal appearance
      {
        variant: 'default',
        appearance: 'minimal',
        class:
          'h-10 rounded-none border-transparent border-b-2 bg-transparent px-4 text-foreground transition-all hover:border-foreground/20 hover:bg-secondary/50',
      },
      // Default - Blur appearance
      {
        variant: 'default',
        appearance: 'blur',
        class:
          'bg-transparent text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-background/20 hover:backdrop-blur-md',
      },
      // Default - Blur appearance
      {
        variant: 'default',
        appearance: 'blur',
        class:
          'bg-transparent text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-background/20 hover:backdrop-blur-md',
      },
      // Destructive - Cyberpunk appearance
      {
        variant: 'destructive',
        appearance: 'cyberpunk',
        class:
          'rounded-none border-2 border-red-500 bg-slate-900 font-mono text-red-500 uppercase tracking-widest shadow-[0_0_10px_red] transition-all duration-300 hover:bg-red-950 hover:text-white hover:shadow-[0_0_20px_red]',
      },
      // Destructive - Retro appearance
      {
        variant: 'destructive',
        appearance: 'retro',
        class:
          'rounded-none border-2 border-black bg-red-600 font-mono text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
      },
      // Destructive - Brutalism appearance
      {
        variant: 'destructive',
        appearance: 'brutalism',
        class:
          'rounded-none border-4 border-black bg-red-500 font-black text-white uppercase tracking-wide shadow-[6px_6px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none',
      },
    ],
    defaultVariants: {
      variant: 'default',
      appearance: 'primary',
      size: 'default',
    },
  }
);

type ButtonVariant = VariantProps<typeof buttonVariantsInternal>['variant'];
type ButtonAppearance = VariantProps<typeof buttonVariantsInternal>['appearance'];

// Wrapper function for backward compatibility with 'outline' and 'ghost' as variant values
function buttonVariants(props?: {
  variant?: ButtonVariant | 'outline' | 'ghost';
  appearance?: ButtonAppearance;
  size?: VariantProps<typeof buttonVariantsInternal>['size'];
  className?: string;
}): string {
  const { variant, appearance, ...rest } = props ?? {};

  // Handle legacy variant values (outline, ghost) for backward compatibility
  const finalVariant: ButtonVariant =
    variant === 'outline' || variant === 'ghost' ? 'default' : (variant ?? 'default');
  const finalAppearance: ButtonAppearance | undefined =
    variant === 'outline' || variant === 'ghost'
      ? variant === 'outline'
        ? 'outline'
        : 'ghost'
      : !appearance && variant !== 'link'
        ? 'primary'
        : appearance;

  return buttonVariantsInternal({
    variant: finalVariant,
    appearance: finalAppearance,
    size: rest.size,
    className: rest.className,
  });
}

type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  Omit<VariantProps<typeof buttonVariantsInternal>, 'variant' | 'appearance'> & {
    variant?: ButtonVariant | 'outline' | 'ghost';
    appearance?: ButtonAppearance;
    asChild?: boolean;
    loading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    appearance,
    size,
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : 'button';

  // Handle legacy variant values (outline, ghost) for backward compatibility
  const finalVariant: ButtonVariant =
    variant === 'outline' || variant === 'ghost' ? 'default' : (variant ?? 'default');
  const finalAppearance: ButtonAppearance | undefined =
    variant === 'outline' || variant === 'ghost'
      ? variant === 'outline'
        ? 'outline'
        : 'ghost'
      : !appearance && variant !== 'link'
        ? 'primary'
        : appearance;

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(
        buttonVariantsInternal({
          variant: finalVariant,
          appearance: finalAppearance,
          size,
          className,
        })
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

function ButtonGroupBase({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        'inline-flex items-center [&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:not(:first-child):not(:last-child)]:rounded-none [&>button:not(:first-child)]:-ml-px',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Button, buttonVariants, ButtonGroupBase };
