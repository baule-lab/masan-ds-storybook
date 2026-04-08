import { flexRender, type Table as TanStackTable } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '../../ui/display/table';
import { cn } from '../../../lib/utils';
import { TableResizeHandle } from './table-resize-handle';

type TableHeaderProps<TData> = {
  table: TanStackTable<TData>;
};

export function DataTableHeader<TData>({ table }: TableHeaderProps<TData>) {
  return (
    <TableHeader className="sticky top-0 z-20 bg-background">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const sticky = header.column.columnDef.meta?.sticky;
            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={cn(
                  'relative bg-background',
                  sticky && 'sticky',
                  sticky === 'left' &&
                    'left-0 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px after:shadow-[2px_0_5px_0_rgba(0,0,0,0.1)]',
                  sticky === 'right' &&
                    'right-0 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:shadow-[-2px_0_5px_0_rgba(0,0,0,0.1)]',
                  header.column.columnDef.meta?.className,
                  header.column.columnDef.meta?.thClassName
                )}
                style={{
                  ...(sticky
                    ? {
                        zIndex: 30,
                      }
                    : { zIndex: 20 }),
                  width: header.getSize(),
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}

                <TableResizeHandle header={header} />
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
