import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { action } from 'storybook/actions';

import { TreeMultipleSelect } from '@masan-group/shared-ui/patterns/tree-select';
import type { TreeSelectItem, TreeSelectRef } from '@masan-group/shared-ui/patterns/tree-select';
import { Button } from '@masan-group/shared-ui/ui/actions/button';
import { Label } from '@masan-group/shared-ui/ui/display/label';

const meta = {
  title: 'Custom Components/TreeMultipleSelect',
  component: TreeMultipleSelect,
  tags: ['autodocs'],
  argTypes: {
    treeData: {
      control: false,
      description: 'Hierarchical data to render in the tree. Each node is a `TreeSelectItem`.',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire component',
    },
    disableSelectAll: {
      control: 'boolean',
      description: 'Hide the Select All action',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no values are selected',
    },
    badgeLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for badge labels (e.g., "120px")',
    },
    optionLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for option labels in dropdown (e.g., "200px")',
    },
    maxCount: {
      control: 'number',
      description: 'Maximum number of badges to show before summarizing the rest as "+ N more".',
    },
    autoSize: {
      control: 'boolean',
      description:
        'When true, the trigger width adapts to its content instead of filling the container.',
    },
    responsive: {
      control: 'boolean',
      description:
        'Enable default responsive behavior for different screen sizes. For advanced config, use the prop directly in code.',
    },
    defaultSelectAll: {
      control: 'boolean',
      description: 'When true, selects all selectable leaf nodes once on first render.',
    },
    defaultExpandAll: {
      control: 'boolean',
      description:
        'When true, expands all expandable nodes on first render without selecting them.',
    },
    loadOptions: {
      control: false,
      description:
        'Async loader for remote tree data. Use together with `treeData={[]}` to run in async mode.',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay (ms) for async search requests when `loadOptions` is provided.',
    },
    loadingText: {
      control: 'text',
      description: 'Text shown while the initial async request is loading.',
    },
    loadingMoreText: {
      control: 'text',
      description: 'Text shown while loading more async pages.',
    },
    disableClear: {
      control: 'boolean',
      description: 'Disable the clear actions in trigger and footer.',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TreeMultipleSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const basicTreeData: TreeSelectItem[] = [
  {
    title: 'North Region',
    value: 'north',
    children: [
      {
        title: 'Hanoi',
        value: 'hanoi',
        children: [
          { title: 'Ba Dinh', value: 'ba_dinh' },
          { title: 'Hoan Kiem', value: 'hoan_kiem' },
          { title: 'Cau Giay', value: 'cau_giay' },
        ],
      },
      {
        title: 'Hai Phong',
        value: 'haiphong',
        children: [
          { title: 'Hong Bang', value: 'hong_bang' },
          { title: 'Ngo Quyen', value: 'ngo_quyen' },
        ],
      },
    ],
  },
  {
    title: 'South Region',
    value: 'south',
    children: [
      {
        title: 'Ho Chi Minh City',
        value: 'hcm',
        children: [
          { title: 'District 1', value: 'hcm_d1' },
          { title: 'District 3', value: 'hcm_d3' },
          { title: 'Thu Duc City', value: 'thu_duc' },
        ],
      },
      {
        title: 'Can Tho',
        value: 'cantho',
        children: [{ title: 'Ninh Kieu', value: 'ninh_kieu' }],
      },
    ],
  },
];

const deepNestedTreeData: TreeSelectItem[] = [
  {
    title: 'Level 1 - Root A',
    value: 'l1_root_a',
    children: [
      {
        title: 'Level 2 - A1',
        value: 'l2_a1',
        children: [
          {
            title: 'Level 3 - A1.1',
            value: 'l3_a1_1',
            children: [
              {
                title: 'Level 4 - A1.1.1',
                value: 'l4_a1_1_1',
                children: [
                  { title: 'Level 5 - A1.1.1.1', value: 'l5_a1_1_1_1' },
                  { title: 'Level 5 - A1.1.1.2', value: 'l5_a1_1_1_2' },
                ],
              },
              { title: 'Level 4 - A1.1.2', value: 'l4_a1_1_2' },
            ],
          },
        ],
      },
      {
        title: 'Level 2 - A2',
        value: 'l2_a2',
        children: [
          {
            title: 'Level 3 - A2.1',
            value: 'l3_a2_1',
            children: [{ title: 'Level 4 - A2.1.1', value: 'l4_a2_1_1' }],
          },
        ],
      },
    ],
  },
  {
    title: 'Level 1 - Root B',
    value: 'l1_root_b',
    children: [
      {
        title: 'Level 2 - B1',
        value: 'l2_b1',
        children: [{ title: 'Level 3 - B1.1', value: 'l3_b1_1' }],
      },
    ],
  },
];

const asyncTreeSource: TreeSelectItem[] = Array.from({ length: 120 }, (_, index) => {
  const id = index + 1;
  const region = id % 2 === 0 ? 'North' : 'South';
  const group = Math.floor((id - 1) / 10) + 1;

  return {
    title: `Parent ${id} - ${region} Group ${group}`,
    value: `parent_${id}`,
    children: [
      { title: `Child ${id}.1`, value: `parent_${id}_child_1` },
      { title: `Child ${id}.2`, value: `parent_${id}_child_2` },
      { title: `Child ${id}.3`, value: `parent_${id}_child_3` },
    ],
  };
});

const paginateTree = (
  allItems: TreeSelectItem[],
  search: string,
  page: number,
  pageSize: number
): { options: TreeSelectItem[]; hasMore: boolean } => {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = normalizedSearch
    ? allItems.filter((item) => {
        const parentMatch = String(item.title).toLowerCase().includes(normalizedSearch);
        if (parentMatch) return true;

        return (item.children ?? []).some((child) =>
          String(child.title).toLowerCase().includes(normalizedSearch)
        );
      })
    : allItems;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const options = filtered.slice(start, end);

  return { options, hasMore: end < filtered.length };
};

const paginateFlatParents = (
  allItems: TreeSelectItem[],
  search: string,
  page: number,
  pageSize: number
): { options: TreeSelectItem[]; hasMore: boolean } => {
  const paged = paginateTree(allItems, search, page, pageSize);
  return {
    options: paged.options.map((item) => ({
      title: item.title,
      value: item.value,
    })),
    hasMore: paged.hasMore,
  };
};

const mockAsync = async <T,>(data: T, delay = 600): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const Default: Story = {
  args: {
    treeData: basicTreeData,
    placeholder: 'Select multiple locations...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="w-96 space-y-3">
        <Label>Multiple Locations</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  args: {
    treeData: basicTreeData,
    searchable: true,
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['hanoi', 'hcm_d1']);

    return (
      <div className="w-96 space-y-3">
        <Label>Controlled (multiple)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          searchable={args.searchable}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('controlled changed')(values);
          }}
          placeholder="Controlled multi select..."
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    treeData: basicTreeData,
    placeholder: 'Uncontrolled multi tree select...',
    searchable: true,
  },
  render: (args) => {
    return (
      <div className="w-96 space-y-3">
        <Label>Uncontrolled (internal state)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          defaultValue={['hanoi', 'hcm_d1']}
          onChange={(values) => {
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          This example uses <code>defaultValue</code> and lets the component manage its own
          selection state. Open the "Actions" panel to see emitted values.
        </p>
      </div>
    );
  },
};

export const WithDisabledNodes: Story = {
  args: {
    treeData: [
      {
        title: 'All Stores',
        value: 'all',
        children: [
          {
            title: 'Online (disabled)',
            value: 'online',
            disabled: true,
          },
          {
            title: 'Offline',
            value: 'offline',
            children: [
              { title: 'Convenience Stores', value: 'convenience' },
              { title: 'Supermarkets', value: 'supermarkets', disabled: true },
              { title: 'Hypermarkets', value: 'hypermarkets' },
            ],
          },
        ],
      },
    ],
    placeholder: 'Select channels...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="w-96 space-y-3">
        <Label>Sales Channels</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">Disabled nodes cannot be selected.</p>
      </div>
    );
  },
};

export const WithRefControl: Story = {
  args: {
    treeData: basicTreeData,
    placeholder: 'Controlled via ref...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const treeRef = useRef<TreeSelectRef>(null);
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="w-96 space-y-4">
        <Label>Programmatic Control</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          ref={treeRef}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => treeRef.current?.reset()}>
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={() => treeRef.current?.clear()}>
            Clear
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => treeRef.current?.setSelectedValues(['north', 'hanoi', 'haiphong'])}
          >
            Select North Region
          </Button>
          <Button size="sm" variant="outline" onClick={() => treeRef.current?.focus()}>
            Focus
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} item{selected.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

export const WithAsyncLoading: Story = {
  args: {
    treeData: [],
    placeholder: 'Select async nodes...',
    searchable: true,
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const result = paginateTree(asyncTreeSource, search, page, 10);
      return mockAsync(result);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Async Tree Data (Infinite Scroll)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          loadOptions={loadOptions}
          debounceMs={300}
          enableVirtualization
          loadingText="Loading nodes..."
          loadingMoreText="Loading more nodes..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} node{selected.length !== 1 ? 's' : ''}
        </p>
        <p className="text-muted-foreground text-xs">
          This example shows the recommended async pattern: provide an empty
          <code> treeData </code> array and implement <code>loadOptions</code> to page and search on
          the server.
        </p>
      </div>
    );
  },
};

export const WithAsyncMixedShapeOnReopen: Story = {
  args: {
    treeData: [],
    placeholder: 'Select async nodes (mixed shape repro)...',
    searchable: true,
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    const initialPageCalls = useRef(0);

    const loadOptions = async (search: string, page: number) => {
      const isInitialPage = search.trim() === '' && page === 1;
      if (isInitialPage) {
        initialPageCalls.current += 1;
      }

      const useFlatShape = isInitialPage && initialPageCalls.current > 1;
      const result = useFlatShape
        ? paginateFlatParents(asyncTreeSource, search, page, 10)
        : paginateTree(asyncTreeSource, search, page, 10);

      action('loadOptions')({
        search,
        page,
        shape: useFlatShape ? 'flat-parent-only' : 'hierarchical',
      });

      return mockAsync(result);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Async Mixed Shape on Reopen (Regression)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          loadOptions={loadOptions}
          debounceMs={300}
          enableVirtualization
          loadingText="Loading nodes..."
          loadingMoreText="Loading more nodes..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} node{selected.length !== 1 ? 's' : ''}
        </p>
        <p className="text-muted-foreground text-xs">
          Regression scenario: after the first initial load, repeated initial-page requests return a
          flat shape (no children). Close and reopen after selecting a child; indentation should
          stay stable.
        </p>
      </div>
    );
  },
};

export const DeepNestedExample: Story = {
  args: {
    treeData: deepNestedTreeData,
    placeholder: 'Deep nested tree (5 levels)',
    searchable: true,
    defaultSelectAll: false,
    defaultExpandAll: true,
    popoverMaxHeight: '320px',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="w-96 space-y-3">
        <Label>Deep Nested Tree (5 levels)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          popoverMaxHeight={args.popoverMaxHeight}
          defaultSelectAll={args.defaultSelectAll as boolean}
          defaultExpandAll={args.defaultExpandAll}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const LongLabelNodes: Story = {
  args: {
    treeData: [
      {
        title:
          'North Region - This is an extremely long label for a tree node to demonstrate how text wrapping, truncation, and tooltip behavior will look in the UI',
        value: 'north_long',
        children: [
          {
            title:
              'Hanoi City - Another very long label for a child node that should be shortened in the visible area but still readable via tooltip or full text',
            value: 'hanoi_long',
            children: [
              {
                title:
                  'Ba Dinh District - Nested node with a descriptive and verbose label to show how deep nodes behave when the label is longer than the available width',
                value: 'ba_dinh_long',
              },
              {
                title:
                  'Hoan Kiem District - Yet another long text label used to validate that ellipsis and max-width settings are applied consistently across all levels',
                value: 'hoan_kiem_long',
              },
            ],
          },
        ],
      },
    ],
    placeholder: 'Select locations with long labels...',
    searchable: true,
    optionLabelMaxWidth: '220px',
    badgeLabelMaxWidth: '140px',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div className="w-96 space-y-3">
        <Label>Locations (Long Labels)</Label>
        <TreeMultipleSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          optionLabelMaxWidth={args.optionLabelMaxWidth}
          badgeLabelMaxWidth={args.badgeLabelMaxWidth}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};
