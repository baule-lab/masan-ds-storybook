import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ClickToEdit } from '@masan-group/shared-ui/click-to-edit';
import { Input } from '@masan-group/shared-ui/input';
import { Textarea } from '@masan-group/shared-ui/textarea';

/**
 * A generic click-to-edit wrapper that turns any child component into an
 * inline-editable field. Supports status feedback (success/warning/error),
 * dark theme, and configurable sizes.
 */
const meta = {
  title: 'Custom Components/ClickToEdit',
  component: ClickToEdit,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof ClickToEdit>;

export default meta;
type Story = StoryObj<Meta<typeof ClickToEdit>>;

/** Helper component wrapping ClickToEdit with local state for text input */
function TextEditDemo({
  initialValue = 'Click to edit this text',
  ...props
}: {
  initialValue?: string;
  status?: 'default' | 'success' | 'warning' | 'error';
  statusMessage?: string;
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  showEditIcon?: boolean;
  showActions?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [draft, setDraft] = useState(value);

  return (
    <div className="w-80">
      <ClickToEdit
        {...props}
        onEditStart={() => setDraft(value)}
        onConfirm={() => setValue(draft)}
        onCancel={() => setDraft(value)}
        renderEditor={({ onConfirm }) => (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
              }
            }}
          />
        )}
      >
        <span className="block truncate">{value}</span>
      </ClickToEdit>
    </div>
  );
}

/**
 * Default click-to-edit with a text input. Click the text or pencil icon to
 * enter edit mode.
 */
export const Default: Story = {
  render: () => <TextEditDemo />,
};

/**
 * Wrapping a Textarea component for multi-line editing.
 */
export const WithTextarea: Story = {
  render: () => {
    const TextareaDemo = () => {
      const [value, setValue] = useState('Multi-line content\nthat can be edited');
      const [draft, setDraft] = useState(value);

      return (
        <div className="w-96">
          <ClickToEdit
            onEditStart={() => setDraft(value)}
            onConfirm={() => setValue(draft)}
            onCancel={() => setDraft(value)}
            renderEditor={({ onConfirm }) => (
              <Textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) {
                    e.preventDefault();
                    onConfirm();
                  }
                }}
                rows={3}
              />
            )}
          >
            <p className="whitespace-pre-wrap">{value}</p>
          </ClickToEdit>
        </div>
      );
    };
    return <TextareaDemo />;
  },
};

/**
 * All three size variants side by side.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-muted-foreground text-xs">Small</p>
        <TextEditDemo size="sm" initialValue="Small size" />
      </div>
      <div>
        <p className="mb-1 text-muted-foreground text-xs">Default</p>
        <TextEditDemo size="default" initialValue="Default size" />
      </div>
      <div>
        <p className="mb-1 text-muted-foreground text-xs">Large</p>
        <TextEditDemo size="lg" initialValue="Large size" />
      </div>
    </div>
  ),
};

/**
 * Success status with a confirmation message.
 */
export const StatusSuccess: Story = {
  render: () => <TextEditDemo status="success" statusMessage="Value saved successfully" />,
};

/**
 * Warning status with an advisory message.
 */
export const StatusWarning: Story = {
  render: () => <TextEditDemo status="warning" statusMessage="Value exceeds recommended limit" />,
};

/**
 * Error status with a validation message.
 */
export const StatusError: Story = {
  render: () => <TextEditDemo status="error" statusMessage="This field is required" />,
};

/**
 * Disabled state — editing is not possible.
 */
export const Disabled: Story = {
  render: () => <TextEditDemo disabled />,
};

/**
 * Controlled editing state — parent manages the isEditing flag.
 */
export const Controlled: Story = {
  render: () => {
    const ControlledDemo = () => {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState('Controlled mode');
      const [draft, setDraft] = useState(value);

      return (
        <div className="flex w-80 flex-col gap-2">
          <ClickToEdit
            isEditing={isEditing}
            onEditStart={() => {
              setDraft(value);
              setIsEditing(true);
            }}
            onConfirm={() => {
              setValue(draft);
              setIsEditing(false);
            }}
            onCancel={() => {
              setDraft(value);
              setIsEditing(false);
            }}
            renderEditor={() => (
              <Input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} />
            )}
          >
            <span>{value}</span>
          </ClickToEdit>
          <p className="text-muted-foreground text-xs">isEditing: {String(isEditing)}</p>
        </div>
      );
    };
    return <ControlledDemo />;
  },
};

/**
 * Without the edit pencil icon — only clicking the content triggers edit mode.
 */
export const WithoutEditIcon: Story = {
  render: () => <TextEditDemo showEditIcon={false} />,
};

/**
 * Without confirm/cancel action buttons — the editor must handle Enter to
 * confirm. Escape to cancel is handled by the wrapper automatically.
 */
export const WithoutActions: Story = {
  render: () => {
    const NoActionsDemo = () => {
      const [value, setValue] = useState('Press Enter to confirm, Escape to cancel');
      const [draft, setDraft] = useState(value);

      return (
        <div className="w-80">
          <ClickToEdit
            showActions={false}
            onEditStart={() => setDraft(value)}
            onConfirm={() => setValue(draft)}
            onCancel={() => setDraft(value)}
            renderEditor={({ onConfirm }) => (
              <Input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onConfirm();
                  }
                }}
              />
            )}
          >
            <span className="block truncate">{value}</span>
          </ClickToEdit>
        </div>
      );
    };
    return <NoActionsDemo />;
  },
};
