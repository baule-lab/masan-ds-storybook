import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import type { Table, VisibilityState } from '@tanstack/react-table';
import { useState, useCallback } from 'react';
import { Button } from '../../../ui/actions/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/actions/dropdown-menu';
import { BookmarkIcon } from 'lucide-react';

type DataTableViewOptionsLabels = {
  trigger: string;
  toggleColumns: string;
  cancel: string;
  saveChanges: string;
};

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
  labels?: Partial<DataTableViewOptionsLabels>;
};

const defaultViewOptionsLabels: DataTableViewOptionsLabels = {
  trigger: 'View',
  toggleColumns: 'Toggle columns',
  cancel: 'Cancel',
  saveChanges: 'Save changes',
};

export function DataTableViewOptions<TData>({ table, labels }: DataTableViewOptionsProps<TData>) {
  const mergedLabels = { ...defaultViewOptionsLabels, ...labels };
  const [isOpen, setIsOpen] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<VisibilityState>({});

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        // Store current visibility state when opening
        const currentVisibility: VisibilityState = {};
        for (const column of table.getAllColumns()) {
          if (typeof column.accessorFn !== 'undefined' && column.getCanHide()) {
            currentVisibility[column.id] = column.getIsVisible();
          }
        }
        setPendingVisibility(currentVisibility);
      }
      setIsOpen(open);
    },
    [table]
  );

  const handleCheckedChange = useCallback((columnId: string, value: boolean) => {
    setPendingVisibility((prev) => {
      const updated = {
        ...prev,
        [columnId]: value,
      };
      return updated;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    table.setColumnVisibility(pendingVisibility);
    setIsOpen(false);
  }, [table, pendingVisibility]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="ms-auto hidden h-8 lg:flex">
            <MixerHorizontalIcon className="size-4" />
            {mergedLabels.trigger}
          </Button>
        )}
      />
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel className="flex items-center gap-2">
          {mergedLabels.toggleColumns}
          <Button
            variant={table.getEnabledSaveColumnVisibilityStatus() ? 'success' : 'default'}
            appearance={table.getEnabledSaveColumnVisibilityStatus() ? 'light' : 'ghost'}
            size="sm"
            className="ms-auto hidden h-8 lg:flex"
            onClick={() =>
              table.setEnabledSaveColumnVisibilityStatus(
                !table.getEnabledSaveColumnVisibilityStatus()
              )
            }
          >
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter((column) => Boolean(column?.id))
          .map((column) => {
            const columnId = column.id as string; // Type assertion safe after filter
            const headerLabel = column.columnDef?.meta?.headerLabel || columnId;
            return (
              <DropdownMenuCheckboxItem
                key={columnId}
                className="capitalize"
                checked={pendingVisibility[columnId] ?? column.getIsVisible()}
                onCheckedChange={(value: boolean) => handleCheckedChange(columnId, value)}
                onSelect={(e) => e.preventDefault()}
              >
                {headerLabel}
              </DropdownMenuCheckboxItem>
            );
          })}
        <DropdownMenuSeparator />
        <div className="flex gap-2 p-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleClose}>
            {mergedLabels.cancel}
          </Button>
          <Button size="sm" className="flex-1" onClick={handleConfirm}>
            {mergedLabels.saveChanges}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
