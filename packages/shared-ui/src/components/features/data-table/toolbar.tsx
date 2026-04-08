import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { Button } from '../../ui/actions/button';

import { DataTableFacetedFilter } from './faceted-filter';
import { DataTableViewOptions } from './view-options';
import { DebounceInput } from '../form-controls';

type DataTableToolbarLabels = {
  searchPlaceholder: string;
  reset: string;
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  showViewOptions?: boolean;
  renderCustomFilters?: () => React.ReactNode;
  labels?: Partial<DataTableToolbarLabels>;
};

const defaultToolbarLabels: DataTableToolbarLabels = {
  searchPlaceholder: 'Search…',
  reset: 'Reset filters',
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  searchKey,
  filters = [],
  showViewOptions = true,
  renderCustomFilters,
  labels,
}: DataTableToolbarProps<TData>) {
  const mergedLabels = { ...defaultToolbarLabels, ...labels };
  const appliedPlaceholder = searchPlaceholder ?? mergedLabels.searchPlaceholder;
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex flex-wrap gap-2">
          {renderCustomFilters ? (
            renderCustomFilters()
          ) : (
            <>
              {searchKey ? (
                <DebounceInput
                  placeholder={appliedPlaceholder}
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                  onChange={(value: string) => table.getColumn(searchKey)?.setFilterValue(value)}
                  className="h-8 w-[160px] lg:w-[200px]"
                />
              ) : null}
              {filters.map((filter) => {
                const column = table.getColumn(filter.columnId);
                if (!column) return null;
                return (
                  <DataTableFacetedFilter
                    key={filter.columnId}
                    column={column}
                    title={filter.title}
                    options={filter.options}
                  />
                );
              })}
              {isFiltered && (
                <Button
                  variant="info"
                  appearance="ghost"
                  onClick={() => {
                    table.resetColumnFilters();
                    table.setGlobalFilter('');
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  <Cross2Icon className="ms-2 h-4 w-4" />
                  {mergedLabels.reset}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {showViewOptions && <DataTableViewOptions table={table} />}
    </div>
  );
}
