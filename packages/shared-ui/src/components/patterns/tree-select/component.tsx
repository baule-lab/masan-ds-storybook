import * as React from 'react';
import type { CSSProperties } from 'react';
import { ChevronDown, ChevronRight, CheckIcon, Loader2, MinusIcon, XIcon } from 'lucide-react';

import { Button } from '../../ui/actions/button';
import { Badge } from '../../ui/display/badge';
import { Separator } from '../../ui/display/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../ui/forms/command';
import { cn } from '../../../lib/utils';

import type {
  TreeSelectInnerProps,
  TreeSelectProps,
  TreeMultipleSelectProps,
  TreeSelectRef,
  TreeSelectItem,
} from './types';
import { useGetScreenConfigTreeSelect } from './hooks/use-get-screen-size';
import { useTreeSelectLogic } from './hooks/use-tree-select-logic';
import { useTreeSelectVirtual } from './hooks/use-tree-select-virtualize';
import { SelectedBadgeNode } from '../selected-badge-node/component';
import { LongText } from '../long-text';
import { suppressScrollOnFocus } from '../../../lib/suppress-scroll-on-focus';
import { cva } from 'class-variance-authority';

const DEFAULT_MAX_COUNT = 3;

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
export const treeSelectVariants = cva('mx-1 transition-all duration-300 ease-in-out', {
  variants: {
    variant: {
      default: 'border-foreground/10 bg-card text-foreground hover:bg-card/80',
      secondary:
        'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted',
    },
    badgeAnimation: {
      bounce: 'hover:-translate-y-1 hover:scale-110',
      pulse: 'hover:animate-pulse',
      wiggle: 'hover:animate-wiggle',
      fade: 'hover:opacity-80',
      slide: 'hover:translate-x-1',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    badgeAnimation: 'bounce',
  },
});

type SelectedTreeItemNodeProps = {
  label: string;
  badgeLabelMaxWidth: string;
  onRemove?: () => void;
  badgeClassName?: string;
  badgeStyle?: CSSProperties;
  compactMode?: boolean;
  iconClassName?: string;
};

const SelectedTreeItemNode: React.FC<SelectedTreeItemNodeProps> = ({
  label,
  badgeLabelMaxWidth,
  onRemove,
  badgeClassName,
  badgeStyle,
  compactMode,
  iconClassName,
}) => {
  if (!onRemove) {
    return (
      <Badge className="h-6 shrink-0 whitespace-nowrap rounded-sm bg-card text-foreground text-xs">
        <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap leading-normal">
          {label}
        </span>
      </Badge>
    );
  }

  return (
    <SelectedBadgeNode
      label={label}
      badgeLabelMaxWidth={badgeLabelMaxWidth}
      badgeClassName={badgeClassName}
      badgeStyle={badgeStyle}
      iconClassName={iconClassName}
      compactMode={compactMode}
      onRemove={onRemove}
      removeAriaLabel={`Remove ${label}`}
    />
  );
};

const TreeSelectInner = React.forwardRef<TreeSelectRef, TreeSelectInnerProps>(
  (
    {
      className,
      responsive,
      disabled,
      multiple,
      placeholder = 'Select',
      disableClear,
      defaultValue,
      value,
      onChange,
      onOpenChange,
      loadOptions,
      debounceMs,
      disableSelectAll,
      autoSize,
      triggerClassName,
      popoverClassName,
      modalPopover,
      minWidth,
      maxWidth,
      badgeLabelMaxWidth = '100%',
      optionLabelMaxWidth = '100%',
      estimateSize = 32,
      enableVirtualization,
      loadingText = 'Loading options...',
      loadingMoreText = 'Loading more...',
      emptyIndicator,
      isLoading,
      searchable,
      treeData,
      maxCount = DEFAULT_MAX_COUNT,
      defaultSelectAll,
      popoverMaxHeight,
      defaultExpandAll,
      animation,
      animationConfig,
      variant = 'default',
      badgeAnimation,
      singleLine,
    },
    ref
  ) => {
    const listRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [observerRoot, setObserverRoot] = React.useState<HTMLDivElement | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleListRef = React.useCallback((node: HTMLDivElement | null) => {
      listRef.current = node;
      setObserverRoot(node);
    }, []);

    const treeLogic = useTreeSelectLogic({
      treeData,
      multiple,
      value,
      defaultValue,
      // Normalize onChange so the hook always works with `string[]`
      // while the public API exposes single vs multi signatures.
      onChange: (nextValues: string[], selectedNodes: TreeSelectItem[]) => {
        if (!onChange) return;
        if (multiple) {
          (onChange as TreeMultipleSelectProps['onChange'] | undefined)?.(
            nextValues ?? [],
            selectedNodes
          );
          return;
        }
        const safeValues = nextValues ?? [];
        const firstValue = safeValues.length > 0 ? safeValues[0] : null;
        const firstNode = selectedNodes[0];
        const nextValue: string | null = firstValue as string | null;
        (onChange as TreeSelectProps['onChange'] | undefined)?.(nextValue, firstNode);
      },
      loadOptions,
      debounceMs,
      defaultExpandAll,
      observerRoot,
      isOpen: isPopoverOpen,
    });
    const {
      selectedValues,
      searchValue,
      setSearchValue,
      rows,
      selectionMap,
      toggleNode,
      toggleAll,
      clear,
      getLabelForValue,
      isAsyncMode,
      asyncData,
      toggleExpanded,
    } = treeLogic;

    const { screenSize, responsiveSetting } = useGetScreenConfigTreeSelect({
      responsive,
      maxCount: maxCount ?? DEFAULT_MAX_COUNT,
    });

    const widthConstraints = React.useMemo(() => {
      const defaultMinWidth = screenSize === 'mobile' ? '0px' : '200px';
      const effectiveMinWidth = minWidth || defaultMinWidth;
      const effectiveMaxWidth = maxWidth || '100%';
      return {
        minWidth: effectiveMinWidth,
        maxWidth: effectiveMaxWidth,
        width: autoSize ? 'auto' : '100%',
      };
    }, [autoSize, maxWidth, minWidth, screenSize]);

    const handleSelectNode = React.useCallback(
      (id: string) => {
        toggleNode(id);
        if (!multiple) {
          // In single mode, close the popover and reset view state
          // (search value and expanded/collapsed state) after a selection.
          treeLogic.resetViewState();
          setIsPopoverOpen(false);
        }
      },
      [multiple, toggleNode, treeLogic]
    );
    const selectedValuesLength = selectedValues.length;

    const hasInitializedDefaultSelectAll = React.useRef(false);

    React.useEffect(() => {
      if (
        multiple &&
        defaultSelectAll &&
        !hasInitializedDefaultSelectAll.current &&
        rows.length > 0 &&
        selectedValuesLength === 0
      ) {
        toggleAll();
        hasInitializedDefaultSelectAll.current = true;
      }
    }, [multiple, defaultSelectAll, rows.length, selectedValuesLength, toggleAll]);

    const { shouldVirtualize, virtualizer, renderVirtualizedItem } = useTreeSelectVirtual({
      enabled: enableVirtualization,
      rows,
      selectionMap,
      listRef,
      estimateSize,
      optionLabelMaxWidth,
      onToggleNode: handleSelectNode,
      onToggleExpand: toggleExpanded,
      multiple,
      selectedId: !multiple && selectedValuesLength > 0 ? selectedValues[0] : undefined,
    });

    const treeSelectId = React.useId();
    const listboxId = `${treeSelectId}-listbox`;
    const triggerDescriptionId = `${treeSelectId}-description`;
    const selectedCountId = `${treeSelectId}-count`;

    const handlePopoverOpenChange = React.useCallback(
      (open: boolean) => {
        if (open) {
          suppressScrollOnFocus();
        } else {
          // When the popover closes (e.g. clicking the trigger again),
          // reset the search value and collapsed/expanded state so that
          // the next open starts from a clean view.
          treeLogic.resetViewState();
        }
        setIsPopoverOpen(open);
        onOpenChange?.(open);
      },
      [treeLogic, onOpenChange]
    );

    const handleFocus = React.useCallback(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          clear();
          treeLogic.resetViewState();
          setIsPopoverOpen(false);
        },
        getSelectedValues: () => selectedValues,
        setSelectedValues: (values: string[]) => {
          treeLogic.setSelectedValues(values);
        },
        clear: () => {
          clear();
        },
        focus: handleFocus,
      }),
      [clear, handleFocus, selectedValues, treeLogic]
    );

    const effectiveSearchable = searchable ?? true;

    return (
      <div className={cn('w-full min-w-[200px]', className)}>
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange} modal={modalPopover}>
          <div id={triggerDescriptionId} className="sr-only">
            Tree-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.
          </div>
          <div id={selectedCountId} className="sr-only" aria-live="polite">
            {selectedValuesLength === 0
              ? 'No options selected'
              : `${selectedValuesLength} option${
                  selectedValuesLength === 1 ? '' : 's'
                } selected: ${selectedValues
                  .map((value) => getLabelForValue(value) ?? value)
                  .join(', ')}`}
          </div>

          <PopoverTrigger
            render={(triggerProps) => (
              <Button
                {...(triggerProps as React.ComponentPropsWithoutRef<typeof Button>)}
                ref={(node) => {
                  if (typeof triggerProps.ref === 'function') {
                    triggerProps.ref(node);
                  } else if (triggerProps.ref) {
                    (triggerProps.ref as React.RefObject<HTMLButtonElement | null>).current = node;
                  }
                  buttonRef.current = node;
                }}
                variant="outline"
                onClick={() => !disabled && handlePopoverOpenChange(!isPopoverOpen)}
                disabled={disabled}
                role="combobox"
                aria-expanded={isPopoverOpen}
                aria-haspopup="listbox"
                aria-controls={isPopoverOpen ? listboxId : undefined}
                aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
                aria-label={`Tree-select: ${selectedValuesLength} selected. ${placeholder}`}
                className={cn(
                  'flex h-auto min-h-8 items-center justify-between rounded-md border border-input bg-transparent px-0! py-1 text-xs shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg]:pointer-events-auto',
                  autoSize ? 'w-auto' : 'w-full',
                  responsiveSetting.compactMode && 'min-h-7 text-xs',
                  screenSize === 'mobile' && 'min-h-12 text-base',
                  disabled && 'cursor-not-allowed opacity-50',
                  triggerClassName
                )}
                style={{
                  ...widthConstraints,
                  maxWidth: `min(${widthConstraints.maxWidth}, 100%)`,
                }}
              >
                {selectedValuesLength > 0 ? (
                  <div className="flex min-w-0 flex-1 items-center justify-between overflow-hidden">
                    <div className="flex min-w-0 flex-wrap items-center gap-1 overflow-hidden">
                      {selectedValues
                        .slice(0, multiple ? responsiveSetting.maxCount : 1)
                        .map((value) => {
                          const label = getLabelForValue(value) ?? value;
                          if (!multiple) {
                            return (
                              <span
                                key={value}
                                className="mx-3 truncate text-xs"
                                style={{ maxWidth: badgeLabelMaxWidth }}
                              >
                                {label}
                              </span>
                            );
                          }

                          const effectiveBadgeAnimation =
                            animationConfig?.badgeAnimation ?? badgeAnimation ?? 'bounce';

                          const badgeClassName = cn(
                            treeSelectVariants({
                              variant,
                              badgeAnimation: effectiveBadgeAnimation,
                            }),
                            responsiveSetting.compactMode && 'px-1.5 py-0.5 text-xs',
                            screenSize === 'mobile' && 'max-w-[120px] truncate',
                            singleLine && 'shrink-0 whitespace-nowrap'
                          );

                          const badgeStyle: CSSProperties = {
                            animationDuration: `${animationConfig?.duration ?? animation ?? 0}s`,
                            animationDelay: `${animationConfig?.delay ?? 0}s`,
                          };

                          const iconClassName = cn(
                            'mr-2 h-4 w-4',
                            responsiveSetting.compactMode && 'mr-1 h-3 w-3'
                          );

                          return (
                            <SelectedTreeItemNode
                              key={value}
                              label={label}
                              badgeLabelMaxWidth={badgeLabelMaxWidth}
                              onRemove={() => toggleNode(value)}
                              badgeClassName={badgeClassName}
                              badgeStyle={badgeStyle}
                              iconClassName={iconClassName}
                              compactMode={responsiveSetting.compactMode}
                            />
                          );
                        })}
                      {multiple && selectedValuesLength > responsiveSetting.maxCount && (
                        <SelectedTreeItemNode
                          key="tree-select-more-indicator"
                          label={`+ ${selectedValuesLength - responsiveSetting.maxCount} more`}
                          badgeLabelMaxWidth={badgeLabelMaxWidth}
                          onRemove={() => {
                            const visible = selectedValues.slice(0, responsiveSetting.maxCount);
                            treeLogic.setSelectedValues(visible);
                          }}
                          badgeClassName={cn(
                            treeSelectVariants({
                              variant,
                              badgeAnimation:
                                animationConfig?.badgeAnimation ?? badgeAnimation ?? 'bounce',
                            }),
                            responsiveSetting.compactMode && 'px-1.5 py-0.5 text-xs',
                            singleLine && 'shrink-0 whitespace-nowrap'
                          )}
                          badgeStyle={{
                            animationDuration: `${animationConfig?.duration ?? animation ?? 0}s`,
                            animationDelay: `${animationConfig?.delay ?? 0}s`,
                          }}
                          compactMode={responsiveSetting.compactMode}
                        />
                      )}
                    </div>
                    {!disableClear && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          clear();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            event.stopPropagation();
                            clear();
                          }
                        }}
                        aria-label={`Clear all ${selectedValuesLength} selected options`}
                        className="mx-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      >
                        <XIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mx-auto flex min-w-0 flex-1 items-center">
                    <span className="mx-3 truncate text-muted-foreground text-xs">
                      {placeholder}
                    </span>
                  </div>
                )}
                <ChevronDown className="mx-2 h-4 shrink-0 cursor-pointer text-muted-foreground" />
              </Button>
            )}
          />

          <PopoverContent
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple}
            aria-label="Available options"
            className={cn('w-(--anchor-width) p-0', popoverClassName)}
            style={{
              maxHeight: popoverMaxHeight ?? (screenSize === 'mobile' ? '70vh' : '60vh'),
              touchAction: 'manipulation',
            }}
            align="start"
          >
            <Command shouldFilter={false}>
              {effectiveSearchable && (
                <CommandInput
                  placeholder="Search..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                  aria-label="Search through available options"
                />
              )}
              <CommandList
                ref={handleListRef}
                className={cn(
                  'max-h-[40vh] overflow-y-auto',
                  screenSize === 'mobile' && 'max-h-[50vh]',
                  'overscroll-behavior-y-contain'
                )}
              >
                {(isAsyncMode && asyncData.isLoading && asyncData.options.length === 0) ||
                isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{loadingText}</span>
                  </div>
                ) : (
                  <>
                    {searchValue && rows.length === 0 && (
                      <CommandEmpty>{emptyIndicator || 'No results found.'}</CommandEmpty>
                    )}

                    {!disableSelectAll && multiple && !searchValue && rows.length > 0 && (
                      <CommandGroup>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start px-2 text-xs"
                          onClick={() => toggleAll()}
                        >
                          <CheckIcon className="mr-2 h-4 w-4" />
                          Select All
                        </Button>
                        <CommandSeparator />
                      </CommandGroup>
                    )}

                    {shouldVirtualize ? (
                      <CommandGroup>
                        <div
                          style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                          }}
                        >
                          {virtualizer.getVirtualItems().map(renderVirtualizedItem)}
                        </div>
                      </CommandGroup>
                    ) : (
                      <CommandGroup>
                        {rows.map((row) => {
                          const selection = selectionMap[row.id];
                          const baseIndent = 8;
                          const indent = row.depth * 16 + baseIndent;
                          const isDisabled = selection?.disabled ?? false;
                          const isParent = !row.isLeaf;
                          const isSelected = multiple
                            ? !!selection?.checked
                            : selectedValuesLength > 0 && selectedValues[0] === row.id;
                          return (
                            <CommandItem
                              key={row.id}
                              value={row.id}
                              onSelect={() => handleSelectNode(row.id)}
                              role="option"
                              aria-selected={isSelected}
                              aria-disabled={isDisabled}
                              disabled={isDisabled}
                              className={cn(
                                'cursor-pointer',
                                !multiple &&
                                  isSelected &&
                                  'bg-primary/5 font-medium text-foreground',
                                isDisabled && 'cursor-not-allowed opacity-50'
                              )}
                            >
                              <div
                                className="flex w-full items-center"
                                style={{ paddingLeft: `${indent}px` }}
                              >
                                <span
                                  className="mr-1 flex h-4 w-4 items-center justify-center"
                                  aria-hidden="true"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (isParent) {
                                      toggleExpanded(row.id);
                                    }
                                  }}
                                >
                                  {isParent ? (
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
                                  <span
                                    className="mr-2 flex h-4 w-4 items-center justify-center"
                                    aria-hidden="true"
                                  >
                                    {row.node.icon}
                                  </span>
                                )}
                                <LongText
                                  maxWidth={optionLabelMaxWidth}
                                  className="text-xs leading-normal"
                                >
                                  {row.node.title}
                                </LongText>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}

                    {isAsyncMode && asyncData.hasMore && !asyncData.isLoading && (
                      <div
                        ref={asyncData.observerTarget}
                        className="flex items-center justify-center py-2"
                      >
                        {asyncData.isLoadingMore && (
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>{loadingMoreText}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between">
                    {selectedValuesLength > 0 && !disableClear && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="flex-1 justify-center text-xs"
                          onClick={() => clear()}
                        >
                          Clear
                        </Button>
                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                      </>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-center text-xs"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

TreeSelectInner.displayName = 'TreeSelectInner';

/**
 * Single-value tree select component.
 *
 * Selects exactly one value. No `multiple` prop needed.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState<string | null>(null);
 * <TreeSelect value={value} onChange={setValue} treeData={data} />
 * ```
 */
export const TreeSelect = React.forwardRef<TreeSelectRef, TreeSelectProps>(
  ({ value, defaultValue, onChange, ...rest }, ref) => {
    const innerValue = value != null ? [value] : value === null ? [] : undefined;
    const innerDefault =
      defaultValue != null ? [defaultValue] : defaultValue === null ? [] : undefined;

    const handleChange = onChange
      ? (nextValues: string[], selectedNodes: TreeSelectItem[]) => {
          const nextValue = nextValues.length > 0 ? nextValues[0] : null;
          onChange(nextValue ?? null, selectedNodes[0]);
        }
      : undefined;

    return (
      <TreeSelectInner
        ref={ref}
        multiple={false}
        value={innerValue}
        defaultValue={innerDefault}
        onChange={handleChange}
        {...rest}
      />
    );
  }
);

TreeSelect.displayName = 'TreeSelect';

/**
 * Multi-value tree select component.
 *
 * Selects multiple values with checkboxes, badges, select-all, etc.
 * No `multiple` prop needed.
 *
 * @example
 * ```tsx
 * const [values, setValues] = useState<string[]>([]);
 * <TreeMultipleSelect value={values} onChange={setValues} treeData={data} />
 * ```
 */
export const TreeMultipleSelect = React.forwardRef<TreeSelectRef, TreeMultipleSelectProps>(
  ({ value, defaultValue, onChange, ...rest }, ref) => {
    const handleChange = onChange
      ? (nextValues: string[], selectedNodes: TreeSelectItem[]) => {
          onChange(nextValues ?? [], selectedNodes);
        }
      : undefined;

    return (
      <TreeSelectInner
        ref={ref}
        multiple={true}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...rest}
      />
    );
  }
);

TreeMultipleSelect.displayName = 'TreeMultipleSelect';
