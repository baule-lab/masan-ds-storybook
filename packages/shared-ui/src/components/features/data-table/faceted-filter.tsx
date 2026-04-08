import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import type { Column } from '@tanstack/react-table';
import type * as React from 'react';
import { Badge } from '../../ui/display/badge';
import { Button } from '../../ui/actions/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../ui/forms/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import { Separator } from '../../ui/display/separator';
import { cn } from '../../../lib/utils';
import { compareSearching } from '../../../utils';

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  noResultPlaceholder?: string;
  clearFilterPlaceholder?: string;
  selectedCountPlaceholder?: React.ReactNode;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

const DEFAULT_SELECTED_COUNT_PLACEHOLDER = 'Selected {count} items';

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  noResultPlaceholder = 'No results found.',
  clearFilterPlaceholder = 'Clear filters',
  selectedCountPlaceholder = DEFAULT_SELECTED_COUNT_PLACEHOLDER,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const isDifferentFromDefaultSelectedCountPlaceholder =
    typeof selectedCountPlaceholder === 'string'
      ? selectedCountPlaceholder !== DEFAULT_SELECTED_COUNT_PLACEHOLDER
      : true;

  const renderSelectedCount = () => {
    if (isDifferentFromDefaultSelectedCountPlaceholder) {
      return selectedCountPlaceholder;
    }

    if (typeof selectedCountPlaceholder === 'string') {
      return selectedCountPlaceholder.replace('{count}', selectedValues.size.toString());
    }

    return selectedCountPlaceholder;
  };

  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircledIcon className="size-4" />
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="info" className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge variant="info" className="rounded-sm px-1 font-normal">
                      {renderSelectedCount()}
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="info"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.label}
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
        <Command filter={compareSearching}>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{noResultPlaceholder}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    withoutCheckIcon
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
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
                    {option.icon && <option.icon className="size-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ms-auto flex h-4 w-4 items-center justify-center text-right font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    {clearFilterPlaceholder}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
