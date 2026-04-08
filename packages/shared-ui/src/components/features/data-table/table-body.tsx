import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { AsyncWrapper } from '../../patterns/async-wrapper';
import { Skeleton } from '../../ui/feedback/skeleton';
import { TableBody } from '../../ui/display/table';
import { TableCell } from '../../ui/display/table';
import { TableRow } from '../../ui/display/table';
import { cn } from '../../../lib/utils';
import { TableEmptyState } from './table-empty-state';

type TableBodyProps<TData> = {
  table: TanStackTable<TData>;
  loading?: boolean;
  skeletonRows?: number;
};

export function DataTableBody<TData>({
  table,
  loading = false,
  skeletonRows = 30,
}: TableBodyProps<TData>) {
  return (
    <TableBody>
      <AsyncWrapper
        loading={loading}
        empty={!table.getRowModel().rows?.length}
        emptyComponent={<TableEmptyState table={table} />}
        loadingComponent={Array.from({ length: skeletonRows }).map((_, rowIndex) => (
          <TableRow key={`skeleton-row-${rowIndex}`}>
            {table.getHeaderGroups()[0]?.headers.map((_, cellIndex) => (
              <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                <Skeleton className="h-6 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      >
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => {
              const sticky = cell.column.columnDef.meta?.sticky;
              return (
                <TableCell
                  key={cell.id}
                  className={cn(
                    'truncate',
                    sticky && 'sticky bg-background',
                    sticky === 'left' &&
                      'left-0 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px after:shadow-[2px_0_5px_0_rgba(0,0,0,0.1)]',
                    sticky === 'right' &&
                      'right-0 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:shadow-[-2px_0_5px_0_rgba(0,0,0,0.1)]',
                    cell.column.columnDef.meta?.className,
                    cell.column.columnDef.meta?.tdClassName
                  )}
                  style={
                    sticky
                      ? {
                          zIndex: 10,
                          width: cell.column.getSize(),
                        }
                      : {
                          width: cell.column.getSize(),
                        }
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </AsyncWrapper>
    </TableBody>
  );
}
