import type * as React from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { ChevronRight, ChevronDown, CheckIcon, MinusIcon } from 'lucide-react';

import { CommandItem } from '../../../ui/forms/command';
import { cn } from '../../../../lib/utils';
import { LongText } from '../../long-text';
import type { SelectionState, TreeSelectRow } from './use-tree-select-logic';

type UseTreeSelectVirtualProps = {
  enabled?: boolean;
  rows: TreeSelectRow[];
  selectionMap: Record<string, SelectionState>;
  listRef: React.RefObject<HTMLDivElement | null>;
  estimateSize?: number;
  optionLabelMaxWidth?: string;
  onToggleNode: (id: string) => void;
  onToggleExpand: (id: string) => void;
  multiple?: boolean;
  selectedId?: string;
};

export function useTreeSelectVirtual({
  enabled = false,
  rows,
  selectionMap,
  listRef,
  estimateSize = 32,
  optionLabelMaxWidth = '100%',
  onToggleNode,
  onToggleExpand,
  multiple = true,
  selectedId,
}: UseTreeSelectVirtualProps) {
  const shouldVirtualize = enabled;

  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? rows.length : 0,
    getScrollElement: () => listRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
  });

  const renderVirtualizedItem = (virtualItem: VirtualItem) => {
    const row = rows[virtualItem.index];
    if (!row) return null;

    const selection = selectionMap[row.id];
    const style: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${virtualItem.size}px`,
      transform: `translateY(${virtualItem.start}px)`,
    };

    // Keep base padding consistent with non-virtualized TreeSelect rows
    const baseIndent = 8;
    const indent = row.depth * 16 + baseIndent;
    const isDisabled = selection?.disabled ?? false;
    const isSelected = multiple ? !!selection?.checked : selectedId === row.id;

    return (
      <CommandItem
        key={row.id}
        value={row.id}
        onSelect={() => onToggleNode(row.id)}
        role="option"
        aria-selected={selection?.checked}
        aria-disabled={isDisabled}
        style={style}
        className={cn(
          'cursor-pointer',
          !multiple && isSelected && 'bg-primary/5 font-medium text-foreground',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
        disabled={isDisabled}
      >
        <div className="flex w-full items-center" style={{ paddingLeft: `${indent}px` }}>
          <span
            className="mr-1 flex h-4 w-4 items-center justify-center"
            aria-hidden="true"
            onClick={(e) => {
              if (!row.isLeaf) {
                e.stopPropagation();
                onToggleExpand(row.id);
              }
            }}
          >
            {!row.isLeaf ? (
              row.isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )
            ) : null}
          </span>
          {multiple && (
            <div
              className={cn(
                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                selection?.checked
                  ? 'bg-primary text-primary-foreground'
                  : selection?.indeterminate
                    ? 'bg-primary/10 text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible'
              )}
              aria-hidden="true"
            >
              {selection?.indeterminate ? (
                <MinusIcon className="h-3 w-3 text-white" />
              ) : (
                <CheckIcon className="h-4 w-4 text-white" />
              )}
            </div>
          )}
          {row.node.icon && (
            <span className="mr-2 flex h-4 w-4 items-center justify-center" aria-hidden="true">
              {row.node.icon}
            </span>
          )}
          <LongText maxWidth={optionLabelMaxWidth} className="text-xs leading-normal">
            {row.node.title}
          </LongText>
        </div>
      </CommandItem>
    );
  };

  return {
    shouldVirtualize,
    virtualizer,
    renderVirtualizedItem,
  };
}
