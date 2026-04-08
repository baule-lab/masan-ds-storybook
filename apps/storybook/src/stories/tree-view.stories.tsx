import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TreeView, type TreeDataItem } from '@masan-group/shared-ui/tree-view';
import { Folder, FolderOpen, File, FileText, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Button } from '@masan-group/shared-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@masan-group/shared-ui/dropdown-menu';

/**
 * A tree view component for displaying hierarchical data with support for selection,
 * expansion, icons, actions, and drag-and-drop functionality.
 */
const meta = {
  title: 'ui/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  argTypes: {
    expandAll: {
      control: 'boolean',
      description: 'Whether to expand all nodes initially',
    },
    initialSelectedItemId: {
      control: 'text',
      description: 'The ID of the initially selected item',
    },
  },
  args: {
    expandAll: false,
    initialSelectedItemId: undefined,
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TreeView>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample tree data
const basicTreeData: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    children: [
      {
        id: '1-1',
        name: 'Projects',
        children: [
          { id: '1-1-1', name: 'Project A' },
          { id: '1-1-2', name: 'Project B' },
        ],
      },
      {
        id: '1-2',
        name: 'Reports',
        children: [
          { id: '1-2-1', name: 'Q1 Report' },
          { id: '1-2-2', name: 'Q2 Report' },
        ],
      },
      { id: '1-3', name: 'Notes' },
    ],
  },
  {
    id: '2',
    name: 'Pictures',
    children: [
      { id: '2-1', name: 'Vacation' },
      { id: '2-2', name: 'Family' },
    ],
  },
  {
    id: '3',
    name: 'Videos',
    children: [
      { id: '3-1', name: 'Movies' },
      { id: '3-2', name: 'Shows' },
    ],
  },
];

/**
 * A basic tree view with nested items.
 */
export const Default: Story = {
  render: (args) => <TreeView {...args} data={basicTreeData} />,
};

const treeDataWithIcons: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    children: [
      {
        id: '1-1',
        name: 'Projects',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        children: [
          { id: '1-1-1', name: 'Project A', icon: FileText },
          { id: '1-1-2', name: 'Project B', icon: FileText },
        ],
      },
      {
        id: '1-2',
        name: 'Reports',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        children: [
          { id: '1-2-1', name: 'Q1 Report', icon: File },
          { id: '1-2-2', name: 'Q2 Report', icon: File },
        ],
      },
      { id: '1-3', name: 'Notes', icon: FileText },
    ],
  },
  {
    id: '2',
    name: 'Pictures',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    children: [
      { id: '2-1', name: 'Vacation', icon: File },
      { id: '2-2', name: 'Family', icon: File },
    ],
  },
];

/**
 * Tree view with custom icons for folders and files.
 */
export const WithIcons: Story = {
  render: (args) => (
    <TreeView {...args} data={treeDataWithIcons} defaultNodeIcon={Folder} defaultLeafIcon={File} />
  ),
};

const treeDataWithActions: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button {...props} variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    children: [
      {
        id: '1-1',
        name: 'Projects',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        actions: (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        children: [
          {
            id: '1-1-1',
            name: 'Project A',
            icon: FileText,
            actions: (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
          { id: '1-1-2', name: 'Project B', icon: FileText },
        ],
      },
      { id: '1-2', name: 'Reports', icon: Folder, openIcon: FolderOpen },
    ],
  },
];

/**
 * Tree view with action buttons that appear on hover or when selected.
 */
export const WithActions: Story = {
  render: (args) => (
    <TreeView
      {...args}
      data={treeDataWithActions}
      defaultNodeIcon={Folder}
      defaultLeafIcon={File}
    />
  ),
};

/**
 * Tree view with initial selection and expanded path.
 */
export const WithSelection: Story = {
  render: (args) => (
    <TreeView
      {...args}
      data={treeDataWithIcons}
      initialSelectedItemId="1-1-1"
      defaultNodeIcon={Folder}
      defaultLeafIcon={File}
      onSelectChange={(item) => {
        console.log('Selected:', item);
      }}
    />
  ),
  args: {
    initialSelectedItemId: '1-1-1',
  },
};

/**
 * Tree view with all nodes expanded initially.
 */
export const ExpandAll: Story = {
  render: (args) => (
    <TreeView
      {...args}
      data={treeDataWithIcons}
      expandAll
      defaultNodeIcon={Folder}
      defaultLeafIcon={File}
    />
  ),
  args: {
    expandAll: true,
  },
};

const treeDataWithDisabled: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    children: [
      {
        id: '1-1',
        name: 'Projects',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        children: [
          { id: '1-1-1', name: 'Project A', icon: FileText },
          { id: '1-1-2', name: 'Project B', icon: FileText, disabled: true },
        ],
      },
      {
        id: '1-2',
        name: 'Reports',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        disabled: true,
        children: [
          { id: '1-2-1', name: 'Q1 Report', icon: File },
          { id: '1-2-2', name: 'Q2 Report', icon: File },
        ],
      },
      { id: '1-3', name: 'Notes', icon: FileText, disabled: true },
    ],
  },
];

/**
 * Tree view with disabled items that cannot be selected or interacted with.
 */
export const WithDisabled: Story = {
  render: (args) => (
    <TreeView
      {...args}
      data={treeDataWithDisabled}
      defaultNodeIcon={Folder}
      defaultLeafIcon={File}
    />
  ),
};

const treeDataWithDragDrop: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    draggable: true,
    droppable: true,
    children: [
      {
        id: '1-1',
        name: 'Projects',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        draggable: true,
        droppable: true,
        children: [
          { id: '1-1-1', name: 'Project A', icon: FileText, draggable: true },
          { id: '1-1-2', name: 'Project B', icon: FileText, draggable: true },
        ],
      },
      {
        id: '1-2',
        name: 'Reports',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        draggable: true,
        droppable: true,
        children: [
          { id: '1-2-1', name: 'Q1 Report', icon: File, draggable: true },
          { id: '1-2-2', name: 'Q2 Report', icon: File, draggable: true },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Archive',
    icon: Folder,
    openIcon: FolderOpen,
    selectedIcon: FolderOpen,
    draggable: false,
    droppable: true,
    children: [],
  },
];

/**
 * Tree view with drag-and-drop functionality enabled.
 */
export const WithDragAndDrop: Story = {
  render: (args) => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        You can drag items to move them. Items with draggable enabled can be dragged, and items with
        droppable enabled can receive drops.
      </p>
      <TreeView
        {...args}
        data={treeDataWithDragDrop}
        defaultNodeIcon={Folder}
        defaultLeafIcon={File}
        onDocumentDrag={(source, target) => {
          console.log('Drag:', source.name, '→', target.name);
          alert(`Moved "${source.name}" to "${target.name}"`);
        }}
      />
    </div>
  ),
};

/**
 * Interactive test: Clicking items should select them.
 */
export const ShouldSelectOnClick: Story = {
  ...Default,
  name: 'when clicking items, should select them',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const treeItems = await canvas.findAllByRole('button', {
      name: /Documents|Projects|Project A/i,
    });

    // Click on "Documents"
    await userEvent.click(treeItems[0]);
    await waitFor(() => {
      expect(treeItems[0]).toHaveClass(/text-accent-foreground/);
    });

    // Expand "Documents" by clicking chevron
    const chevron = treeItems[0].querySelector('svg');
    if (chevron) {
      await userEvent.click(chevron);
    }

    // Wait for children to be visible
    await waitFor(() => {
      const projectsItem = canvas.getByText('Projects');
      expect(projectsItem).toBeInTheDocument();
    });

    // Click on "Projects"
    const projectsItem = canvas.getByText('Projects');
    await userEvent.click(projectsItem);
    await waitFor(() => {
      expect(projectsItem.closest('[role="button"]')).toHaveClass(/text-accent-foreground/);
    });
  },
};

/**
 * Single item tree view.
 */
export const SingleItem: Story = {
  render: (args) => (
    <TreeView
      {...args}
      data={{
        id: 'root',
        name: 'Root',
        icon: Folder,
        openIcon: FolderOpen,
        selectedIcon: FolderOpen,
        children: [
          { id: '1', name: 'Item 1', icon: File },
          { id: '2', name: 'Item 2', icon: File },
        ],
      }}
      defaultNodeIcon={Folder}
      defaultLeafIcon={File}
    />
  ),
};
