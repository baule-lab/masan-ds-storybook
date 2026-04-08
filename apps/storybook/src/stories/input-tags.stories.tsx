import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InputTags } from '@masan-group/shared-ui/input-tags';
import { Label } from '@masan-group/shared-ui/label';

const meta = {
  title: 'Custom Components/InputTags',
  component: InputTags,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of tag values',
      table: {
        category: 'controlled props',
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback when tags change',
      table: {
        category: 'controlled props',
      },
    },
    maxCount: {
      control: 'number',
      description:
        'Maximum number of tags to display before collapsing the rest into a "+N more" badge.',
      table: {
        category: 'layout',
      },
    },
    tagLabelMaxWidth: {
      control: 'text',
      description:
        'Maximum width (e.g. "120px") for a single tag label before it is truncated with ellipsis.',
      table: {
        category: 'layout',
      },
    },
    maxContainerHeight: {
      control: 'text',
      description:
        'Maximum height (e.g. "160px") for the wrapped tags container before vertical scrolling is enabled.',
      table: {
        category: 'layout',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when there are no tags.',
      table: {
        category: 'input',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When true, the input is disabled and tags cannot be added or removed.',
      table: {
        category: 'input',
      },
    },
    id: {
      control: 'text',
      description: 'HTML id attribute for the underlying input, useful for associating labels.',
      table: {
        category: 'accessibility',
      },
    },
    className: {
      control: 'text',
      description: 'Custom class name applied to the outer container.',
      table: {
        category: 'styling',
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputTags>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the input tags component.
 * Type a value and press Enter or comma to add a tag.
 */
export const Default: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['tag1@example.com', 'tag2@example.com']);
    return (
      <div className="w-96">
        <InputTags {...args} value={tags} onChange={setTags} placeholder="Add tags..." />
      </div>
    );
  },
};

/**
 * Empty state with no initial tags.
 */
export const Empty: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <InputTags {...args} value={tags} onChange={setTags} placeholder="Add tags..." />
      </div>
    );
  },
};

/**
 * Showcase many tags with `maxCount` to demonstrate the "+N more" behavior,
 * the tooltip preview of hidden tags when hovering the badge, and the ability
 * to clear extra tags.
 */
export const WithMaxCount: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>([
      'Product A',
      'Product B',
      'Product C',
      'Product D',
      'Product E',
      'Product F',
      'Product G',
    ]);

    return (
      <div className="w-96 space-y-2">
        <Label htmlFor="products-tags">Top products</Label>
        <InputTags
          {...args}
          id="products-tags"
          value={tags}
          onChange={setTags}
          placeholder="Add products..."
          maxCount={3}
        />
        <p className="text-foreground/60 text-sm">
          Only the first 3 tags are shown. Extra tags are collapsed into a &quot;+N more&quot; badge
          that shows a tooltip preview of the hidden tags on hover and can be cleared with the close
          button.
        </p>
      </div>
    );
  },
};

/**
 * Input tags with a label for better accessibility.
 */
export const WithLabel: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['admin@example.com']);
    return (
      <div className="w-96 space-y-2">
        <Label htmlFor="email-tags">Email Addresses</Label>
        <InputTags
          {...args}
          id="email-tags"
          value={tags}
          onChange={setTags}
          placeholder="Enter email addresses..."
        />
      </div>
    );
  },
};

/**
 * Input tags with helper text for additional guidance.
 */
export const WithHelperText: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96 space-y-2">
        <Label htmlFor="tags-helper">Tags</Label>
        <InputTags
          {...args}
          id="tags-helper"
          value={tags}
          onChange={setTags}
          placeholder="Add tags..."
        />
        <p className="text-foreground/60 text-sm">
          Press Enter, comma, or space to add a tag. Click the X to remove.
        </p>
      </div>
    );
  },
};

/**
 * Input tags where tag labels may be long, showcasing the `tagLabelMaxWidth`
 * truncation behavior.
 */
export const WithLongTags: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>([
      'Very long tag label that should be truncated nicely',
      'Another extremely verbose label that exceeds the usual width',
    ]);

    return (
      <div className="w-96 space-y-2">
        <Label htmlFor="long-tags">Long tags</Label>
        <InputTags
          {...args}
          id="long-tags"
          value={tags}
          onChange={setTags}
          placeholder="Add tags..."
          tagLabelMaxWidth="80px"
        />
        <p className="text-foreground/60 text-sm">
          Tags are truncated after a certain width to keep the layout compact.
        </p>
      </div>
    );
  },
};

/**
 * Input tags with many wrapped rows of tags and a constrained container
 * height to demonstrate vertical scrolling with `maxContainerHeight`.
 */
export const ScrollableContainer: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(
      Array.from({ length: 20 }, (_, index) => `Tag ${index + 1}`)
    );

    return (
      <div className="w-96 space-y-2">
        <Label htmlFor="scrollable-tags">Scrollable tags</Label>
        <InputTags
          {...args}
          id="scrollable-tags"
          value={tags}
          onChange={setTags}
          placeholder="Add tags..."
          maxContainerHeight="80px"
        />
        <p className="text-foreground/60 text-sm">
          The tag area becomes scrollable when there are many tags.
        </p>
      </div>
    );
  },
};

/**
 * Disabled state - user cannot add or remove tags.
 */
export const Disabled: Story = {
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['tag1', 'tag2', 'tag3']);
    return (
      <div className="w-96">
        <InputTags {...args} value={tags} onChange={setTags} disabled placeholder="Disabled..." />
      </div>
    );
  },
};

/**
 * Test: User can add tags by typing and pressing Enter.
 */
export const ShouldAddTagWithEnter: Story = {
  name: 'when user types and presses Enter, should add tag',
  tags: ['!dev', '!autodocs'],
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <div className="w-96">
        <InputTags {...args} value={tags} onChange={setTags} placeholder="Add tags..." />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Add tags...');

    await step('type a tag and press Enter', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'newtag@example.com{Enter}');
    });

    await step('verify tag was added', async () => {
      const badge = await canvas.findByText('newtag@example.com');
      expect(badge).toBeInTheDocument();
    });
  },
};

/**
 * Test: User can remove tags by clicking the X button.
 */
export const ShouldRemoveTag: Story = {
  name: 'when user clicks X button, should remove tag',
  tags: ['!dev', '!autodocs'],
  args: { value: [], onChange: () => {} },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['remove-me@example.com', 'keep-me@example.com']);
    return (
      <div className="w-96">
        <InputTags {...args} value={tags} onChange={setTags} placeholder="Add tags..." />
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('click X button on first tag', async () => {
      const badges = canvas.getAllByRole('button');
      // Find the remove button (not the Add button)
      const removeButtons = badges.filter((btn) => btn.querySelector('svg'));
      await userEvent.click(removeButtons[0]);
    });

    await step('verify tag was removed', async () => {
      expect(canvas.queryByText('remove-me@example.com')).not.toBeInTheDocument();
      expect(canvas.getByText('keep-me@example.com')).toBeInTheDocument();
    });
  },
};
