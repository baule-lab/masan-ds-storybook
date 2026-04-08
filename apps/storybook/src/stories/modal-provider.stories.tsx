// @ts-nocheck - Storybook story files have complex type inference with modals helper
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@masan-group/shared-ui/button';
import { ModalProvider, modals } from '@masan-group/shared-ui/context';

/**
 * ModalProvider is a context provider that manages modal state globally.
 * It provides a centralized way to open and manage modals throughout the application.
 * The GlobalModal component renders all active modals.
 */
const meta: Meta<Record<string, unknown>> = {
  title: 'Custom Components/ModalProvider',
  component: ModalProvider,
  tags: ['autodocs'],
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
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Open a simple confirmation dialog using the modals helper.
 */
export const ConfirmModal: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        onClick={() => {
          modals.confirm({
            title: 'Are you sure?',
            description: 'This action cannot be undone.',
            onConfirm: () => {
              console.log('Confirmed!');
            },
          });
        }}
      >
        Open Confirm Dialog
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a confirmation dialog using the modals helper.
      </p>
    </div>
  ),
};

/**
 * Open a dialog with custom content.
 */
export const DialogWithContent: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        onClick={() => {
          modals.open({
            style: 'dialog',
            title: 'Edit Profile',
            description: 'Update your profile information',
            content: (
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="name-input" className="font-medium text-sm">
                    Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter your name"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email-input" className="font-medium text-sm">
                    Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter your email"
                    defaultValue="john@example.com"
                  />
                </div>
              </div>
            ),
            onConfirm: () => {
              console.log('Profile saved!');
            },
            confirmText: 'Save Changes',
          });
        }}
      >
        Open Dialog
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a dialog with custom content.
      </p>
    </div>
  ),
};

/**
 * Open a drawer from the right.
 */
export const DrawerFromRight: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        onClick={() => {
          modals.open({
            style: 'drawer',
            direction: 'right',
            title: 'Settings',
            description: 'Configure your preferences',
            content: (
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="theme-select" className="font-medium text-sm">
                    Theme
                  </label>
                  <select
                    id="theme-select"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language-select" className="font-medium text-sm">
                    Language
                  </label>
                  <select
                    id="language-select"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            ),
            onConfirm: () => {
              console.log('Settings saved!');
            },
            confirmText: 'Save',
          });
        }}
      >
        Open Drawer (Right)
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a drawer sliding in from the right.
      </p>
    </div>
  ),
};

/**
 * Open a drawer from the bottom.
 */
export const DrawerFromBottom: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        onClick={() => {
          modals.open({
            style: 'drawer',
            direction: 'bottom',
            title: 'Quick Actions',
            description: 'Choose an action',
            content: (
              <div className="space-y-2 py-4">
                <Button variant="outline" className="w-full justify-start">
                  Create New
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Import
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export
                </Button>
              </div>
            ),
            hideFooter: true,
          });
        }}
      >
        Open Drawer (Bottom)
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a drawer sliding in from the bottom.
      </p>
    </div>
  ),
};

/**
 * Destructive confirmation dialog.
 */
export const DestructiveConfirm: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        variant="destructive"
        onClick={() => {
          modals.confirm({
            title: 'Delete Item',
            description: 'Are you sure you want to delete this item? This action cannot be undone.',
            variant: 'destructive',
            onConfirm: () => {
              console.log('Item deleted!');
            },
            confirmText: 'Delete',
          });
        }}
      >
        Delete Item
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a destructive confirmation dialog.
      </p>
    </div>
  ),
};

/**
 * Multiple modals - open several modals in sequence.
 */
export const MultipleModals: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            modals.confirm({
              modalId: 'modal-1',
              title: 'First Modal',
              description: 'This is the first modal',
              onConfirm: () => {
                console.log('First modal confirmed');
              },
            });
          }}
        >
          Open Modal 1
        </Button>
        <Button
          onClick={() => {
            modals.confirm({
              modalId: 'modal-2',
              title: 'Second Modal',
              description: 'This is the second modal',
              onConfirm: () => {
                console.log('Second modal confirmed');
              },
            });
          }}
        >
          Open Modal 2
        </Button>
        <Button
          onClick={() => {
            modals.closeAll();
          }}
        >
          Close All
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Open multiple modals and use the close all button to dismiss them all.
      </p>
    </div>
  ),
};

/**
 * Dialog with loading state.
 */
export const DialogWithLoading: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-4">
      <Button
        onClick={() => {
          const modalId = `payment-${Date.now()}`;
          modals.confirm({
            modalId,
            title: 'Processing Payment',
            description: 'Please wait while we process your payment...',
            loading: true,
            onConfirm: async () => {
              // Simulate async operation
              await new Promise((resolve) => setTimeout(resolve, 2000));
              console.log('Payment processed!');
              modals.close(modalId);
            },
            confirmText: 'Process Payment',
          });
        }}
      >
        Process Payment
      </Button>
      <p className="text-muted-foreground text-sm">
        Click the button to open a dialog with a loading state.
      </p>
    </div>
  ),
};
