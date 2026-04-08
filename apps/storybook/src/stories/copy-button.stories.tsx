import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyIcon, CopyCheckIcon } from 'lucide-react';

import { Button } from '@masan-group/shared-ui/button';
import { CopyButton } from '@masan-group/shared-ui/copy-button';

const meta = {
  title: 'Custom Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text value that will be copied to the clipboard.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button and prevent copy action.',
    },
    iconSize: {
      control: { type: 'number', min: 8, max: 48, step: 1 },
      description: 'Size of the default icon or provided render prop.',
    },
    children: {
      table: {
        disable: true,
      },
      description:
        'Render function that receives copied state, icon size, and onClick handler to fully customize the trigger UI.',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'https://example.com',
  },
};

export const Disabled: Story = {
  args: {
    value: 'https://example.com',
    disabled: true,
  },
};

export const CustomRender: Story = {
  args: {
    value: 'Custom button content',
    iconSize: 18,
  },
  render: (args) => {
    return (
      <CopyButton {...args}>
        {({ copied, iconSize, onClick }) => (
          <Button variant="outline" onClick={onClick} className="gap-2">
            {copied ? <CopyCheckIcon size={iconSize} /> : <CopyIcon size={iconSize} />}
            {copied ? 'Copied' : 'Copy to Clipboard'}
          </Button>
        )}
      </CopyButton>
    );
  },
};
