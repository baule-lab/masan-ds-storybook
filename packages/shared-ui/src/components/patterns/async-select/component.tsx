import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/forms/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import { Button } from '../../ui/actions/button';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useControlledState } from '../../../hooks/use-controlled-state';
import { AsyncWrapper } from '../async-wrapper';
import { LongText } from '../long-text';

export interface AsyncSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface AsyncSelectProps {
  name?: string;
  /**
   * Current selected value (controlled)
   */
  value?: string;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * Options to display
   */
  options: AsyncSelectOption[];

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Whether there are more items to load
   */
  hasMore?: boolean;

  /**
   * Loading more state
   */
  isLoadingMore?: boolean;

  /**
   * Callback when user scrolls to bottom (for infinite scroll)
   */
  onLoadMore?: () => void;

  /**
   * Search value (controlled)
   */
  searchValue?: string;

  /**
   * Callback when search value changes
   */
  onSearchChange?: (value: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;

  /**
   * Empty state text
   */
  emptyText?: string;

  /**
   * Loading text
   */
  loadingText?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Additional className for the trigger button
   */
  className?: string;

  /**
   * Enable local filtering with virtualization
   */
  enableLocalFilter?: boolean;

  /**
   * Estimated item height for virtualization (default: 32px)
   */
  estimateSize?: number;

  /**
   * Show clear button to reset selection
   */
  clearable?: boolean;

  /**
   * Error state from form validation
   */
  'aria-invalid'?: boolean;

  /**
   * Size of the trigger button
   */
  size?: 'xs' | 'sm' | 'default';

  /**
   * @deprecated Width is now driven by the parent container. This prop has no effect.
   */
  maxWidthLongText?: string;

  /**
   * Debounce delay in ms for onSearchChange callback.
   * When set (and enableLocalFilter=false), input updates immediately
   * while the onSearchChange callback is debounced.
   */
  debounceMs?: number;

  /**
   * Custom renderer for each option in the dropdown list.
   * Receives the option object and returns a ReactNode.
   * When provided, replaces the default `<LongText>{option.label}</LongText>` rendering.
   */
  renderOption?: (option: AsyncSelectOption) => ReactNode;
}

export function AsyncSelect({
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  searchValue,
  onSearchChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found',
  loadingText = 'Loading...',
  disabled = false,
  className,
  enableLocalFilter = false,
  estimateSize = 32,
  clearable = false,
  'aria-invalid': ariaInvalid,
  size = 'default',
  debounceMs,
  renderOption,
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [internalSearch, setInternalSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const selectedOptionRef = useRef<AsyncSelectOption | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  // Use controlled state hook
  const [value, setValue] = useControlledState({
    value: controlledValue,
    defaultValue: defaultValue || '',
    onChange: onChange,
  });

  // Ensure options is always an array
  const safeOptions = options || [];

  // Local filtering - compute directly without useMemo to ensure reactivity
  let filteredOptions = safeOptions;

  if (enableLocalFilter && localSearch) {
    const searchLower = localSearch.toLowerCase();
    filteredOptions = safeOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower)
    );
  }

  // Virtualizer setup
  const virtualizer = useVirtualizer({
    count: enableLocalFilter ? filteredOptions.length : options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
  });

  // Force virtualizer to re-measure when options change or loading completes
  useEffect(() => {
    if (!isLoading && options.length > 0) {
      virtualizer.measure();
    }
  }, [options, isLoading, virtualizer]);

  // Measure virtualizer when popover opens
  useEffect(() => {
    if (open && options.length > 0) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        virtualizer.measure();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, options.length, virtualizer]);

  // Compute display value from current options or cached selected option
  const selectedOption = value ? filteredOptions.find((opt) => opt.value === value) : null;

  // Update cached selected option when found in options
  if (selectedOption) {
    selectedOptionRef.current = selectedOption;
  }

  const hasSelectedOption = Boolean(value) && Boolean(selectedOptionRef.current);

  // Display: selected label from cache, loading text, or placeholder
  const displayValue = hasSelectedOption ? selectedOptionRef?.current?.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    const newSelectedOption = filteredOptions.find((opt) => opt.value === selectedValue);
    if (newSelectedOption) {
      selectedOptionRef.current = newSelectedOption;
    }
    const newValue = selectedValue === value ? '' : selectedValue;

    setValue(newValue);
    setOpen(false);
  };

  const handleSearchChange = (value: string) => {
    if (enableLocalFilter) {
      setLocalSearch(value || '');
    } else if (debounceMs && onSearchChange) {
      setInternalSearch(value || '');
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchChange(value || '');
      }, debounceMs);
    } else {
      onSearchChange?.(value || '');
    }
  };

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync internalSearch when searchValue changes externally (e.g., reset on close)
  useEffect(() => {
    if (debounceMs && searchValue !== undefined) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setInternalSearch(searchValue);
    }
  }, [searchValue, debounceMs]);

  // Scroll-based infinite loading — attached via onScroll prop to avoid portal timing issues
  const handleListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (enableLocalFilter || !hasMore || isLoading || isLoadingMore) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        onLoadMore?.();
      }
    },
    [enableLocalFilter, hasMore, isLoading, isLoadingMore, onLoadMore]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(props) => (
          <Button
            {...props}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            data-size={size}
            className={cn(
              'flex w-full select-none items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=xs]:h-6 data-[size=xs]:gap-1 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=xs]:rounded-md data-[size=xs]:px-2 data-[size=xs]:text-xs dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50',
              className
            )}
          >
            <AsyncWrapper
              loading={isLoading}
              loadingComponent={<Loader2 className="h-4 w-4 animate-spin" />}
            >
              <span
                className={cn(
                  'flex flex-1 text-left',
                  hasSelectedOption ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <LongText className="text-start">{displayValue}</LongText>
              </span>
              {clearable && value ? (
                <X
                  className="size-4 shrink-0 text-muted-foreground transition-opacity hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue('');
                  }}
                />
              ) : (
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              )}
            </AsyncWrapper>
          </Button>
        )}
      />
      <PopoverContent className="w-max min-w-(--anchor-width) max-w-72 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={
              enableLocalFilter ? localSearch : debounceMs ? internalSearch : searchValue || ''
            }
            onValueChange={handleSearchChange}
          />
          <CommandList
            ref={parentRef}
            onScroll={handleListScroll}
            className="[scrollbar-color:var(--scrollbar-thumb)_var(--scrollbar-track)] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-thumb)] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-1.5"
          >
            {isLoading && safeOptions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingText}</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const option = filteredOptions[virtualItem.index];
                      if (!option) return null;
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          onSelect={() => handleSelect(option.value || '')}
                          className="relative flex w-full items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                          }}
                        >
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <LongText className="text-start">{option.label}</LongText>
                          )}
                          <span
                            className={cn(
                              'pointer-events-none absolute right-2 flex size-4 items-center justify-center',
                              value === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          >
                            <Check className="size-4" />
                          </span>
                        </CommandItem>
                      );
                    })}
                  </div>
                </CommandGroup>

                {/* Loading more indicator */}
                {!enableLocalFilter && isLoadingMore && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
