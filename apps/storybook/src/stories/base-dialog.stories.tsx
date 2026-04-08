/** biome-ignore-all lint/nursery/useSortedClasses: <no need to sort classes> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <no need to label without control> */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@masan-group/shared-ui/button';
import { BaseDialog } from '@masan-group/shared-ui/modals';
import { ModalProvider } from '@masan-group/shared-ui/context';

/**
 * BaseDialog is a reusable dialog component built on top of the Dialog component.
 * It provides a consistent interface for dialogs with title, description, content, and footer actions.
 */
const meta = {
  title: 'Custom Components/BaseDialog',
  component: BaseDialog,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the dialog',
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
      description: 'The size of the dialog',
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
} satisfies Meta<typeof BaseDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default dialog with title, description, and action buttons.
 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog
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
    confirmText: 'Confirm',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Dialog with custom content.
 */
export const WithCustomContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This is custom content that can contain any React components.
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        </BaseDialog>
      </>
    );
  },
  args: {
    title: 'Custom Content Dialog',
    description: 'This dialog contains custom content',
    showCancel: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Destructive variant for dangerous actions.
 */
export const Destructive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete Account
        </Button>
        <BaseDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            console.log('Deleted');
            setOpen(false);
          }}
        />
      </>
    );
  },
  args: {
    title: 'Delete Account',
    description: 'Are you sure you want to delete your account? This action cannot be undone.',
    variant: 'destructive',
    confirmText: 'Delete',
    onClose: () => {}, // <-- Required prop for Storybook control. Overwritten by real handler in render
    onConfirm: () => {}, // <-- Optional but for safety (matches all required BaseDialog props)
  },
};

/**
 * Dialog with loading state.
 */
export const Loading: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog
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
    title: 'Processing',
    description: 'Please wait while we process your request...',
    confirmText: 'Process',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Dialog without footer.
 */
export const NoFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Information',
    description: 'This dialog has no footer actions.',
    hideFooter: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Dialog without cancel button.
 */
export const NoCancel: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Confirmation Required',
    description: 'You must confirm this action.',
    showCancel: false,
    confirmText: 'I Understand',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Dialog with disabled confirm button.
 */
export const Disabled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <BaseDialog
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
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Dialog with different sizes.
 */
export const Sizes: Story = {
  render: () => {
    const [openSm, setOpenSm] = useState(false);
    const [openMd, setOpenMd] = useState(false);
    const [openLg, setOpenLg] = useState(false);
    const [openXl, setOpenXl] = useState(false);
    const [openFullscreen, setOpenFullscreen] = useState(false);

    return (
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setOpenSm(true)}>Small (sm)</Button>
        <BaseDialog
          size="sm"
          title="Small Dialog"
          description="This is a small dialog (384px max width)"
          open={openSm}
          onClose={() => setOpenSm(false)}
          onConfirm={() => setOpenSm(false)}
        />

        <Button onClick={() => setOpenMd(true)}>Medium (md)</Button>
        <BaseDialog
          size="md"
          title="Medium Dialog"
          description="This is a medium dialog (448px max width)"
          open={openMd}
          onClose={() => setOpenMd(false)}
          onConfirm={() => setOpenMd(false)}
        />

        <Button onClick={() => setOpenLg(true)}>Large (lg)</Button>
        <BaseDialog
          size="lg"
          title="Large Dialog"
          description="This is a large dialog (512px max width)"
          open={openLg}
          onClose={() => setOpenLg(false)}
          onConfirm={() => setOpenLg(false)}
        />

        <Button onClick={() => setOpenXl(true)}>Extra Large (xl)</Button>
        <BaseDialog
          size="xl"
          title="Extra Large Dialog"
          description="This is an extra large dialog (640px max width)"
          open={openXl}
          onClose={() => setOpenXl(false)}
          onConfirm={() => setOpenXl(false)}
        />

        <Button onClick={() => setOpenFullscreen(true)}>Fullscreen</Button>
        <BaseDialog
          size="fullscreen"
          title="Fullscreen Dialog"
          description="This dialog takes up the full viewport"
          open={openFullscreen}
          onClose={() => setOpenFullscreen(false)}
          onConfirm={() => setOpenFullscreen(false)}
        >
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Fullscreen dialogs are useful for complex forms or detailed content that needs more
              space.
            </p>
          </div>
        </BaseDialog>
      </div>
    );
  },
  args: {
    onClose: () => {},
    onConfirm: () => {},
  },
};
