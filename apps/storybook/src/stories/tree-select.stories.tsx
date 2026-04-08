import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { action } from 'storybook/actions';

import { TreeSelect } from '@masan-group/shared-ui/tree-select';
import type { TreeSelectItem, TreeSelectRef } from '@masan-group/shared-ui/tree-select';
import { Button } from '@masan-group/shared-ui/button';
import { Label } from '@masan-group/shared-ui/label';

const meta = {
  title: 'Custom Components/TreeSelect',
  component: TreeSelect,
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
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    optionLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for option labels in dropdown (e.g., "200px")',
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
} satisfies Meta<typeof TreeSelect>;

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

export const Default: Story = {
  args: {
    treeData: basicTreeData,
    placeholder: 'Select a location...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="w-96 space-y-3">
        <Label>Location</Label>
        <TreeSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            action('value changed')(value);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {selected ?? 'None'}</p>
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
    const [selected, setSelected] = useState<string | null>('hanoi');

    return (
      <div className="w-96 space-y-3">
        <Label>Controlled (single)</Label>
        <TreeSelect
          treeData={args.treeData}
          searchable={args.searchable}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            action('controlled changed')(value);
          }}
          placeholder="Controlled single select..."
        />
        <p className="text-muted-foreground text-sm">Selected: {selected ?? 'None'}</p>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  args: {
    treeData: basicTreeData,
    placeholder: 'Uncontrolled single tree select...',
    searchable: true,
  },
  render: (args) => {
    return (
      <div className="w-96 space-y-3">
        <Label>Uncontrolled (internal state)</Label>
        <TreeSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          defaultValue="hanoi"
          onChange={(value) => {
            action('value changed')(value);
          }}
        />
        <p className="text-muted-foreground text-sm">
          This example uses <code>defaultValue</code> and lets the component manage its own state.
          Open the "Actions" panel to see emitted values.
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
    placeholder: 'Select a channel...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="w-96 space-y-3">
        <Label>Sales Channel</Label>
        <TreeSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            action('value changed')(value);
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
    placeholder: 'Controlled via ref (single)...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const treeRef = useRef<TreeSelectRef>(null);
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="w-96 space-y-4">
        <Label>Programmatic Control (Single)</Label>
        <TreeSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          ref={treeRef}
          value={selected}
          onChange={(value) => {
            setSelected(value);
            action('value changed')(value);
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
            onClick={() => treeRef.current?.setSelectedValues(['hanoi'])}
          >
            Select Hanoi
          </Button>
          <Button size="sm" variant="outline" onClick={() => treeRef.current?.focus()}>
            Focus
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Selected: {selected ? `1 item (${selected})` : '0 items'}
        </p>
      </div>
    );
  },
};

export const WithAsyncLoading: Story = {
  args: {
    treeData: [],
    placeholder: 'Select async node...',
    searchable: true,
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null);

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

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const normalizedSearch = search.trim().toLowerCase();
      const filtered = normalizedSearch
        ? asyncTreeSource.filter((item) => {
            const parentMatch = String(item.title).toLowerCase().includes(normalizedSearch);
            if (parentMatch) return true;
            return (item.children ?? []).some((child) =>
              String(child.title).toLowerCase().includes(normalizedSearch)
            );
          })
        : asyncTreeSource;
      const start = (page - 1) * 10;
      const end = start + 10;
      const result = { options: filtered.slice(start, end), hasMore: end < filtered.length };
      return new Promise<typeof result>((resolve) => setTimeout(() => resolve(result), 600));
    };

    console.log({ selected });

    return (
      <div className="w-96 space-y-3">
        <Label>Async Tree Data (Single, Infinite Scroll)</Label>
        <TreeSelect
          treeData={args.treeData}
          loadOptions={loadOptions}
          debounceMs={300}
          value={selected}
          enableVirtualization
          loadingText="Loading nodes..."
          loadingMoreText="Loading more nodes..."
          onChange={(value) => {
            setSelected(value);
            action('value changed')(value);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {selected ?? 'None'}</p>
      </div>
    );
  },
};

export const DeepNestedExample: Story = {
  args: {
    treeData: [
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
        ],
      },
    ],
    placeholder: 'Deep nested tree (single)',
    searchable: true,
    defaultExpandAll: true,
    popoverMaxHeight: '320px',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="w-96 space-y-3">
        <Label>Deep Nested Tree (Single)</Label>
        <TreeSelect
          treeData={args.treeData}
          placeholder={args.placeholder}
          searchable={args.searchable}
          value={selected}
          popoverMaxHeight={args.popoverMaxHeight}
          defaultExpandAll={args.defaultExpandAll}
          onChange={(value) => {
            setSelected(value);
            action('value changed')(value);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {selected ?? 'None'}</p>
      </div>
    );
  },
};
