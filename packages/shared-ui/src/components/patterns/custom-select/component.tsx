import { useState } from 'react';
import type * as React from 'react';
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
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useControlledState } from '../../../hooks/use-controlled-state';

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

export interface SelectProps {
  /**
   * Array of options to display
   */
  data: SelectOption[];

  /**
   * Current selected value
   */
  value?: string;

  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * Label text displayed above the select
   */
  label?: string;

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
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Required field indicator
   */
  required?: boolean;

  /**
   * Additional className for the wrapper
   */
  className?: string;

  /**
   * Additional className for the trigger button
   */
  triggerClassName?: string;

  /**
   * Whether to show search input
   */
  searchable?: boolean;

  /**
   * Whether to show clear button when value is selected
   */
  clearable?: boolean;
}

export function CustomSelect({
  data = [],
  value: valueProp,
  defaultValue,
  onChange: onChangeProp,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found',
  disabled = false,
  className,
  triggerClassName,
  searchable = true,
  clearable = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [value, onChange] = useControlledState<string>({
    value: valueProp,
    onChange: onChangeProp,
    defaultValue,
  });

  // Find selected option label
  const selectedOption = data.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue === value ? '' : selectedValue);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  // Filter options based on search
  const filteredData =
    searchable && search
      ? data.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
      : data;

  const selectContent = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(props) => (
          <Button
            {...props}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn('h-8 w-full justify-between text-xs', triggerClassName)}
          >
            <span
              className={cn(
                'truncate font-normal',
                value ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {displayValue}
            </span>
            <div className="flex items-center gap-1">
              {clearable && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-sm opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        )}
      />
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command shouldFilter={false}>
          {searchable && (
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={(value) => setSearch(value.trim())}
            />
          )}
          <CommandList>
            {filteredData.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredData.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return <div className={cn('w-full min-w-[200px]', className)}>{selectContent}</div>;
}
