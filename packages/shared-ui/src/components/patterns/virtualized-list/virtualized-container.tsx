import { useRef, useState } from 'react';
import type * as React from 'react';

import { cn } from '../../../lib/utils';

import { type VirtualItem, useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualizedContainerProps<T> {
  /**
   * Array of data items to render
   */
  data: T[];

  /**
   * Function to render each item
   * @param item - The data item
   * @param index - The index of the item in the data array
   * @param virtualItem - The virtual item from @tanstack/react-virtual
   */
  renderItem: (item: T, index: number, virtualItem: VirtualItem) => React.ReactNode;

  /**
   * Estimated size of each item in pixels, or a function that returns the size
   * @default 32
   */
  estimateSize?: number | ((index: number) => number);

  /**
   * Number of items to render outside the visible area
   * @default 5
   */
  overscan?: number;

  /**
   * Optional external scroll ref (for controlled usage)
   * If not provided, an internal scroll container will be created
   */
  scrollRef?: React.RefObject<HTMLDivElement>;

  /**
   * Custom empty state to display when data is empty
   */
  emptyState?: React.ReactNode;

  /**
   * Additional className for the scroll container
   */
  className?: string;

  /**
   * Inline styles for the scroll container
   */
  containerStyle?: React.CSSProperties;

  /**
   * Height of the list
   */
  height?: number;

  /**
   * Max height of the list
   */
  maxHeight?: number;

  /**
   * Enable data normalization to convert array data into an object keyed by a specified property
   * When enabled, data will be converted from array format to object format for faster lookups
   * @default false
   */
  withNormalizeData?: boolean;

  /**
   * The property key to use for data normalization
   * Used as the key when converting array data to object format
   * @default 'id'
   */
  normalizeDataKey?: string;

  /**
   * Style for each item container, or a function that returns styles based on index
   */
  itemContainerStyle?: React.CSSProperties | ((index: number) => React.CSSProperties);
}

/**
 * A reusable virtualized list component that efficiently renders large lists
 * by only rendering items visible in the viewport.
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   data={items}
 *   renderItem={(item, index, virtualItem) => (
 *     <div key={item.id} style={{ height: virtualItem.size }}>
 *       {item.label}
 *     </div>
 *   )}
 *   estimateSize={40}
 *   overscan={5}
 *   className="max-h-[300px] overflow-y-auto"
 * />
 * ```
 */
function VirtualizedContainer<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  emptyState,
  className,
  containerStyle,
  height,
  maxHeight,
  withNormalizeData = false,
  normalizeDataKey,
  estimateSize,
  overscan,
  renderItem,
  itemContainerStyle,
}: VirtualizedContainerProps<T>) {
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Convert data to object by key for normalization
  const normalizedData = withNormalizeData
    ? data.reduce(
        (acc: Record<string, T>, item) => {
          const key = normalizeDataKey || 'id';
          const value = (item as Record<string, unknown>)[key] as string | number | undefined;
          if (value) {
            acc[value.toString()] = item;
          }
          return acc;
        },
        {} as Record<string, T>
      )
    : null;

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => internalScrollRef?.current ?? null,
    estimateSize: typeof estimateSize === 'function' ? estimateSize : () => estimateSize ?? 32,
    overscan: overscan ?? 5,
    getItemKey: withNormalizeData
      ? (index) => {
          const item = data[index];
          if (!item) return index;
          const key = normalizeDataKey || 'id';
          return ((item as Record<string, unknown>)[key] as string | number | undefined) ?? index;
        }
      : undefined,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const getItem = (virtualItem: VirtualItem) => {
    if (!normalizedData) return data[virtualItem.index];
    return normalizedData[virtualItem.key.toString()];
  };

  const setScrollRef = (node: HTMLDivElement | null) => {
    // if (isExternalScroll) return;

    internalScrollRef.current = node;
    if (node) {
      setMounted(true);
    }
  };

  const renderEmpty = () => {
    if (emptyState) return emptyState;
    return <div className={cn('py-6 text-center text-sm', className)}>No data!</div>;
  };

  const getItemStyle = (index: number): React.CSSProperties | undefined => {
    if (typeof itemContainerStyle === 'function') {
      return { ...itemContainerStyle(index) };
    }
    if (itemContainerStyle) {
      return { ...itemContainerStyle };
    }
    return undefined;
  };

  const renderVirtualizedContent = () => {
    if (!mounted) return null;
    return (
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          {virtualItems.map((virtualItem: VirtualItem) => {
            const item = getItem(virtualItem);
            if (!item) return null;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={getItemStyle(virtualItem.index)}
              >
                {renderItem(item, virtualItem.index, virtualItem)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={setScrollRef}
      className={cn('overflow-y-auto p-1', className)}
      style={{
        contain: 'strict',
        ...containerStyle,
        height: height ?? 240,
        maxHeight: maxHeight ?? 300,
      }}
    >
      {!data.length ? renderEmpty() : renderVirtualizedContent()}
    </div>
  );
}

export default VirtualizedContainer;
