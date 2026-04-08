import type { ColumnDef, CellContext, HeaderContext } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { DataTableColumnHeader } from './column-header';

type AccessorColumnConfig<TData, TValue = unknown> = {
  accessorKey: keyof TData & string;
  title: string;
  cell?: (props: CellContext<TData, TValue>) => ReactNode;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
  align?: 'start' | 'center' | 'end';
} & Omit<
  ColumnDef<TData, TValue>,
  'accessorKey' | 'header' | 'cell' | 'minSize' | 'maxSize' | 'enableResizing'
>;

type IdColumnConfig<TData, TValue = unknown> = {
  id: string;
  header: (props: HeaderContext<TData, TValue>) => ReactNode;
  cell: (props: CellContext<TData, TValue>) => ReactNode;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
  align?: 'start' | 'center' | 'end';
} & Omit<
  ColumnDef<TData, TValue>,
  'id' | 'header' | 'cell' | 'minSize' | 'maxSize' | 'enableResizing'
>;

export type ColumnConfig<TData, TValue = unknown> =
  | AccessorColumnConfig<TData, TValue>
  | IdColumnConfig<TData, TValue>;

function isAccessorColumn<TData>(
  config: ColumnConfig<TData>
): config is AccessorColumnConfig<TData> {
  return 'accessorKey' in config;
}

function getAlignClass(align?: 'start' | 'center' | 'end'): string {
  switch (align) {
    case 'start':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'end':
      return 'text-right';
    default:
      return '';
  }
}

export function useColumns<TData>(configs: ColumnConfig<TData>[]): ColumnDef<TData>[] {
  return configs.map((config) => {
    if (isAccessorColumn(config)) {
      const {
        accessorKey,
        title,
        cell,
        size,
        minSize,
        maxSize,
        enableResizing = true,
        align,
        ...rest
      } = config;
      const alignClass = getAlignClass(align);
      return {
        accessorKey,
        header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
        cell: cell ?? (({ row }) => row.getValue(accessorKey)),
        size,
        minSize: minSize ?? 80,
        maxSize: maxSize,
        enableResizing,
        ...rest,
        meta: {
          ...(rest.meta || {}),
          headerLabel: title,
          minSize,
          maxSize,
          enableResizing,
          align,
          thClassName: cn(alignClass, rest.meta?.thClassName),
          tdClassName: cn(alignClass, rest.meta?.tdClassName),
        },
      };
    }

    const {
      id,
      header,
      cell,
      size,
      minSize,
      maxSize,
      enableResizing = true,
      align,
      ...rest
    } = config;
    const alignClass = getAlignClass(align);
    return {
      id,
      header,
      cell,
      size,
      minSize: minSize ?? 80,
      maxSize: maxSize,
      enableResizing,
      ...rest,
      meta: {
        ...(rest.meta || {}),
        minSize,
        maxSize,
        enableResizing,
        align,
        thClassName: cn(alignClass, rest.meta?.thClassName),
        tdClassName: cn(alignClass, rest.meta?.tdClassName),
      },
    };
  }) as ColumnDef<TData>[];
}
