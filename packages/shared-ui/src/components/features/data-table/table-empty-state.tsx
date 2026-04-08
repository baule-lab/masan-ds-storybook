import { Inbox } from 'lucide-react';
import type { Table as TanStackTable } from '@tanstack/react-table';
import { TableCell } from '../../ui/display/table';
import { TableRow } from '../../ui/display/table';

type TableEmptyStateProps<TData> = {
  table: TanStackTable<TData>;
};

export function TableEmptyState<TData>({ table }: TableEmptyStateProps<TData>) {
  const colSpan = (() => {
    const headerGroups = table.getHeaderGroups();
    const lastHeaderGroup = headerGroups[headerGroups.length - 1];
    if (lastHeaderGroup) {
      return lastHeaderGroup.headers.reduce((sum, header) => sum + (header.colSpan ?? 1), 0);
    }
    return table.getAllColumns().filter((col) => col.getIsVisible()).length;
  })();

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <span className="text-muted-foreground">No results.</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
