import {
  type ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
  type Table as TanStackTable,
  useReactTable,
  type Row,
  type ColumnSizingState,
} from '@tanstack/react-table';
import type { UseTableUrlStateReturn } from '../../../hooks/use-table-url-state';
import { useState } from 'react';
import { useColumnVisibility } from './view-options/user-view-options-storage';
import { Table } from '../../ui/display/table';
import { useFullHeightTable } from '../../../hooks/use-full-height-table';
import { cn } from '../../../lib/utils';
import { DataTablePagination } from './table-pagination';
import { DataTableToolbar } from './toolbar';
import { DataTableHeader } from './table-header';
import { DataTableBody } from './table-body';

export type DataTableFilterOption = {
  columnId: string;
  title: string;
  name?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type DataTableProps<TData, TValue> = {
  /**
   * The data to display in the table
   */
  data: TData[];

  /**
   * The column definitions for the table
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * Placeholder text for the search input
   * @default "Filter..."
   */
  searchPlaceholder?: string;

  /**
   * The key to use for searching (if using column-specific search)
   * If not provided, will use global filter
   */
  searchKey?: string;

  /**
   * Filter configurations for faceted filters
   */
  filters?: DataTableFilterOption[];

  /**
   * URL state management (optional)
   * If provided, table state will be synced with URL params
   */
  urlState?: Omit<UseTableUrlStateReturn, 'ensurePageInRange'>;

  /**
   * Custom global filter function
   */
  globalFilterFn?: (row: Row<TData>, columnId: string, filterValue: unknown) => boolean;

  /**
   * Enable sticky header
   * @default true
   */
  stickyHeader?: boolean;

  /**
   * Enable full height calculation with scrolling
   * @default true
   */
  enableFullHeight?: boolean;

  /**
   * Minimum height for the table (when enableFullHeight is true)
   * @default 400
   */
  minHeight?: number;

  /**
   * Bottom offset for height calculation (e.g., pagination height)
   * @default 80
   */
  bottomOffset?: number;

  /**
   * Default page size
   * @default 10
   */
  defaultPageSize?: number;

  /**
   * Additional className for the container
   */
  className?: string;

  /**
   * Additional className for the table wrapper
   */
  tableClassName?: string;

  /**
   * Render prop for bulk actions when rows are selected
   * Receives the table instance as parameter
   */
  bulkActions?: (table: TanStackTable<TData>) => React.ReactNode;

  /**
   * Show view options
   * @default true
   */
  showViewOptions?: boolean;

  /**
   * Loading state for async data
   * @default false
   */
  loading?: boolean;

  /**
   * Number of skeleton rows to show when loading
   * @default 5
   */
  skeletonRows?: number;

  /**
   * Enable manual pagination (server-side)
   * @default false
   */
  manualPagination?: boolean;

  /**
   * Total page count for manual pagination
   * If totalCount is provided, this will be calculated automatically
   */
  pageCount?: number;

  /**
   * Total count of items (for automatic pageCount calculation)
   * If provided, pageCount will be calculated as Math.ceil(totalCount / pageSize)
   */
  totalCount?: number;

  /**
   * Callback for pagination changes (for manual pagination)
   */
  onPaginationChange?: (
    updater:
      | { pageIndex: number; pageSize: number }
      | ((old: { pageIndex: number; pageSize: number }) => {
          pageIndex: number;
          pageSize: number;
        })
  ) => void;

  /**
   * Controlled pagination state (for manual pagination)
   * If provided, the table will use this instead of internal state
   */
  pagination?: { pageIndex: number; pageSize: number };

  /**
   * Invalidate the query when the page is changed
   */
  onInvalidate?: () => void;

  /**
   * Enable manual filtering (server-side)
   * @default false
   */
  manualFiltering?: boolean;

  /**
   * Enable manual sorting (server-side)
   * @default false
   */
  manualSorting?: boolean;

  /**
   * Controlled sorting state (for server-side sorting)
   * If provided, the table will use this instead of internal state
   */
  sorting?: SortingState;

  /**
   * Callback for sorting changes (for server-side sorting)
   */
  onSortingChange?: OnChangeFn<SortingState>;

  /**
   * Render custom filters
   * @default undefined
   */
  renderCustomFilters?: () => React.ReactNode;
};

export function DataTable<TData, TValue>({
  data,
  columns,
  urlState,
  searchPlaceholder,
  searchKey,
  filters = [],
  globalFilterFn,
  enableFullHeight = true,
  minHeight,
  bottomOffset = 80,
  defaultPageSize = 20,
  className,
  tableClassName,
  bulkActions,
  showViewOptions,
  loading = false,
  skeletonRows = 20,
  manualPagination = true,
  manualFiltering = true,
  manualSorting = false,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  pageCount,
  totalCount,
  pagination: externalPagination,
  onPaginationChange,
  onInvalidate,
  renderCustomFilters,
}: DataTableProps<TData, TValue>) {
  const appliedSearchPlaceholder = searchPlaceholder ?? 'Filter...';
  const [rowSelection, setRowSelection] = useState({});
  const [localSorting, setLocalSorting] = useState<SortingState>([]);

  const sorting = urlState?.sorting ?? externalSorting ?? localSorting;
  const handleSortingChange: OnChangeFn<SortingState> =
    externalOnSortingChange ?? urlState?.onSortingChange ?? setLocalSorting;

  const [columnVisibility, setColumnVisibility, SaveColumnVisibilityStatusFeatureImpl] =
    useColumnVisibility();
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: unknown }[]>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [localPagination, setLocalPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Use external pagination if provided (for manual pagination), otherwise use local state
  const pagination = urlState?.pagination ?? externalPagination ?? localPagination;

  // Wrap pagination change to clear row selection
  const handlePaginationChange = (
    updater:
      | { pageIndex: number; pageSize: number }
      | ((old: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })
  ) => {
    setRowSelection({}); // Clear selection on pagination change
    const handler = urlState?.onPaginationChange ?? onPaginationChange ?? setLocalPagination;
    handler(updater);
  };

  const rawPageCount = totalCount
    ? Math.ceil(totalCount / (pagination.pageSize || defaultPageSize))
    : pageCount;

  const calculatedPageCount = rawPageCount || 1;
  //TODO: Fix me later
  // Calculate table height for scrolling
  const { height, containerRef } = useFullHeightTable({
    minHeight,
    bottomOffset,
    autoDetectHeaders: true,
    autoDetectElementsAbove: true,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters: urlState?.columnFilters ?? columnFilters,
      globalFilter: urlState?.globalFilter ?? globalFilter,
      pagination: urlState?.pagination ?? pagination,
      columnSizing,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(!manualSorting && { getSortedRowModel: getSortedRowModel() }),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: handlePaginationChange,
    onGlobalFilterChange: urlState?.onGlobalFilterChange ?? setGlobalFilter,
    onColumnFiltersChange: urlState?.onColumnFiltersChange ?? setColumnFilters,
    manualPagination,
    pageCount: calculatedPageCount,
    manualFiltering,
    manualSorting,
    _features: [SaveColumnVisibilityStatusFeatureImpl],
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
        className
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder={appliedSearchPlaceholder}
        searchKey={searchKey}
        filters={filters}
        showViewOptions={showViewOptions}
        renderCustomFilters={renderCustomFilters}
      />
      <div
        className={cn('overflow-auto rounded-md border', tableClassName)}
        style={enableFullHeight ? { maxHeight: height, minHeight: `${minHeight}px` } : undefined}
      >
        <Table
          className="table-fixed"
          //  style={{ width: table.getCenterTotalSize() }} // TODO: Check me later
        >
          <DataTableHeader table={table} />
          <DataTableBody table={table} loading={loading} skeletonRows={skeletonRows} />
        </Table>
      </div>
      <DataTablePagination table={table} onInvalidate={onInvalidate} />
      {bulkActions?.(table)}
    </div>
  );
}
