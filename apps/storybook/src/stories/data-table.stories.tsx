// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '@masan-group/shared-ui/checkbox';
import { Badge } from '@masan-group/shared-ui/badge';
import { Button } from '@masan-group/shared-ui/button';
import { Trash2, Download, Archive } from 'lucide-react';
import { TooltipProvider } from '@masan-group/shared-ui/tooltip';

// Workspace
import { DataTable, DataTableBulkActions, useColumns } from '@masan-group/shared-ui/data-table';
import type { ColumnConfig } from '@masan-group/shared-ui/data-table';

// -- Mock data types & generators --

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const ASSIGNEES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank'];

function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `TASK-${String(i + 1).padStart(4, '0')}`,
    title: `Task ${i + 1}: ${['Implement feature', 'Fix bug', 'Write docs', 'Code review', 'Deploy release', 'Update deps', 'Refactor module', 'Add tests'][i % 8]}`,
    status: (['todo', 'in-progress', 'done', 'cancelled'] as const)[i % 4],
    priority: (['low', 'medium', 'high', 'critical'] as const)[i % 4],
    assignee: ASSIGNEES[i % ASSIGNEES.length],
    createdAt: new Date(2026, 0, 1 + i).toISOString().slice(0, 10),
  }));
}

const MOCK_TASKS = generateTasks(50);

// -- Column definitions --

const baseColumns: ColumnConfig<Task>[] = [
  { accessorKey: 'id', title: 'ID', size: 120, enableSorting: false },
  { accessorKey: 'title', title: 'Title', size: 300 },
  {
    accessorKey: 'status',
    title: 'Status',
    size: 130,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'done'
          ? 'success'
          : status === 'cancelled'
            ? 'destructive'
            : status === 'in-progress'
              ? 'warning'
              : 'primary';
      return <Badge variant={variant}>{status}</Badge>;
    },
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'priority',
    title: 'Priority',
    size: 120,
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const variant =
        priority === 'critical'
          ? 'destructive'
          : priority === 'high'
            ? 'warning'
            : priority === 'medium'
              ? 'primary'
              : 'success';
      return <Badge variant={variant}>{priority}</Badge>;
    },
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  { accessorKey: 'assignee', title: 'Assignee', size: 140 },
  { accessorKey: 'createdAt', title: 'Created', size: 120 },
];

// Columns with select checkbox for bulk actions
const selectColumn: ColumnConfig<Task> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  size: 40,
  enableSorting: false,
  enableHiding: false,
  enableResizing: false,
};

// -- Storybook meta --

/**
 * A feature-rich data table built on TanStack React Table.
 * Supports sorting, filtering, pagination, column resizing, bulk actions, loading states, and more.
 */
const meta = {
  title: 'Custom Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

// -- Stories --

/** Basic table with columns, mock data, and client-side pagination */
export const Default: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>(baseColumns);
    return (
      <DataTable
        data={MOCK_TASKS}
        columns={columns}
        manualPagination={false}
        manualFiltering={false}
        defaultPageSize={10}
        enableFullHeight={false}
      />
    );
  },
};

/** Table with `searchKey` for column-specific search */
export const WithSearch: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>(baseColumns);
    return (
      <DataTable
        data={MOCK_TASKS}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search tasks..."
        manualPagination={false}
        manualFiltering={false}
        defaultPageSize={10}
        enableFullHeight={false}
      />
    );
  },
};

/** Table with faceted filters for status and priority */
export const WithFacetedFilters: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>(baseColumns);
    const filters = [
      { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
      { columnId: 'priority', title: 'Priority', options: PRIORITY_OPTIONS },
    ];
    return (
      <DataTable
        data={MOCK_TASKS}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search tasks..."
        filters={filters}
        manualPagination={false}
        manualFiltering={false}
        defaultPageSize={10}
        enableFullHeight={false}
      />
    );
  },
};

/** Table with row selection and bulk action toolbar */
export const WithBulkActions: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>([selectColumn, ...baseColumns]);
    return (
      <TooltipProvider>
        <DataTable
          data={MOCK_TASKS}
          columns={columns}
          manualPagination={false}
          manualFiltering={false}
          defaultPageSize={10}
          enableFullHeight={false}
          bulkActions={(table) => (
            <DataTableBulkActions table={table} entityName="task">
              <Button variant="default" appearance="outline" size="sm">
                <Archive className="mr-1 size-4" /> Archive
              </Button>
              <Button variant="default" appearance="outline" size="sm">
                <Download className="mr-1 size-4" /> Export
              </Button>
              <Button variant="destructive" appearance="primary" size="sm">
                <Trash2 className="mr-1 size-4" /> Delete
              </Button>
            </DataTableBulkActions>
          )}
        />
      </TooltipProvider>
    );
  },
};

/** Table in loading state with skeleton rows */
export const Loading: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>(baseColumns);
    return (
      <DataTable
        data={[]}
        columns={columns}
        loading={true}
        skeletonRows={8}
        manualPagination={false}
        manualFiltering={false}
        enableFullHeight={false}
      />
    );
  },
};

/** Table with empty data showing empty state */
export const Empty: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>(baseColumns);
    return (
      <DataTable
        data={[]}
        columns={columns}
        manualPagination={false}
        manualFiltering={false}
        enableFullHeight={false}
      />
    );
  },
};

/** Manual pagination with totalCount simulating server-side data */
export const ServerSidePagination: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const allData = MOCK_TASKS;
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const columns = useColumns<Task>(baseColumns);

    // Simulate server-side slice
    const pageData = allData.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

    return (
      <DataTable
        data={pageData}
        columns={columns}
        manualPagination={true}
        manualFiltering={true}
        totalCount={allData.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        enableFullHeight={false}
      />
    );
  },
};

/** Demonstrates column resizing (drag column borders) */
export const WithColumnResize: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const columns = useColumns<Task>([
      { accessorKey: 'id', title: 'ID', size: 120, minSize: 80, maxSize: 200 },
      { accessorKey: 'title', title: 'Title', size: 300, minSize: 150, maxSize: 500 },
      { accessorKey: 'status', title: 'Status', size: 130, minSize: 100, maxSize: 200 },
      { accessorKey: 'priority', title: 'Priority', size: 120, minSize: 80, maxSize: 180 },
      { accessorKey: 'assignee', title: 'Assignee', size: 140, minSize: 100, maxSize: 250 },
      { accessorKey: 'createdAt', title: 'Created', size: 120, minSize: 100, maxSize: 180 },
    ]);
    return (
      <DataTable
        data={MOCK_TASKS.slice(0, 20)}
        columns={columns}
        manualPagination={false}
        manualFiltering={false}
        defaultPageSize={10}
        enableFullHeight={false}
      />
    );
  },
};

/** Uses `renderCustomFilters` prop for fully custom toolbar content */
export const WithCustomFilters: Story = {
  args: { data: [], columns: [] },
  render: () => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const columns = useColumns<Task>(baseColumns);

    const filteredData =
      statusFilter === 'all' ? MOCK_TASKS : MOCK_TASKS.filter((t) => t.status === statusFilter);

    return (
      <DataTable
        data={filteredData}
        columns={columns}
        manualPagination={false}
        manualFiltering={false}
        defaultPageSize={10}
        enableFullHeight={false}
        renderCustomFilters={() => (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Status:</span>
            {['all', ...STATUS_OPTIONS.map((s) => s.value)].map((value) => (
              <Button
                key={value}
                variant="default"
                appearance={statusFilter === value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(value)}
              >
                {value === 'all' ? 'All' : STATUS_OPTIONS.find((s) => s.value === value)?.label}
              </Button>
            ))}
          </div>
        )}
      />
    );
  },
};
