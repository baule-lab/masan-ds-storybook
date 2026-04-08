import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from 'lucide-react';

import { SelectedBadgeNode } from '@masan-group/shared-ui/selected-badge-node';

const meta: Meta<typeof SelectedBadgeNode> = {
  title: 'Custom Components /SelectedBadgeNode',
  component: SelectedBadgeNode,
  args: {
    label: 'Selected item',
    badgeLabelMaxWidth: '160px',
    compactMode: false,
    showIcon: false,
    showRemoveIcon: true,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text label displayed inside the badge.',
    },
    badgeLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for the label text before it truncates with tooltip.',
    },
    compactMode: {
      control: 'boolean',
      description: 'When true, renders a more compact visual style for small layouts.',
    },
    showIcon: {
      control: 'boolean',
      description: 'Toggle to show or hide the leading icon when `IconComponent` is provided.',
    },
    showRemoveIcon: {
      control: 'boolean',
      description: 'Controls visibility of the trailing remove (X) icon.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectedBadgeNode>;

export const Default: Story = {
  name: 'Default',
  args: {
    onRemove: () => {
      // eslint-disable-next-line no-console
      console.log('Removed');
    },
  },
};

export const WithIcon: Story = {
  name: 'With leading icon',
  args: {
    IconComponent: (props: { className?: string }) => <CheckIcon {...props} />,
    showIcon: true,
    onRemove: () => {
      // eslint-disable-next-line no-console
      console.log('Removed with icon');
    },
  },
};

export const NoRemoveIcon: Story = {
  name: 'Without remove icon',
  args: {
    showRemoveIcon: false,
    onRemove: () => {
      // eslint-disable-next-line no-console
      console.log('Remove handler (not visible)');
    },
  },
};

export const CompactMode: Story = {
  name: 'Compact mode',
  args: {
    compactMode: true,
    onRemove: () => {
      // eslint-disable-next-line no-console
      console.log('Removed (compact)');
    },
  },
};
