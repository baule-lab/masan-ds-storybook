import { expect, userEvent, waitFor } from 'storybook/test';
// Replace nextjs-vite with the name of your framework
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedControl } from '@masan-group/shared-ui/segmented-control';

/**
 * A segmented control component that allows users to select a single option from a set of options.
 * Built on top of the Tabs component for consistent styling and behavior.
 */
const meta = {
  title: 'ui/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The controlled value of the segmented control',
    },
    defaultValue: {
      control: { type: 'text' },
      description: 'The default value of the segmented control',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the value changes',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the segmented control is disabled',
    },
  },
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    defaultValue: 'option1',
    disabled: false,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the segmented control.
 */
export const Default: Story = {};

/**
 * A segmented control with a controlled value.
 */
export const Controlled: Story = {
  args: {
    value: 'option2',
  },
};

/**
 * A segmented control with more options.
 */
export const MultipleOptions: Story = {
  args: {
    options: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived' },
    ],
    defaultValue: 'all',
  },
};

/**
 * A disabled segmented control that prevents user interaction.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * A segmented control with two options, commonly used for binary choices.
 */
export const Binary: Story = {
  args: {
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    defaultValue: 'yes',
  },
};

export const ShouldChangeSelection: Story = {
  name: 'when clicking an option, should change the selection',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvas, step }) => {
    const tabs = await canvas.findAllByRole('tab');

    await step('verify initial selection', async () => {
      await waitFor(() => expect(tabs[0]).toHaveAttribute('aria-selected', 'true'));
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    await step('click the second option', async () => {
      await userEvent.click(tabs[1]);
      await waitFor(() => expect(tabs[1]).toHaveAttribute('aria-selected', 'true'));
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    await step('click the third option', async () => {
      await userEvent.click(tabs[2]);
      await waitFor(() => expect(tabs[2]).toHaveAttribute('aria-selected', 'true'));
      expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });
  },
};
