import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader2, Mail } from 'lucide-react';

import { Button } from '@masan-group/shared-ui/button';

/**
 * Displays a button or a component that looks like a button.
 */
const meta: Meta<typeof Button> = {
  title: 'ui/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'secondary',
        'success',
        'warning',
        'info',
        'outline',
        'ghost',
        'link',
      ],
    },
    appearance: {
      control: 'select',
      options: [
        'primary',
        'outline',
        'ghost',
        'light',
        'glass',
        'shine',
        'gradient',
        'pulse',
        'neumorphic',
      ],
      if: { arg: 'variant', neq: 'link' },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      if: { arg: 'variant', neq: 'link' },
    },
    children: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the button, used for primary actions and commands.
 */
export const Default: Story = {};

/**
 * Use the `outline` appearance to reduce emphasis on secondary actions, such as
 * canceling or dismissing a dialog.
 */
export const Outline: Story = {
  args: {
    variant: 'default',
    appearance: 'outline',
  },
};

/**
 * Use the `ghost` appearance for minimalistic and subtle buttons, for less intrusive
 * actions.
 */
export const Ghost: Story = {
  args: {
    variant: 'default',
    appearance: 'ghost',
  },
};

/**
 * Use the `light` appearance for buttons with a lighter background color,
 * providing a softer visual emphasis.
 */
export const Light: Story = {
  args: {
    variant: 'default',
    appearance: 'light',
  },
};

/**
 * Use the `secondary` button to call for less emphasized actions, styled to
 * complement the primary button while being less conspicuous.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

/**
 * Use the `destructive` button to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

/**
 * Use the `link` button to reduce emphasis on tertiary actions, such as
 * hyperlink or navigation, providing a text-only interactive element.
 */
export const Link: Story = {
  args: {
    variant: 'link',
  },
};

/**
 * Use the `success` variant to indicate successful actions or positive outcomes.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    appearance: 'primary',
  },
};

/**
 * Use the `success` variant with `outline` appearance for a more subtle success indication.
 */
export const SuccessOutline: Story = {
  args: {
    variant: 'success',
    appearance: 'outline',
  },
};

/**
 * Use the `success` variant with `ghost` appearance for minimal success indication.
 */
export const SuccessGhost: Story = {
  args: {
    variant: 'success',
    appearance: 'ghost',
  },
};

/**
 * Use the `success` variant with `light` appearance for a soft success background.
 */
export const SuccessLight: Story = {
  args: {
    variant: 'success',
    appearance: 'light',
  },
};

/**
 * Use the `warning` variant to indicate caution or attention needed.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    appearance: 'primary',
  },
};

/**
 * Use the `warning` variant with `outline` appearance for a more subtle warning indication.
 */
export const WarningOutline: Story = {
  args: {
    variant: 'warning',
    appearance: 'outline',
  },
};

/**
 * Use the `warning` variant with `ghost` appearance for minimal warning indication.
 */
export const WarningGhost: Story = {
  args: {
    variant: 'warning',
    appearance: 'ghost',
  },
};

/**
 * Use the `warning` variant with `light` appearance for a soft warning background.
 */
export const WarningLight: Story = {
  args: {
    variant: 'warning',
    appearance: 'light',
  },
};

/**
 * Use the `info` variant to indicate informational actions or neutral states.
 */
export const Info: Story = {
  args: {
    variant: 'info',
    appearance: 'primary',
  },
};

/**
 * Use the `info` variant with `outline` appearance for a more subtle info indication.
 */
export const InfoOutline: Story = {
  args: {
    variant: 'info',
    appearance: 'outline',
  },
};

/**
 * Use the `info` variant with `ghost` appearance for minimal info indication.
 */
export const InfoGhost: Story = {
  args: {
    variant: 'info',
    appearance: 'ghost',
  },
};

/**
 * Use the `info` variant with `light` appearance for a soft info background.
 */
export const InfoLight: Story = {
  args: {
    variant: 'info',
    appearance: 'light',
  },
};

/**
 * Examples of destructive variant with different appearances.
 */
export const DestructiveOutline: Story = {
  args: {
    variant: 'destructive',
    appearance: 'outline',
  },
};

/**
 * Examples of destructive variant with ghost appearance.
 */
export const DestructiveGhost: Story = {
  args: {
    variant: 'destructive',
    appearance: 'ghost',
  },
};

/**
 * Use the `destructive` variant with `light` appearance for a soft destructive background.
 */
export const DestructiveLight: Story = {
  args: {
    variant: 'destructive',
    appearance: 'light',
  },
};

/**
 * Add the `disabled` prop to a button to prevent interactions and add a
 * loading indicator, such as a spinner, to signify an in-progress action.
 */
export const Loading: Story = {
  render: (args) => (
    <Button {...args}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Button
    </Button>
  ),
  args: {
    ...Outline.args,
    disabled: true,
  },
};

/**
 * Add an icon element to a button to enhance visual communication and
 * providing additional context for the action.
 */
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" /> Login with Email Button
    </Button>
  ),
  args: {
    ...Secondary.args,
  },
};

/**
 * Use the `sm` size for a smaller button, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Use the `lg` size for a larger button, offering better visibility and
 * easier interaction for users.
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

/**
 * Use the "icon" size for a button with only an icon.
 */
export const Icon: Story = {
  args: {
    ...Secondary.args,
    size: 'icon',
    title: 'Mail',
    children: <Mail />,
  },
};

/**
 * Use the `icon-sm` size for a smaller icon-only button.
 */
export const IconSmall: Story = {
  args: {
    variant: 'secondary',
    size: 'icon-sm',
    title: 'Mail',
    children: <Mail />,
  },
};

/**
 * Use the `icon-lg` size for a larger icon-only button.
 */
export const IconLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'icon-lg',
    title: 'Mail',
    children: <Mail />,
  },
};

/**
 * Add the `disabled` prop to prevent interactions with the button.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Use the `glass` appearance for a modern, frosted glass look.
 */
export const Glass: Story = {
  args: {
    variant: 'default',
    appearance: 'glass',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Glass button on a vibrant gradient background - showcases the frosted effect.
 */
export const GlassOnGradient: Story = {
  args: {
    variant: 'default',
    appearance: 'glass',
    children: 'Glassy Button',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] min-w-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Glass button with icon - demonstrates icon styling compatibility.
 */
export const GlassWithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" /> Send Message
    </Button>
  ),
  args: {
    variant: 'default',
    appearance: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] min-w-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Glass button collection showing all variants on dark gradient.
 */
export const GlassCollection: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="default" appearance="glass">
        Default Glass
      </Button>
      <Button variant="destructive" appearance="glass">
        Destructive Glass
      </Button>
      <Button variant="secondary" appearance="glass">
        Secondary Glass
      </Button>
      <Button variant="success" appearance="glass">
        Success Glass
      </Button>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="flex min-h-[300px] min-w-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive glass button demo - hover and click to see states.
 */
export const GlassInteractive: Story = {
  args: {
    variant: 'default',
    appearance: 'glass',
    children: 'Hover & Click Me',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Hover to see scale + brightness effect. Click to see pressed state with inset shadow.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] min-w-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Use the `shine` appearance for a button with a shining animation effect.
 */
export const Shine: Story = {
  args: {
    variant: 'default',
    appearance: 'shine',
  },
};

/**
 * Use the `gradient` appearance for a button with a gradient background.
 */
export const Gradient: Story = {
  args: {
    variant: 'default',
    appearance: 'gradient',
  },
};

/**
 * Use the `pulse` appearance for a button with a subtle pulse animation.
 */
export const Pulse: Story = {
  args: {
    variant: 'default',
    appearance: 'pulse',
  },
};

/**
 * Use the `neumorphic` appearance for a soft UI look.
 */
export const Neumorphic: Story = {
  args: {
    variant: 'default',
    appearance: 'neumorphic',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

/**
 * Glass appearance with Destructive variant.
 */
export const DestructiveGlass: Story = {
  args: {
    variant: 'destructive',
    appearance: 'glass',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Gradient appearance with Success variant.
 */
export const SuccessGradient: Story = {
  args: {
    variant: 'success',
    appearance: 'gradient',
  },
};

/**
 * Cyberpunk appearance.
 */
export const Cyberpunk: Story = {
  args: {
    variant: 'default',
    appearance: 'cyberpunk',
    children: 'CYBERPUNK',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Retro appearance.
 */
export const Retro: Story = {
  args: {
    variant: 'default',
    appearance: 'retro',
    children: 'RETRO',
  },
};

/**
 * Brutalism appearance.
 */
export const Brutalism: Story = {
  args: {
    variant: 'default',
    appearance: 'brutalism',
    children: 'BRUTALISM',
  },
};

/**
 * Minimal appearance.
 */
export const Minimal: Story = {
  args: {
    variant: 'default',
    appearance: 'minimal',
    children: 'Minimal',
  },
};

/**
 * Cyberpunk Destructive.
 */
export const DestructiveCyberpunk: Story = {
  args: {
    variant: 'destructive',
    appearance: 'cyberpunk',
    children: 'DELETE',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Blur appearance.
 */
export const Blur: Story = {
  args: {
    variant: 'default',
    appearance: 'blur',
    children: 'Blur Effect',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
