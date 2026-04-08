import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@masan-group/shared-ui/badge';

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: 'ui/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'destructive', 'success', 'warning', 'info'],
      description: 'The color variant of the badge',
    },
    appearance: {
      control: 'select',
      options: ['primary', 'outline', 'light'],
      description: 'The appearance style of the badge',
    },
    color: {
      control: 'color',
      description:
        'Custom color for the badge (CSS color value: hex, rgb, rgba, hsl, hsla, or CSS variable)',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
  args: {
    variant: 'primary',
    appearance: 'primary',
    children: 'Badge',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the badge with primary variant and primary appearance.
 */
export const Default: Story = {};

/**
 * Primary badge variants with different appearances.
 */
export const Primary: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary" appearance="primary">
        Primary
      </Badge>
      <Badge variant="primary" appearance="outline">
        Primary
      </Badge>
      <Badge variant="primary" appearance="light">
        Primary
      </Badge>
    </div>
  ),
};

/**
 * Destructive badge variants with different appearances.
 * Use to indicate errors, alerts, or the need for immediate attention.
 */
export const Destructive: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="destructive" appearance="primary">
        Destructive
      </Badge>
      <Badge variant="destructive" appearance="outline">
        Destructive
      </Badge>
      <Badge variant="destructive" appearance="light">
        Destructive
      </Badge>
    </div>
  ),
};

/**
 * Success badge variants with different appearances.
 * Use to indicate successful operations or positive status.
 */
export const Success: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="success" appearance="primary">
        Success
      </Badge>
      <Badge variant="success" appearance="outline">
        Success
      </Badge>
      <Badge variant="success" appearance="light">
        Success
      </Badge>
    </div>
  ),
};

/**
 * Warning badge variants with different appearances.
 * Use to indicate warnings or cautionary information.
 */
export const Warning: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="warning" appearance="primary">
        Warning
      </Badge>
      <Badge variant="warning" appearance="outline">
        Warning
      </Badge>
      <Badge variant="warning" appearance="light">
        Warning
      </Badge>
    </div>
  ),
};

/**
 * Info badge variants with different appearances.
 * Use to indicate informational messages or neutral status.
 */
export const Info: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="info" appearance="primary">
        Info
      </Badge>
      <Badge variant="info" appearance="outline">
        Info
      </Badge>
      <Badge variant="info" appearance="light">
        Info
      </Badge>
    </div>
  ),
};

/**
 * All variants with primary appearance (solid).
 */
export const AllVariantsPrimary: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary" appearance="primary">
        Primary
      </Badge>
      <Badge variant="destructive" appearance="primary">
        Destructive
      </Badge>
      <Badge variant="success" appearance="primary">
        Success
      </Badge>
      <Badge variant="warning" appearance="primary">
        Warning
      </Badge>
      <Badge variant="info" appearance="primary">
        Info
      </Badge>
    </div>
  ),
};

/**
 * All variants with outline appearance.
 */
export const AllVariantsOutline: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary" appearance="outline">
        Primary
      </Badge>
      <Badge variant="destructive" appearance="outline">
        Destructive
      </Badge>
      <Badge variant="success" appearance="outline">
        Success
      </Badge>
      <Badge variant="warning" appearance="outline">
        Warning
      </Badge>
      <Badge variant="info" appearance="outline">
        Info
      </Badge>
    </div>
  ),
};

/**
 * All variants with light appearance.
 */
export const AllVariantsLight: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary" appearance="light">
        Primary
      </Badge>
      <Badge variant="destructive" appearance="light">
        Destructive
      </Badge>
      <Badge variant="success" appearance="light">
        Success
      </Badge>
      <Badge variant="warning" appearance="light">
        Warning
      </Badge>
      <Badge variant="info" appearance="light">
        Info
      </Badge>
    </div>
  ),
};

/**
 * Complete overview of all badge combinations.
 */
export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-medium text-sm">Primary Appearance</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="primary" appearance="primary">
            Primary
          </Badge>
          <Badge variant="destructive" appearance="primary">
            Destructive
          </Badge>
          <Badge variant="success" appearance="primary">
            Success
          </Badge>
          <Badge variant="warning" appearance="primary">
            Warning
          </Badge>
          <Badge variant="info" appearance="primary">
            Info
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">Outline Appearance</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="primary" appearance="outline">
            Primary
          </Badge>
          <Badge variant="destructive" appearance="outline">
            Destructive
          </Badge>
          <Badge variant="success" appearance="outline">
            Success
          </Badge>
          <Badge variant="warning" appearance="outline">
            Warning
          </Badge>
          <Badge variant="info" appearance="outline">
            Info
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">Light Appearance</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="primary" appearance="light">
            Primary
          </Badge>
          <Badge variant="destructive" appearance="light">
            Destructive
          </Badge>
          <Badge variant="success" appearance="light">
            Success
          </Badge>
          <Badge variant="warning" appearance="light">
            Warning
          </Badge>
          <Badge variant="info" appearance="light">
            Info
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Badge with custom color using the color prop.
 * The color prop accepts any CSS color value (hex, rgb, rgba, hsl, hsla, or CSS variable).
 */
export const CustomColor: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-medium text-sm">Primary Appearance with Custom Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="primary" color="#8b5cf6">
            Purple
          </Badge>
          <Badge appearance="primary" color="rgb(236, 72, 153)">
            Pink
          </Badge>
          <Badge appearance="primary" color="hsl(142, 71%, 45%)">
            Teal
          </Badge>
          <Badge appearance="primary" color="#f59e0b">
            Amber
          </Badge>
          <Badge appearance="primary" color="var(--primary)">
            CSS Variable
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">Outline Appearance with Custom Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="outline" color="#8b5cf6">
            Purple
          </Badge>
          <Badge appearance="outline" color="rgb(236, 72, 153)">
            Pink
          </Badge>
          <Badge appearance="outline" color="hsl(142, 71%, 45%)">
            Teal
          </Badge>
          <Badge appearance="outline" color="#f59e0b">
            Amber
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">Light Appearance with Custom Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="light" color="#8b5cf6">
            Purple
          </Badge>
          <Badge appearance="light" color="rgb(236, 72, 153)">
            Pink
          </Badge>
          <Badge appearance="light" color="hsl(142, 71%, 45%)">
            Teal
          </Badge>
          <Badge appearance="light" color="#f59e0b">
            Amber
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Examples of different color formats supported by the color prop.
 */
export const ColorFormats: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-medium text-sm">Hex Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="primary" color="#ff0000">
            #ff0000
          </Badge>
          <Badge appearance="primary" color="#00ff00">
            #00ff00
          </Badge>
          <Badge appearance="primary" color="#0000ff">
            #0000ff
          </Badge>
          <Badge appearance="primary" color="#f00">
            3-digit #f00
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">RGB Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="primary" color="rgb(255, 0, 0)">
            rgb(255, 0, 0)
          </Badge>
          <Badge appearance="primary" color="rgba(0, 255, 0, 0.8)">
            rgba(0, 255, 0, 0.8)
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium text-sm">HSL Colors</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge appearance="primary" color="hsl(240, 100%, 50%)">
            hsl(240, 100%, 50%)
          </Badge>
          <Badge appearance="primary" color="hsla(120, 100%, 50%, 0.8)">
            hsla(120, 100%, 50%, 0.8)
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
