import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonList,
  SkeletonForm,
  SkeletonAvatar,
  SkeletonText,
  SkeletonImage,
  SkeletonButton,
  SkeletonPage,
  SkeletonDataCard,
  SkeletonBadge,
  SkeletonInput,
  SkeletonSelect,
  SkeletonTabs,
  SkeletonDialog,
  SkeletonBreadcrumb,
  SkeletonTimeline,
  SkeletonCarousel,
} from '@masan-group/shared-ui/skeletons';

/**
 * Comprehensive skeleton components for loading states.
 * Use these components to show placeholder content while data is being loaded.
 */
const meta = {
  title: 'Custom Components/Skeletons',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Card skeleton - Used for card components with optional image, header, description, and footer.
 */
export const Card: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard showImage={false} />
      <SkeletonCard showFooter={false} lines={4} />
    </div>
  ),
};

/**
 * Table skeleton - Used for data tables with customizable rows and columns.
 */
export const Table: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default Table</h3>
        <SkeletonTable />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Without Pagination</h3>
        <SkeletonTable showPagination={false} rows={3} />
      </div>
    </div>
  ),
};

/**
 * Chart skeletons - Used for different types of charts (bar, line, pie, area).
 */
export const Chart: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <SkeletonChart type="bar" />
      <SkeletonChart type="line" />
      <SkeletonChart type="pie" showLegend={false} />
      <SkeletonChart type="area" />
    </div>
  ),
};

/**
 * List skeleton - Used for list views with avatars and multiple lines of text.
 */
export const List: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Avatar</h3>
        <SkeletonList items={3} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Icon</h3>
        <SkeletonList items={3} showAvatar={false} showIcon={true} />
      </div>
    </div>
  ),
};

/**
 * Form skeleton - Used for form loading states.
 */
export const Form: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default Form</h3>
        <SkeletonForm />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Simple Form</h3>
        <SkeletonForm fields={2} showCancelButton={false} />
      </div>
    </div>
  ),
};

/**
 * Avatar skeletons - Different sizes and shapes.
 */
export const Avatar: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Circle Avatars</h3>
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" />
        </div>
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Square Avatars</h3>
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="sm" shape="square" />
          <SkeletonAvatar size="md" shape="square" />
          <SkeletonAvatar size="lg" shape="square" />
          <SkeletonAvatar size="xl" shape="square" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Text skeletons - For different text content types.
 */
export const Text: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Heading</h3>
        <SkeletonText variant="heading" lines={2} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Paragraph</h3>
        <SkeletonText variant="paragraph" lines={4} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Caption</h3>
        <SkeletonText variant="caption" lines={2} />
      </div>
    </div>
  ),
};

/**
 * Image skeletons - Different aspect ratios.
 */
export const Image: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Square</h3>
        <SkeletonImage aspectRatio="square" />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Video (16:9)</h3>
        <SkeletonImage aspectRatio="video" />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Portrait (3:4)</h3>
        <SkeletonImage aspectRatio="portrait" />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Wide (21:9)</h3>
        <SkeletonImage aspectRatio="wide" />
      </div>
    </div>
  ),
};

/**
 * Button skeletons - Different sizes and variants.
 */
export const Button: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default Buttons</h3>
        <div className="flex items-center gap-4">
          <SkeletonButton size="sm" />
          <SkeletonButton size="md" />
          <SkeletonButton size="lg" />
        </div>
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Icon Buttons</h3>
        <div className="flex items-center gap-4">
          <SkeletonButton size="sm" variant="icon" />
          <SkeletonButton size="md" variant="icon" />
          <SkeletonButton size="lg" variant="icon" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Data Card skeleton - For metric/stat cards with optional icon and trend.
 */
export const DataCard: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <SkeletonDataCard />
      <SkeletonDataCard showIcon={false} />
      <SkeletonDataCard showTrend={false} />
      <SkeletonDataCard showIcon={false} showTrend={false} />
    </div>
  ),
};

/**
 * Page skeletons - Full page layouts.
 */
export const Page: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default Layout</h3>
        <SkeletonPage layout="default" />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Sidebar Layout</h3>
        <SkeletonPage layout="sidebar" />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Dashboard Layout</h3>
        <SkeletonPage layout="dashboard" />
      </div>
    </div>
  ),
};

/**
 * Complete example - A full page with multiple skeleton components.
 */
export const CompleteExample: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonText variant="heading" lines={1} className="w-48" />
          <SkeletonText variant="caption" lines={1} className="w-64" />
        </div>
        <div className="flex gap-2">
          <SkeletonButton size="md" />
          <SkeletonButton size="md" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonDataCard />
        <SkeletonDataCard />
        <SkeletonDataCard />
        <SkeletonDataCard />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonChart type="bar" />
        <SkeletonChart type="line" />
      </div>

      {/* Table */}
      <SkeletonTable rows={5} columns={5} />
    </div>
  ),
};

/**
 * Profile Page Example - A complete profile page skeleton.
 */
export const ProfilePageExample: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6 rounded-lg border border-border bg-card p-6">
        <SkeletonAvatar size="xl" />
        <div className="flex-1 space-y-4">
          <SkeletonText variant="heading" lines={1} className="w-48" />
          <SkeletonText variant="paragraph" lines={2} />
          <div className="flex gap-2">
            <SkeletonButton size="md" />
            <SkeletonButton size="md" variant="icon" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-4">
          <SkeletonCard showImage={false} showFooter={false} lines={5} />
          <SkeletonCard showImage={false} showFooter={false} lines={3} />
        </div>

        {/* Main Content */}
        <div className="space-y-4 md:col-span-2">
          <SkeletonList items={4} />
        </div>
      </div>
    </div>
  ),
};

/**
 * E-commerce Product Page Example.
 */
export const ProductPageExample: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        <SkeletonImage aspectRatio="square" />
        <div className="grid grid-cols-4 gap-2">
          <SkeletonImage aspectRatio="square" />
          <SkeletonImage aspectRatio="square" />
          <SkeletonImage aspectRatio="square" />
          <SkeletonImage aspectRatio="square" />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div className="space-y-3">
          <SkeletonText variant="heading" lines={1} />
          <div className="flex items-center gap-4">
            <SkeletonText variant="paragraph" lines={1} className="w-24" />
            <SkeletonText variant="caption" lines={1} className="w-32" />
          </div>
        </div>

        <SkeletonText variant="paragraph" lines={4} />

        <div className="space-y-3">
          <SkeletonText variant="paragraph" lines={1} className="w-20" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonButton key={i} size="sm" variant="icon" />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <SkeletonButton size="lg" className="flex-1" />
          <SkeletonButton size="lg" variant="icon" />
        </div>

        <SkeletonCard showImage={false} showFooter={false} lines={3} />
      </div>
    </div>
  ),
};

/**
 * Badge skeletons - Different sizes for tags and labels.
 */
export const Badge: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Badge Sizes</h3>
        <div className="flex items-center gap-4">
          <SkeletonBadge size="sm" />
          <SkeletonBadge size="md" />
          <SkeletonBadge size="lg" />
        </div>
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Multiple Badges</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBadge key={i} size="md" />
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * Input skeletons - For form input fields.
 */
export const Input: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Label</h3>
        <SkeletonInput />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Label and Helper</h3>
        <SkeletonInput showHelper />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Different Sizes</h3>
        <div className="space-y-4">
          <SkeletonInput size="sm" />
          <SkeletonInput size="md" />
          <SkeletonInput size="lg" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Select skeletons - For dropdown/select fields.
 */
export const Select: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Label</h3>
        <SkeletonSelect />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Different Sizes</h3>
        <div className="space-y-4">
          <SkeletonSelect size="sm" />
          <SkeletonSelect size="md" />
          <SkeletonSelect size="lg" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Tabs skeletons - For tabbed navigation.
 */
export const Tabs: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-lg">With Content</h3>
        <SkeletonTabs />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Only Headers</h3>
        <SkeletonTabs showContent={false} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">More Tabs</h3>
        <SkeletonTabs tabs={5} />
      </div>
    </div>
  ),
};

/**
 * Dialog skeletons - For modal/dialog windows.
 */
export const Dialog: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg">
        <h3 className="mb-4 font-semibold text-lg">Full Dialog</h3>
        <SkeletonDialog />
      </div>
      <div className="mx-auto max-w-lg">
        <h3 className="mb-4 font-semibold text-lg">Simple Dialog</h3>
        <SkeletonDialog showFooter={false} contentLines={3} />
      </div>
    </div>
  ),
};

/**
 * Breadcrumb skeletons - For navigation breadcrumbs.
 */
export const Breadcrumb: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default Breadcrumb</h3>
        <SkeletonBreadcrumb />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Short Breadcrumb</h3>
        <SkeletonBreadcrumb items={2} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Long Breadcrumb</h3>
        <SkeletonBreadcrumb items={5} />
      </div>
    </div>
  ),
};

/**
 * Timeline skeletons - For timeline/activity feeds.
 */
export const Timeline: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h3 className="mb-4 font-semibold text-lg">With Icons</h3>
        <SkeletonTimeline items={3} />
      </div>
      <div className="max-w-2xl">
        <h3 className="mb-4 font-semibold text-lg">Simple Dots</h3>
        <SkeletonTimeline items={4} showIcon={false} />
      </div>
    </div>
  ),
};

/**
 * Carousel skeletons - For image carousels/sliders.
 */
export const Carousel: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h3 className="mb-4 font-semibold text-lg">Full Carousel</h3>
        <SkeletonCarousel />
      </div>
      <div className="max-w-3xl">
        <h3 className="mb-4 font-semibold text-lg">Without Controls</h3>
        <SkeletonCarousel showControls={false} />
      </div>
      <div className="max-w-3xl">
        <h3 className="mb-4 font-semibold text-lg">Square Carousel</h3>
        <SkeletonCarousel aspectRatio="square" items={5} />
      </div>
    </div>
  ),
};

/**
 * Form Builder Example - Complete form with various input types.
 */
export const FormBuilderExample: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <SkeletonText variant="heading" lines={1} className="w-48" />
        <SkeletonText variant="caption" lines={1} className="w-96" />
      </div>

      <SkeletonBreadcrumb items={3} />

      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <SkeletonInput showHelper />
        <SkeletonInput showHelper />
        <SkeletonSelect />
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonInput />
          <SkeletonInput />
        </div>
        <SkeletonInput size="lg" />

        <div className="flex gap-2 pt-4">
          <SkeletonButton size="lg" />
          <SkeletonButton size="lg" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Activity Feed Example - Timeline with various elements.
 */
export const ActivityFeedExample: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Sidebar */}
      <div className="space-y-4">
        <SkeletonText variant="heading" lines={1} className="w-32" />
        <SkeletonCard showImage={false} showFooter={false} lines={4} />
        <div className="flex flex-wrap gap-2">
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
      </div>

      {/* Timeline */}
      <div className="md:col-span-2">
        <SkeletonText variant="heading" lines={1} className="mb-6 w-48" />
        <SkeletonTimeline items={5} />
      </div>
    </div>
  ),
};

/**
 * Gallery Example - Image carousel with thumbnails.
 */
export const GalleryExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonText variant="heading" lines={1} className="w-48" />
        <div className="flex gap-2">
          <SkeletonButton size="md" variant="icon" />
          <SkeletonButton size="md" variant="icon" />
        </div>
      </div>

      <SkeletonCarousel aspectRatio="wide" items={5} />

      <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonImage key={i} aspectRatio="square" />
        ))}
      </div>
    </div>
  ),
};
