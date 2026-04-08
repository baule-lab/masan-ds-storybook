import { CheckIcon, MagnifyingGlassIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import type * as React from 'react';
import { Badge } from '../../../ui/display/badge';
import { Button } from '../../../ui/actions/button';
import { Input } from '../../../ui/forms/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/overlays/popover';
import { Separator } from '../../../ui/display/separator';
import { Skeleton } from '../../../ui/feedback/skeleton';
import { VirtualizedContainer as VirtualizedList } from '../../../patterns/virtualized-list';
import { cn } from '../../../../lib/utils';
import { useControlledState } from '../../../../hooks/use-controlled-state';

type DataTableFacetedFilterLabels = {
  selectedCount: (count: number) => string;
  clear: string;
};

type DataTableFacetedFilterProps = {
  label?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onChange?: (value: string[]) => void;
  value: string[];
  labels?: Partial<DataTableFacetedFilterLabels>;
};

const defaultFacetedFilterLabels: DataTableFacetedFilterLabels = {
  selectedCount: (count) => `${count} selected`,
  clear: 'Clear filters',
};

export const FormDataTableFacetedFilter = ({
  label,
  options,
  onChange: onChangeProp,
  value: valueProp,
  labels,
}: DataTableFacetedFilterProps) => {
  const mergedLabels = { ...defaultFacetedFilterLabels, ...labels };

  const [valueState, setValue] = useControlledState({
    defaultValue: [],
    value: valueProp,
    onChange: onChangeProp,
  });

  const value = valueState ?? [];

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [debouncedInputLoading, setDebouncedInputLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== undefined) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = undefined;
      }
    };
  }, []);

  // Custom filtering logic
  const filteredOptions = useMemo(() => {
    if (!debouncedSearchValue) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
        option.value.toLowerCase().includes(debouncedSearchValue.toLowerCase())
    );
  }, [options, debouncedSearchValue]);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    setValue(newValue);
  };

  const handleClear = () => {
    setValue([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Clear search values when popover closes
      setSearchValue('');
      setDebouncedSearchValue('');
      setDebouncedInputLoading(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircledIcon className="size-4" />
            {label}
            {value.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="info" className="rounded-sm px-1 font-normal lg:hidden">
                  {value.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {value.length > 2 ? (
                    <Badge variant="info" className="rounded-sm px-1 font-normal">
                      {mergedLabels.selectedCount(value.length)}
                    </Badge>
                  ) : (
                    options
                      .filter((option) => value.includes(option.value))
                      .map((option) => (
                        <Badge
                          variant="info"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          <span className="max-w-[150px] truncate">{option.label}</span>
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        )}
      />
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex flex-col">
          <div className="border-b p-2">
            <Input
              placeholder={label}
              value={searchValue}
              onChange={(e) => {
                const newValue = e.target.value;
                setSearchValue(newValue);

                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }

                // Update immediately if empty, otherwise debounce
                if (newValue === '') {
                  setDebouncedSearchValue('');
                  setDebouncedInputLoading(false);
                } else {
                  setDebouncedInputLoading(true);
                  debounceTimerRef.current = setTimeout(() => {
                    setDebouncedSearchValue(newValue);
                    setDebouncedInputLoading(false);
                  }, 300);
                }
              }}
              prefixIcon={<MagnifyingGlassIcon className="size-4" />}
              className="h-8"
            />
          </div>
          {/* Important: debouncedInputLoading to reinitialize the virtualized list after search */}
          {debouncedInputLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5"
                >
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="ml-2 h-4 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div role="listbox" aria-multiselectable="true">
              <VirtualizedList
                data={filteredOptions}
                renderItem={(item, _index, _virtualItem) => {
                  const isSelected = value.includes(item.value);
                  return (
                    <div
                      className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                      onClick={() => handleSelect(item.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(item.value);
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                    >
                      <div
                        className={cn(
                          'flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className={cn('h-4 w-4 text-background')} />
                      </div>
                      {item.icon && <item.icon className="ml-2 size-4 text-muted-foreground" />}
                      <span className="ml-2">{item.label}</span>
                    </div>
                  );
                }}
              />
            </div>
          )}
          {value.length > 0 && (
            <>
              <Separator />
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex w-full cursor-default select-none items-center justify-center rounded-sm px-2 py-1.5 text-center text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  {mergedLabels.clear}
                </button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
