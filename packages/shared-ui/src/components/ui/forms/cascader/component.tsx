'use client';

import * as React from 'react';
import { ChevronRight, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../overlays/popover';
import { useIsMobile } from '../../../../hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../overlays/drawer';

export interface CascaderOption {
  value: string;
  label: React.ReactNode;
  textLabel?: string;
  disabled?: boolean;
  children?: CascaderOption[];
  icon?: React.ReactNode;
}

export interface CascaderProps {
  options: CascaderOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  popupClassName?: string;
  expandTrigger?: 'click' | 'hover';
  displayRender?: (labels: string[], selectedOptions: CascaderOption[]) => React.ReactNode;
  navigationMode?: 'columns' | 'single-panel' | 'auto';
  breadcrumbMode?: 'full' | 'compact';
}

function getStringLabel(option: CascaderOption): string {
  if (option.textLabel) return option.textLabel;
  if (typeof option.label === 'string') return option.label;
  return option.value;
}

export const Cascader = React.forwardRef<HTMLDivElement, CascaderProps>(function Cascader(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Please select',
    disabled = false,
    allowClear = true,
    className,
    popupClassName,
    expandTrigger = 'click',
    displayRender,
    navigationMode = 'auto',
    breadcrumbMode = 'full',
  },
  ref
) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue || []);
  const [expandedPath, setExpandedPath] = React.useState<string[]>([]);
  const [focusedColumn, setFocusedColumn] = React.useState(0);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const isMobile = useIsMobile();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const columnRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  // Compute effective navigation mode based on device
  const effectiveNavigationMode = React.useMemo(() => {
    if (navigationMode === 'auto') {
      return isMobile ? 'single-panel' : 'columns';
    }
    return navigationMode;
  }, [navigationMode, isMobile]);

  const selectedValue = value !== undefined ? value : internalValue;

  const getColumns = React.useCallback(() => {
    const columns: CascaderOption[][] = [options];
    let currentOptions = options;

    for (const val of expandedPath) {
      const found = currentOptions.find((opt) => opt.value === val);
      if (found?.children) {
        columns.push(found.children);
        currentOptions = found.children;
      } else {
        break;
      }
    }

    return columns;
  }, [options, expandedPath]);

  const getSelectedOptions = React.useCallback(
    (vals: string[]): CascaderOption[] => {
      const result: CascaderOption[] = [];
      let currentOptions = options;

      for (const val of vals) {
        const found = currentOptions.find((opt) => opt.value === val);
        if (found) {
          result.push(found);
          currentOptions = found.children || [];
        } else {
          break;
        }
      }

      return result;
    },
    [options]
  );

  const selectedOptions = getSelectedOptions(selectedValue);
  const displayLabels = selectedOptions.map((opt) => getStringLabel(opt));

  const handleSelect = (option: CascaderOption, columnIndex: number) => {
    if (option.disabled) return;

    const newPath = [...expandedPath.slice(0, columnIndex), option.value];

    if (option.children && option.children.length > 0) {
      setExpandedPath(newPath);
      setFocusedColumn(columnIndex + 1);
      setFocusedIndex(0);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.scrollWidth,
            behavior: 'smooth',
          });
        }
        const key = `${columnIndex + 1}-0`;
        columnRefs.current.get(key)?.focus();
      }, 50);
    } else {
      const newSelectedOptions = getSelectedOptions(newPath);
      if (value === undefined) {
        setInternalValue(newPath);
      }
      onChange?.(newPath, newSelectedOptions);
      setOpen(false);
      setExpandedPath([]);
    }
  };

  const handleExpand = (option: CascaderOption, columnIndex: number) => {
    if (option.disabled) return;
    const newPath = [...expandedPath.slice(0, columnIndex), option.value];
    setExpandedPath(newPath);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value === undefined) {
      setInternalValue([]);
    }
    onChange?.([], []);
    setExpandedPath([]);
    setOpen(false);
  };

  // Single-panel navigation handlers
  const handleBack = React.useCallback(() => {
    setExpandedPath((prev) => prev.slice(0, -1));
  }, []);

  const handleNavigateTo = React.useCallback((depth: number) => {
    if (depth < 0) {
      setExpandedPath([]);
    } else {
      setExpandedPath((prev) => prev.slice(0, depth + 1));
    }
  }, []);

  const handleSinglePanelSelect = React.useCallback(
    (option: CascaderOption) => {
      if (option.disabled) return;

      if (option.children && option.children.length > 0) {
        // Navigate into children
        setExpandedPath((prev) => [...prev, option.value]);
      } else {
        // Select leaf node
        const newPath = [...expandedPath, option.value];
        const newSelectedOptions = getSelectedOptions(newPath);

        if (value === undefined) {
          setInternalValue(newPath);
        }
        onChange?.(newPath, newSelectedOptions);
        setOpen(false);
        setExpandedPath([]);
      }
    },
    [expandedPath, getSelectedOptions, value, onChange]
  );

  const handleKeyDown = (
    e: React.KeyboardEvent,
    option: CascaderOption,
    columnIndex: number,
    itemIndex: number,
    columns: CascaderOption[][] // Pass columns as parameter
  ) => {
    const column = columns[columnIndex] || []; // Use columns parameter instead of options
    const hasChildren = option.children && option.children.length > 0;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (itemIndex < column.length - 1) {
          const nextIndex = itemIndex + 1;
          setFocusedIndex(nextIndex);
          const key = `${columnIndex}-${nextIndex}`;
          columnRefs.current.get(key)?.focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (itemIndex > 0) {
          const prevIndex = itemIndex - 1;
          setFocusedIndex(prevIndex);
          const key = `${columnIndex}-${prevIndex}`;
          columnRefs.current.get(key)?.focus();
        }
        break;

      case 'ArrowRight':
      case 'Enter':
        e.preventDefault();
        if (!option.disabled) {
          if (hasChildren) {
            handleSelect(option, columnIndex);
          } else if (e.key === 'Enter') {
            handleSelect(option, columnIndex);
          }
        }
        break;

      case 'ArrowLeft':
      case 'Backspace':
        e.preventDefault();
        if (columnIndex > 0) {
          const newPath = expandedPath.slice(0, columnIndex - 1);
          setExpandedPath(newPath);
          setFocusedColumn(columnIndex - 1);
          const parentColumn = columns[columnIndex - 1] || []; // Use columns parameter
          const parentValue = expandedPath[columnIndex - 1];
          const parentIndex = parentColumn.findIndex((opt) => opt.value === parentValue);
          setFocusedIndex(parentIndex >= 0 ? parentIndex : 0);
          setTimeout(() => {
            const key = `${columnIndex - 1}-${parentIndex >= 0 ? parentIndex : 0}`;
            columnRefs.current.get(key)?.focus();
          }, 50);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setExpandedPath([]);
        break;

      case 'Tab':
        if (!e.shiftKey && hasChildren && expandedPath[columnIndex] === option.value) {
          e.preventDefault();
          setFocusedColumn(columnIndex + 1);
          setFocusedIndex(0);
          const key = `${columnIndex + 1}-0`;
          columnRefs.current.get(key)?.focus();
        } else if (e.shiftKey && columnIndex > 0) {
          e.preventDefault();
          const parentColumn = columns[columnIndex - 1] || []; // Use columns parameter
          const parentValue = expandedPath[columnIndex - 1];
          const parentIndex = parentColumn.findIndex((opt) => opt.value === parentValue);
          setFocusedColumn(columnIndex - 1);
          setFocusedIndex(parentIndex >= 0 ? parentIndex : 0);
          const key = `${columnIndex - 1}-${parentIndex >= 0 ? parentIndex : 0}`;
          columnRefs.current.get(key)?.focus();
        }
        break;
    }
  };

  const displayValue =
    displayLabels.length > 0
      ? displayRender
        ? displayRender(displayLabels, selectedOptions)
        : displayLabels.join(' / ')
      : null;

  const columns = getColumns();

  // Single-panel computed values
  const currentPathOptions = React.useMemo(() => {
    return getSelectedOptions(expandedPath);
  }, [expandedPath, getSelectedOptions]);

  const currentLevelOptions = React.useMemo(() => {
    if (effectiveNavigationMode !== 'single-panel') return [];
    return columns[columns.length - 1] || options;
  }, [effectiveNavigationMode, columns, options]);

  const currentLevelTitle = React.useMemo(() => {
    const lastOption = currentPathOptions[currentPathOptions.length - 1];
    if (lastOption) {
      return `Select ${getStringLabel(lastOption)}`;
    }
    return 'Select Category';
  }, [currentPathOptions]);

  const currentLevelSelectedValue = React.useMemo(() => {
    return selectedValue[expandedPath.length];
  }, [selectedValue, expandedPath.length]);

  const columnsContent = (
    <div
      ref={scrollContainerRef}
      className={cn('flex', isMobile && 'scrollbar-thin overflow-x-auto')}
      role="listbox"
      aria-label={placeholder}
    >
      {columns.map(
        (
          column,
          columnIndex // Iterate over columns instead of options
        ) => (
          <div
            key={columnIndex}
            role="group"
            aria-label={`Level ${columnIndex + 1}`}
            className={cn(
              'max-h-[300px] min-w-[120px] shrink-0 overflow-auto py-1',
              columnIndex !== columns.length - 1 && 'border-border border-r' // Use columns.length
            )}
          >
            {column.map((option, itemIndex) => {
              const isExpanded = expandedPath[columnIndex] === option.value;
              const isSelected = selectedValue[columnIndex] === option.value;
              const hasChildren = option.children && option.children.length > 0;
              const isFocused = focusedColumn === columnIndex && focusedIndex === itemIndex;
              const refKey = `${columnIndex}-${itemIndex}`;

              return (
                <div
                  key={option.value}
                  ref={(el) => {
                    if (el) {
                      columnRefs.current.set(refKey, el);
                    } else {
                      columnRefs.current.delete(refKey);
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  tabIndex={isFocused && open ? 0 : -1}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    isSelected && 'bg-accent text-accent-foreground',
                    isExpanded && 'bg-accent/50',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                  onClick={() => handleSelect(option, columnIndex)}
                  onKeyDown={(e) => handleKeyDown(e, option, columnIndex, itemIndex, columns)} // Pass columns
                  onMouseEnter={() => {
                    if (expandTrigger === 'hover' && hasChildren) {
                      handleExpand(option, columnIndex);
                    }
                  }}
                  onFocus={() => {
                    setFocusedColumn(columnIndex);
                    setFocusedIndex(itemIndex);
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {hasChildren && (
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );

  // Single-panel content (inline for KISS)
  const singlePanelContent = (
    <div className="flex flex-col">
      {/* Header with back button, breadcrumb, and close */}
      <div className="flex items-center justify-between border-border border-b px-3 py-2">
        <div className="flex items-center gap-2">
          {expandedPath.length > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {breadcrumbMode === 'compact' ? (
            <span className="font-semibold text-sm">
              {(() => {
                const lastOption = currentPathOptions[currentPathOptions.length - 1];
                return lastOption ? getStringLabel(lastOption) : placeholder;
              })()}
            </span>
          ) : (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
              <button
                type="button"
                onClick={() => handleNavigateTo(-1)}
                className={cn(
                  'hover:underline',
                  currentPathOptions.length === 0 ? 'font-semibold' : 'text-muted-foreground'
                )}
              >
                {placeholder}
              </button>
              {currentPathOptions.map((option, index) => (
                <React.Fragment key={option.value}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => handleNavigateTo(index)}
                    className={cn(
                      'hover:underline',
                      index === currentPathOptions.length - 1
                        ? 'font-semibold'
                        : 'text-muted-foreground'
                    )}
                  >
                    {getStringLabel(option)}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Level title */}
      <div className="px-3 py-1.5">
        <h3 className="font-medium text-muted-foreground text-sm">{currentLevelTitle}</h3>
      </div>

      {/* Options list */}
      <div
        className="flex flex-col gap-1.5 overflow-y-auto px-3 pb-3"
        role="listbox"
        aria-label="Options"
      >
        {currentLevelOptions.map((option) => {
          const hasChildren = option.children && option.children.length > 0;
          const isSelected = option.value === currentLevelSelectedValue;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSinglePanelSelect(option)}
              disabled={option.disabled}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5 text-left transition-colors',
                'hover:bg-accent focus:bg-accent focus:outline-none',
                isSelected && 'bg-accent ring-2 ring-primary',
                option.disabled && 'cursor-not-allowed opacity-50'
              )}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled}
            >
              {option.icon && (
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {option.icon}
                </span>
              )}
              <span className="flex-1 font-medium">{option.label}</span>
              {hasChildren && (
                <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // For single-panel, start at root or parent of selected
      if (effectiveNavigationMode === 'single-panel') {
        setExpandedPath(selectedValue.slice(0, -1));
      } else {
        setExpandedPath(
          selectedValue.slice(0, -1).length > 0 ? selectedValue.slice(0, -1) : selectedValue
        );
      }
      setFocusedColumn(0);
      setFocusedIndex(0);
      // Only set initial focus for columns mode
      if (effectiveNavigationMode === 'columns') {
        setTimeout(() => {
          const key = '0-0';
          columnRefs.current.get(key)?.focus();
        }, 50);
      }
    } else {
      setExpandedPath([]);
    }
  };

  const renderTrigger = (triggerRef?: React.Ref<HTMLDivElement>) => (
    <div
      ref={triggerRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'h-10 w-[200px] cursor-pointer px-4 py-2',
        !displayValue && 'text-muted-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled) setOpen(!open);
        }
      }}
    >
      <span className="flex-1 truncate text-left font-normal">{displayValue || placeholder}</span>
      <div className="flex shrink-0 items-center gap-1">
        {allowClear && displayValue && !disabled && (
          <X
            className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
            onClick={handleClear}
            aria-label="Clear selection"
          />
        )}
        <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger disabled={disabled}>{renderTrigger(ref)}</DrawerTrigger>
        <DrawerContent className={cn('px-0', popupClassName)}>
          {effectiveNavigationMode === 'single-panel' ? (
            singlePanelContent
          ) : (
            <>
              <DrawerHeader className="pb-2">
                <DrawerTitle className="font-medium text-sm">{placeholder}</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6">{columnsContent}</div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger disabled={disabled}>{renderTrigger(ref)}</PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', popupClassName)} align="start">
        {effectiveNavigationMode === 'single-panel' ? (
          <div className="min-w-[280px]">{singlePanelContent}</div>
        ) : (
          columnsContent
        )}
      </PopoverContent>
    </Popover>
  );
});
