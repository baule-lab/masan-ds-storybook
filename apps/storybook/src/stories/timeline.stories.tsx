import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, GitPullRequest, GitBranch, Calendar, Star, AlertCircle, Clock } from 'lucide-react';

import { Timeline, TimelineItem, TimelineLayout } from '@masan-group/shared-ui/timeline';

const defaultItems = [
  {
    id: 1,
    date: '2024-01-01',
    title: 'Project Started',
    description: 'Initial project setup and configuration completed.',
    status: 'completed' as const,
  },
  {
    id: 2,
    date: '2024-02-01',
    title: 'Design Phase',
    description: 'UI/UX design completed and approved by the design team.',
    status: 'completed' as const,
  },
  {
    id: 3,
    date: '2024-03-01',
    title: 'Development',
    description: 'Core features actively being developed.',
    status: 'in-progress' as const,
  },
  {
    id: 4,
    date: '2024-04-01',
    title: 'Testing',
    description: 'QA testing phase scheduled to begin.',
    status: 'pending' as const,
  },
  {
    id: 5,
    date: '2024-05-01',
    title: 'Release',
    description: 'Production deployment awaiting final approvals.',
    status: 'pending' as const,
  },
];

const stateItems = [
  {
    id: 1,
    date: '2024-01-01',
    title: 'Completed Task',
    description: 'This task has been completed.',
    status: 'completed' as const,
  },
  {
    id: 2,
    date: '2024-01-02',
    title: 'In Progress Task',
    description: 'This task is currently being worked on.',
    status: 'in-progress' as const,
  },
  {
    id: 3,
    date: '2024-01-03',
    title: 'Pending Task',
    description: 'This task is awaiting resources.',
    status: 'pending' as const,
  },
];

const loadingItems = [
  { id: 1, date: '', title: '', description: '', loading: true },
  { id: 2, date: '', title: '', description: '', loading: true },
  { id: 3, date: '', title: '', description: '', loading: true },
];

const errorItems = [
  {
    id: 1,
    date: '2024-01-02',
    title: 'Failed Event',
    description: '',
    error: 'Connection timeout — please retry.',
  },
];

const createCustomItems = (count: number, overrides: Record<string, unknown> = {}) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: `2024-${String(i + 1).padStart(2, '0')}-01`,
    title: `Event ${i + 1}`,
    description: `Description for event ${i + 1}.`,
    status: 'pending' as const,
    ...overrides,
  }));

/**
 * A vertical timeline component for displaying chronological events with support for
 * different states, colors, icons, and animations.
 */
const meta: Meta<typeof Timeline> = {
  title: 'ui/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic timeline with default styling showing three events.
 */
export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01"
        title="First Event"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        icon={<Check className="h-4 w-4" />}
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-02-01"
        title="Second Event"
        description="Aut eius excepturi ex recusandae eius est minima molestiae."
        icon={<GitPullRequest className="h-4 w-4" />}
        status="in-progress"
        iconColor="secondary"
      />
      <TimelineItem
        date="2024-03-01"
        title="Third Event"
        description="Sit culpa quas ex nulla animi qui deleniti minus."
        icon={<GitBranch className="h-4 w-4" />}
        status="pending"
        iconColor="muted"
      />
    </Timeline>
  ),
};

/**
 * Small size timeline with compact spacing and smaller icons.
 */
export const SmallSize: Story = {
  render: () => (
    <Timeline size="sm" iconsize="sm">
      <TimelineItem
        date="2024-01-01"
        title="First Event"
        description="Small timeline with compact spacing."
        icon={<Check className="h-3 w-3" />}
        status="completed"
      />
      <TimelineItem
        date="2024-02-01"
        title="Second Event"
        description="Smaller icons and reduced gaps."
        icon={<GitPullRequest className="h-3 w-3" />}
        status="in-progress"
      />
      <TimelineItem
        date="2024-03-01"
        title="Third Event"
        description="Optimized for dense layouts."
        icon={<GitBranch className="h-3 w-3" />}
        status="pending"
      />
    </Timeline>
  ),
};

/**
 * Medium size timeline (default sizing).
 */
export const MediumSize: Story = {
  render: () => (
    <Timeline size="md" iconsize="md">
      <TimelineItem
        date="2024-01-01"
        title="First Event"
        description="Medium timeline with balanced spacing."
        icon={<Check className="h-4 w-4" />}
        status="completed"
      />
      <TimelineItem
        date="2024-02-01"
        title="Second Event"
        description="Default size for most use cases."
        icon={<GitPullRequest className="h-4 w-4" />}
        status="in-progress"
      />
      <TimelineItem
        date="2024-03-01"
        title="Third Event"
        description="Provides good readability."
        icon={<GitBranch className="h-4 w-4" />}
        status="pending"
      />
    </Timeline>
  ),
};

/**
 * Large size timeline with generous spacing and larger icons.
 */
export const LargeSize: Story = {
  render: () => (
    <Timeline size="lg" iconsize="lg">
      <TimelineItem
        date="2024-01-01"
        title="First Event"
        description="Large timeline with generous spacing for prominent displays."
        icon={<Check className="h-5 w-5" />}
        status="completed"
      />
      <TimelineItem
        date="2024-02-01"
        title="Second Event"
        description="Larger icons and increased gaps for better visibility."
        icon={<GitPullRequest className="h-5 w-5" />}
        status="in-progress"
      />
      <TimelineItem
        date="2024-03-01"
        title="Third Event"
        description="Best for landing pages and feature showcases."
        icon={<GitBranch className="h-5 w-5" />}
        status="pending"
      />
    </Timeline>
  ),
};

/**
 * Timeline demonstrating all three status states: completed, in-progress, and pending.
 */
export const StatusStates: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-15"
        title="Completed Task"
        description="This task has been completed successfully with all requirements met."
        icon={<Check className="h-4 w-4" />}
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-01-16"
        title="In Progress Task"
        description="This task is currently being worked on and is actively in progress."
        icon={<Clock className="h-4 w-4" />}
        status="in-progress"
        iconColor="secondary"
      />
      <TimelineItem
        date="2024-01-17"
        title="Pending Task"
        description="This task is scheduled to start soon and is awaiting resources."
        icon={<Calendar className="h-4 w-4" />}
        status="pending"
        iconColor="muted"
      />
    </Timeline>
  ),
};

/**
 * Timeline with primary color theme (default).
 */
export const PrimaryColor: Story = {
  render: () => (
    <Timeline>
      {defaultItems.slice(0, 3).map((item) => (
        <TimelineItem
          key={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          icon={item.icon}
          iconColor="primary"
          status="completed"
        />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline with secondary color theme.
 */
export const SecondaryColor: Story = {
  render: () => (
    <Timeline>
      {defaultItems.slice(0, 3).map((item) => (
        <TimelineItem
          key={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          icon={item.icon}
          iconColor="secondary"
          status="completed"
        />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline with muted color theme for subtle displays.
 */
export const MutedColor: Story = {
  render: () => (
    <Timeline>
      {defaultItems.slice(0, 3).map((item) => (
        <TimelineItem
          key={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          icon={item.icon}
          iconColor="muted"
          status="completed"
        />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline with accent color theme.
 */
export const AccentColor: Story = {
  render: () => (
    <Timeline>
      {defaultItems.slice(0, 3).map((item) => (
        <TimelineItem
          key={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          icon={item.icon}
          iconColor="accent"
          status="completed"
        />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline with destructive color theme for error or warning states.
 */
export const DestructiveColor: Story = {
  render: () => (
    <Timeline>
      {defaultItems.slice(0, 3).map((item) => (
        <TimelineItem
          key={item.id}
          date={item.date}
          title={item.title}
          description={item.description}
          icon={<AlertCircle className="h-4 w-4" />}
          iconColor="destructive"
          status="completed"
        />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline with custom icons for each item demonstrating icon flexibility.
 */
export const CustomIcons: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01"
        title="Project Started"
        description="Initial project setup and configuration completed."
        icon={<Star className="h-4 w-4" />}
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-02-01"
        title="Pull Request Created"
        description="New feature branch merged into development."
        icon={<GitPullRequest className="h-4 w-4" />}
        status="completed"
        iconColor="secondary"
      />
      <TimelineItem
        date="2024-03-01"
        title="Branch Created"
        description="Feature branch created for new development."
        icon={<GitBranch className="h-4 w-4" />}
        status="in-progress"
        iconColor="accent"
      />
      <TimelineItem
        date="2024-04-01"
        title="Milestone Scheduled"
        description="Next major release scheduled for review."
        icon={<Calendar className="h-4 w-4" />}
        status="pending"
        iconColor="muted"
      />
    </Timeline>
  ),
};

/**
 * Timeline showing loading state with skeleton UI.
 */
export const LoadingState: Story = {
  render: () => (
    <Timeline>
      {loadingItems.map((item) => (
        <TimelineItem key={item.id} loading={true} />
      ))}
    </Timeline>
  ),
};

/**
 * Timeline showing error state with error message.
 */
export const ErrorState: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01"
        title="Normal Event"
        description="This event loaded successfully."
        icon={<Check className="h-4 w-4" />}
        status="completed"
      />
      {errorItems.map((item) => (
        <TimelineItem key={item.id} date={item.date} title={item.title} error={item.error} />
      ))}
      <TimelineItem
        date="2024-01-03"
        title="Another Normal Event"
        description="This event also loaded successfully."
        icon={<Check className="h-4 w-4" />}
        status="completed"
      />
    </Timeline>
  ),
};

/**
 * Empty timeline showing the empty state message.
 */
export const EmptyState: Story = {
  render: () => <Timeline />,
};

/**
 * Timeline with custom empty state message.
 */
export const CustomEmptyState: Story = {
  render: () => <Timeline>{/* No items provided intentionally to trigger empty state */}</Timeline>,
};

/**
 * Animated timeline using TimelineLayout component with staggered animation.
 */
export const AnimatedLayout: Story = {
  render: () => <TimelineLayout items={defaultItems} size="md" animate={true} />,
};

/**
 * Timeline layout without animation for performance-sensitive contexts.
 */
export const NoAnimation: Story = {
  render: () => <TimelineLayout items={defaultItems} size="md" animate={false} />,
};

/**
 * Complex real-world timeline with mixed states, colors, and icons.
 */
export const MixedStates: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01"
        title="Project Kickoff"
        description="Project successfully initiated with stakeholder approval and resources allocated."
        icon={<Star className="h-4 w-4" />}
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-01-15"
        title="Design Phase Complete"
        description="UI/UX design completed and approved by design team."
        icon={<Check className="h-4 w-4" />}
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-02-01"
        title="Development In Progress"
        description="Active development of core features with 60% completion."
        icon={<GitPullRequest className="h-4 w-4" />}
        status="in-progress"
        iconColor="secondary"
      />
      <TimelineItem
        date="2024-02-15"
        title="Code Review Scheduled"
        description="Comprehensive code review scheduled for next week."
        icon={<Calendar className="h-4 w-4" />}
        status="pending"
        iconColor="accent"
      />
      <TimelineItem
        date="2024-03-01"
        title="Testing Phase"
        description="QA testing phase to begin after code review completion."
        icon={<Clock className="h-4 w-4" />}
        status="pending"
        iconColor="muted"
      />
      <TimelineItem
        date="2024-03-15"
        title="Deployment Pending"
        description="Production deployment awaiting final approvals."
        icon={<GitBranch className="h-4 w-4" />}
        status="pending"
        iconColor="muted"
      />
    </Timeline>
  ),
};

/**
 * Timeline with custom date formatting.
 */
export const CustomDateFormat: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01T10:00:00Z"
        title="Event with Timestamp"
        description="Timeline supports ISO date strings with time information."
        icon={<Clock className="h-4 w-4" />}
        status="completed"
      />
      <TimelineItem
        date="2024-02-15"
        title="Event with Date Only"
        description="Standard date format without time component."
        icon={<Calendar className="h-4 w-4" />}
        status="completed"
      />
      <TimelineItem
        date={new Date().toISOString()}
        title="Current Time"
        description="Timeline can accept Date objects converted to ISO strings."
        icon={<Star className="h-4 w-4" />}
        status="in-progress"
      />
    </Timeline>
  ),
};

/**
 * Timeline with many items to demonstrate scrolling behavior.
 */
export const ManyItems: Story = {
  render: () => (
    <TimelineLayout
      items={createCustomItems(10, { status: 'completed' })}
      size="sm"
      animate={true}
    />
  ),
};

/**
 * Timeline without icons showing minimal design.
 */
export const WithoutIcons: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024-01-01"
        title="First Event"
        description="Timeline without custom icons uses default dot indicators."
        status="completed"
        iconColor="primary"
      />
      <TimelineItem
        date="2024-02-01"
        title="Second Event"
        description="Clean minimal design focusing on content."
        status="in-progress"
        iconColor="secondary"
      />
      <TimelineItem
        date="2024-03-01"
        title="Third Event"
        description="Suitable for text-heavy timelines."
        status="pending"
        iconColor="muted"
      />
    </Timeline>
  ),
};
