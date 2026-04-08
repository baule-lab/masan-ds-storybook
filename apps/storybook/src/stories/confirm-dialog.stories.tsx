import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@masan-group/shared-ui/button';
import { ConfirmDialog } from '@masan-group/shared-ui/modals';
import { ModalProvider } from '@masan-group/shared-ui/context';

/**
 * ConfirmDialog is a specialized dialog component for confirmation actions.
 * It uses AlertDialog under the hood and is designed for important confirmations that require user attention.
 */
const meta = {
  title: 'Custom Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the confirmation dialog',
    },
    description: {
      control: 'text',
      description: 'The description text displayed below the title',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning'],
      description: 'The variant of the confirm button',
    },
    showCancel: {
      control: 'boolean',
      description: 'Whether to show the cancel button',
    },
    hideFooter: {
      control: 'boolean',
      description: 'Whether to hide the footer completely',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the confirm button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the confirm button is in loading state',
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default confirmation dialog.
 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            console.log('Confirmed');
            setOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    showCancel: true,
    cancelText: 'Cancel',
    confirmText: 'Continue',
  },
};

/**
 * Destructive confirmation for dangerous actions.
 */
export const Destructive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete Account
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            console.log('Account deleted');
            setOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    title: 'Delete Account',
    description:
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
    variant: 'destructive',
    confirmText: 'Delete Account',
  },
};

/**
 * Confirmation dialog with custom content.
 */
export const WithCustomContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4">
            <p className="mb-4 text-muted-foreground text-sm">
              Please review the following information before confirming:
            </p>
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex justify-between">
                <span className="font-medium text-sm">Items:</span>
                <span className="text-sm">5</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Total:</span>
                <span className="font-bold text-sm">$299.99</span>
              </div>
            </div>
          </div>
        </ConfirmDialog>
      </>
    );
  },
  args: {
    title: 'Confirm Purchase',
    description: 'Please review your order before confirming',
    confirmText: 'Confirm Purchase',
  },
};

/**
 * Confirmation dialog with loading state.
 */
export const Loading: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          loading={loading}
          onClose={() => setOpen(false)}
          onConfirm={async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLoading(false);
            setOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    title: 'Processing Payment',
    description: 'Please wait while we process your payment...',
    confirmText: 'Process Payment',
  },
};

/**
 * Confirmation dialog without cancel button.
 */
export const NoCancel: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Action Required',
    description: 'You must confirm this action to proceed.',
    showCancel: false,
    confirmText: 'I Understand',
  },
};

/**
 * Confirmation dialog with disabled confirm button.
 */
export const Disabled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Disabled Action',
    description: 'The confirm button is disabled in this example.',
    disabled: true,
  },
};

/**
 * Confirmation dialog without footer.
 */
export const NoFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Information',
    description: 'This confirmation dialog has no footer actions.',
    hideFooter: true,
  },
};
