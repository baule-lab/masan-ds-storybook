import type { Header } from '@tanstack/react-table';
import { cn } from '../../../lib/utils';

type TableResizeHandleProps<TData, TValue> = {
  header: Header<TData, TValue>;
};

export function TableResizeHandle<TData, TValue>({
  header,
}: TableResizeHandleProps<TData, TValue>) {
  if (header.isPlaceholder) {
    return null;
  }

  const enableResizing = header.column.columnDef.meta?.enableResizing ?? true;

  if (!enableResizing) {
    return null;
  }

  return (
    <div
      role="button"
      aria-label="Resize column"
      tabIndex={0}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        'group absolute top-0 right-0 flex h-full w-[4px] cursor-col-resize touch-none select-none items-center justify-center'
      )}
    >
      <div
        className={cn(
          'h-[80%] w-[1px] bg-gray-200 transition-all group-hover:w-[2px] group-hover:bg-primary',
          header.column.getIsResizing() && 'w-[2px] bg-primary'
        )}
      />
    </div>
  );
}
