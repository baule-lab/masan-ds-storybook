/** biome-ignore-all lint/nursery/useSortedClasses: <no need to sort classes> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <no need to label without control> */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Button } from '@masan-group/shared-ui/button';
import { BaseDrawer } from '@masan-group/shared-ui/modals';
import { ModalProvider } from '@masan-group/shared-ui/context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@masan-group/shared-ui/select';

/**
 * BaseDrawer is a reusable drawer component built on top of the Drawer component.
 * It provides a consistent interface for drawers with title, description, content, and footer actions.
 * Drawers slide in from different directions (top, bottom, left, right).
 */
const meta = {
  title: 'Custom Components/BaseDrawer',
  component: BaseDrawer,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the drawer',
    },
    description: {
      control: 'text',
      description: 'The description text displayed below the title',
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The direction from which the drawer slides in',
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
      description: 'The size of the drawer',
    },
    showFullscreenToggle: {
      control: 'boolean',
      description: 'Whether to show the fullscreen toggle button',
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
} satisfies Meta<typeof BaseDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default drawer sliding in from the right.
 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
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
    title: 'Settings',
    description: 'Configure your preferences',
    direction: 'right',
    showCancel: true,
    cancelText: 'Cancel',
    confirmText: 'Save',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer sliding in from the left.
 */
export const FromLeft: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Navigation',
    description: 'Navigate through the application',
    direction: 'left',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer sliding in from the top.
 */
export const FromTop: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Notifications',
    description: 'View your recent notifications',
    direction: 'top',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer sliding in from the bottom.
 */
export const FromBottom: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Quick Actions',
    description: 'Perform quick actions',
    direction: 'bottom',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with custom content.
 */
export const WithCustomContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder="Enter your message"
              />
            </div>
          </div>
        </BaseDrawer>
      </>
    );
  },
  args: {
    title: 'Contact Form',
    description: 'Fill out the form below',
    direction: 'right',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with loading state.
 */
export const Loading: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
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
    description: 'Please wait while we save your changes...',
    direction: 'right',
    confirmText: 'Save',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer without footer.
 */
export const NoFooter: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: {
    title: 'Information',
    description: 'This drawer has no footer actions.',
    direction: 'right',
    hideFooter: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with destructive variant.
 */
export const Destructive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete Item
        </Button>
        <BaseDrawer
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
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    direction: 'right',
    variant: 'destructive',
    confirmText: 'Delete',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with different sizes.
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
        <BaseDrawer
          size="sm"
          title="Small Drawer"
          description="This is a small drawer"
          direction="right"
          open={openSm}
          onClose={() => setOpenSm(false)}
          onConfirm={() => setOpenSm(false)}
        />

        <Button onClick={() => setOpenMd(true)}>Medium (md)</Button>
        <BaseDrawer
          size="md"
          title="Medium Drawer"
          description="This is a medium drawer"
          direction="right"
          open={openMd}
          onClose={() => setOpenMd(false)}
          onConfirm={() => setOpenMd(false)}
        />

        <Button onClick={() => setOpenLg(true)}>Large (lg)</Button>
        <BaseDrawer
          size="lg"
          title="Large Drawer"
          description="This is a large drawer"
          direction="right"
          open={openLg}
          onClose={() => setOpenLg(false)}
          onConfirm={() => setOpenLg(false)}
        />

        <Button onClick={() => setOpenXl(true)}>Extra Large (xl)</Button>
        <BaseDrawer
          size="xl"
          title="Extra Large Drawer"
          description="This is an extra large drawer"
          direction="right"
          open={openXl}
          onClose={() => setOpenXl(false)}
          onConfirm={() => setOpenXl(false)}
        />

        <Button onClick={() => setOpenFullscreen(true)}>Fullscreen</Button>
        <BaseDrawer
          size="fullscreen"
          title="Fullscreen Drawer"
          description="This drawer takes up the full viewport. Use the toggle button to switch between fullscreen and normal size."
          direction="right"
          open={openFullscreen}
          onClose={() => setOpenFullscreen(false)}
          onConfirm={() => setOpenFullscreen(false)}
        >
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Click the maximize/minimize button in the header to toggle fullscreen mode.
            </p>
          </div>
        </BaseDrawer>
      </div>
    );
  },
  args: {
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with fullscreen toggle functionality.
 */
export const WithFullscreenToggle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer with Toggle</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This drawer has a fullscreen toggle button in the header. Click it to switch between
              normal and fullscreen sizes.
            </p>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Toggle between current size and fullscreen</li>
                <li>Remembers your previous size when exiting fullscreen</li>
                <li>Works with all drawer directions</li>
              </ul>
            </div>
          </div>
        </BaseDrawer>
      </>
    );
  },
  args: {
    title: 'Drawer with Fullscreen Toggle',
    description: 'Use the toggle button to switch sizes',
    direction: 'right',
    size: 'md',
    showFullscreenToggle: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer without fullscreen toggle button.
 */
export const WithoutFullscreenToggle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Drawer without Toggle',
    description: 'This drawer does not have a fullscreen toggle button',
    direction: 'right',
    showFullscreenToggle: false,
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Drawer with a Select dropdown inside to verify Select works within drawer portal.
 */
export const WithSelect: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer with Select</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger title="Select category" className="mt-1 w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </BaseDrawer>
      </>
    );
  },
  args: {
    title: 'Form with Select',
    description: 'This drawer contains a Select dropdown',
    direction: 'right',
    onClose: () => {},
    onConfirm: () => {},
  },
};

/**
 * Test: Select component should work correctly inside BaseDrawer.
 */
export const SelectShouldWorkInDrawer: Story = {
  name: 'Select should work inside drawer',
  tags: ['!dev', '!autodocs'],
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <BaseDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        >
          <div className="py-4">
            <Select>
              <SelectTrigger title="Select fruit" className="w-full">
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </BaseDrawer>
      </>
    );
  },
  args: {
    title: 'Select Test',
    description: 'Testing Select inside drawer',
    direction: 'right',
    onClose: () => {},
    onConfirm: () => {},
  },
  play: async ({ canvasElement, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const select = await body.findByRole('combobox');

    await step('open select and pick an option', async () => {
      await userEvent.click(select);
      await userEvent.click(await body.findByRole('option', { name: /banana/i }));
      expect(select).toHaveTextContent('Banana');
    });

    await step('reopen and verify selected option is checked', async () => {
      await userEvent.click(select);
      const option = await body.findByRole('option', { name: /banana/i });
      expect(option).toHaveAttribute('data-state', 'checked');
      await userEvent.click(option);
    });
  },
};
