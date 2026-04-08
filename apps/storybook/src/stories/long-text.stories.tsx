// External
import type { Meta, StoryObj } from '@storybook/react-vite';

// Workspace
import { LongText } from '@masan-group/shared-ui/long-text';
import { Card, CardContent, CardHeader, CardTitle } from '@masan-group/shared-ui/card';

const LONG_TEXT =
  'This is a very long text that will be truncated when it exceeds the container width. Hover over it to see the full content.';

const SHORT_TEXT = 'Short text — no overflow here.';

/**
 * Truncates long text and reveals it via tooltip (desktop) / popover (mobile), a
 * smooth left-scroll animation on hover, or natural text wrapping.
 *
 * The container always fills 100 % of its parent — width is controlled by the
 * parent layout, not by a fixed `maxWidth` prop.
 *
 * | `mode`      | Behaviour |
 * |-------------|-----------|
 * | `tooltip`   | Truncates; shows full text in a tooltip (desktop) or popover (mobile). **Default.** |
 * | `translate` | Truncates; on hover the text scrolls left to reveal itself. |
 * | `wrap`      | Text wraps normally — no truncation. |
 */
const meta = {
  title: 'Custom Components/LongText',
  component: LongText,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['tooltip', 'translate', 'wrap'],
      description: 'Display mode for overflowing text.',
      table: { defaultValue: { summary: 'tooltip' } },
    },
    speed: {
      control: { type: 'number', min: 10, max: 300, step: 10 },
      description: 'Scroll speed in px/s (translate mode only).',
      table: { defaultValue: { summary: '50' } },
    },
    className: {
      control: 'text',
      description: 'Extra CSS classes for the text container.',
    },
    contentClassName: {
      control: 'text',
      description: 'Extra CSS classes for the tooltip/popover content.',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    children: LONG_TEXT,
  },
} satisfies Meta<typeof LongText>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────────────────────
// Tooltip mode (default)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default mode: text is truncated; hovering on desktop shows a tooltip, tapping
 * on mobile shows a popover. The container adapts to any parent width.
 */
export const Default: Story = {
  render: () => (
    <div className="w-64">
      <LongText>{LONG_TEXT}</LongText>
    </div>
  ),
};

/**
 * When the text fits inside the container no tooltip is shown.
 */
export const ShortText: Story = {
  render: () => (
    <div className="w-64">
      <LongText>{SHORT_TEXT}</LongText>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Translate mode
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translate mode: the text is truncated at rest. On hover it scrolls left to
 * reveal the full content, then snaps back when the cursor leaves.
 */
export const TranslateMode: Story = {
  render: () => (
    <div className="w-64">
      <LongText mode="translate">{LONG_TEXT}</LongText>
    </div>
  ),
};

/**
 * Adjust `speed` (px/s) to control how fast the text scrolls. Lower = slower.
 */
export const TranslateSlowSpeed: Story = {
  name: 'Translate — slow speed (20 px/s)',
  render: () => (
    <div className="w-64">
      <LongText mode="translate" speed={20}>
        {LONG_TEXT}
      </LongText>
    </div>
  ),
};

/**
 * Higher `speed` scrolls through the text faster.
 */
export const TranslateFastSpeed: Story = {
  name: 'Translate — fast speed (150 px/s)',
  render: () => (
    <div className="w-64">
      <LongText mode="translate" speed={150}>
        {LONG_TEXT}
      </LongText>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Wrap mode
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrap mode: no truncation — the text reflows on to multiple lines.
 */
export const WrapMode: Story = {
  render: () => (
    <div className="w-64">
      <LongText mode="wrap">{LONG_TEXT}</LongText>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// All modes side-by-side
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All three modes displayed side-by-side for easy comparison.
 */
export const AllModes: Story = {
  render: () => (
    <div className="w-72 space-y-6">
      {(['tooltip', 'translate', 'wrap'] as const).map((mode) => (
        <div key={mode}>
          <p className="mb-1 font-mono text-muted-foreground text-xs">mode="{mode}"</p>
          <LongText mode={mode}>{LONG_TEXT}</LongText>
        </div>
      ))}
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Real-world layouts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inside a table — width is constrained by the `max-w-xs` on the `<td>`.
 */
export const InTableCell: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">Product A</td>
            <td className="max-w-xs p-2">
              <LongText>
                This is a very detailed product description that contains a lot of information about
                the features, specifications, and benefits of the product.
              </LongText>
            </td>
            <td className="p-2">Active</td>
          </tr>
          <tr className="border-b">
            <td className="p-2">Product B</td>
            <td className="max-w-xs p-2">
              <LongText>Short description</LongText>
            </td>
            <td className="p-2">Inactive</td>
          </tr>
          <tr className="border-b">
            <td className="p-2">Product C</td>
            <td className="max-w-xs p-2">
              <LongText mode="translate">
                Another extremely long description with multiple sentences explaining various
                aspects of the product including usage, benefits, and technical specifications.
              </LongText>
            </td>
            <td className="p-2">Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Inside a card — each field uses the mode best suited to its content.
 */
export const InCard: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1 font-medium text-sm">Name (tooltip)</p>
            <LongText className="text-muted-foreground text-sm">
              Premium Wireless Bluetooth Headphones with Active Noise Cancellation
            </LongText>
          </div>
          <div>
            <p className="mb-1 font-medium text-sm">SKU (translate)</p>
            <LongText mode="translate" className="text-muted-foreground text-sm">
              WH-1000XM5-PREMIUM-BLACK-2024-Q1-SPECIAL-EDITION
            </LongText>
          </div>
          <div>
            <p className="mb-1 font-medium text-sm">Description (wrap)</p>
            <LongText mode="wrap" className="text-muted-foreground text-sm">
              Experience superior sound quality with advanced active noise cancellation, 40-hour
              battery life, and comfortable over-ear design.
            </LongText>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Behaviour at various parent widths — resize the Storybook canvas to observe
 * auto-truncation and re-detection.
 */
export const ResponsiveWidth: Story = {
  render: () => (
    <div className="space-y-6">
      {[32, 48, 64, 96].map((w) => (
        <div key={w}>
          <p className="mb-1 font-mono text-muted-foreground text-xs">w-{w}</p>
          <div className={`w-${w}`}>
            <LongText>{LONG_TEXT}</LongText>
          </div>
        </div>
      ))}
    </div>
  ),
};
