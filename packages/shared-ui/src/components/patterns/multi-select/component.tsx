import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, XCircle, ChevronDown, XIcon, WandSparkles, Loader2 } from 'lucide-react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';

import { cn } from '../../../lib/utils';
import { Button } from '../../ui/actions/button';
import { Separator } from '../../ui/display/separator';
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
import { Badge } from '../../ui/display/badge';
import { useInfiniteScroll } from '../../../hooks/use-infinite-scroll';
import { useControlledState } from '../../../hooks/use-controlled-state';
import { LongText } from '../long-text';
import { SelectedBadgeNode } from '../selected-badge-node/component';
import { suppressScrollOnFocus } from '../../../lib/suppress-scroll-on-focus';

const MAX_VIRTUALIZED_OPTIONS = 30;

/**
 * Animation types and configurations used internally by `MultiSelect`.
 */
interface AnimationConfig {
  /** Badge animation type */
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
  /** Popover animation type */
  popoverAnimation?: 'scale' | 'slide' | 'fade' | 'flip' | 'none';
  /** Option hover animation type */
  optionHoverAnimation?: 'highlight' | 'scale' | 'glow' | 'none';
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva('mx-1 transition-all duration-300 ease-in-out', {
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

/**
 * Option interface for MultiSelect component
 */
interface MultiSelectOption {
  /** The text to display for the option. */
  label: string;
  /** The unique value associated with the option. */
  value: string;
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Custom styling for the option */
  style?: {
    /** Custom badge color */
    badgeColor?: string;
    /** Custom icon color */
    iconColor?: string;
    /** Gradient background for badge */
    gradient?: string;
  };
}

/**
 * Group interface for organizing options
 */
interface MultiSelectGroup {
  /** Group heading */
  heading: string;
  /** Options in this group */
  options: MultiSelectOption[];
}

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'animationConfig' | 'onChange' | 'value' | 'defaultValue'
    >,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects or groups to be displayed in the multi-select component.
   * Optional when using async mode with loadOptions.
   */
  options?: MultiSelectOption[] | MultiSelectGroup[];

  /**
   * Async function to load options with infinite scroll support.
   * When provided, enables async mode and ignores the options prop.
   * @param search - Search query string
   * @param page - Page number for pagination (starts at 1)
   * @returns Promise with options and hasMore flag
   */
  loadOptions?: (
    search: string,
    page: number
  ) => Promise<{
    options: MultiSelectOption[];
    hasMore: boolean;
  }>;

  /**
   * Debounce delay for async search in milliseconds.
   * Only used when loadOptions is provided.
   * Optional, defaults to 300ms.
   */
  debounceMs?: number;

  /**
   * Loading text shown during initial load in async mode.
   * Optional, defaults to "Loading options...".
   */
  loadingText?: string;

  /**
   * Loading text shown when loading more items in async mode.
   * Optional, defaults to "Loading more...".
   */
  loadingMoreText?: string;

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onChange?: (value: string[]) => void;

  /** selected values when the component mounts. */
  value?: string[];

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Advanced animation configuration for different component parts.
   * Optional, allows fine-tuning of various animation effects.
   */
  animationConfig?: AnimationConfig;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Additional class names to apply custom styles to the multi-select trigger button.
   * Optional, can be used to add custom styles.
   */
  triggerClassName?: string;

  /**
   * If true, disables the select all functionality.
   * Optional, defaults to false.
   */
  hideSelectAll?: boolean;

  /**
   * If true, shows search functionality in the popover.
   * If false, hides the search input completely.
   * Optional, defaults to true.
   */
  searchable?: boolean;

  /**
   * Custom empty state message when no options match search.
   * Optional, defaults to "No results found."
   */
  emptyIndicator?: React.ReactNode;

  /**
   * If true, allows the component to grow and shrink with its content.
   * If false, uses fixed width behavior.
   * Optional, defaults to false.
   */
  autoSize?: boolean;

  /**
   * If true, shows badges in a single line with horizontal scroll.
   * If false, badges wrap to multiple lines.
   * Optional, defaults to false.
   */
  singleLine?: boolean;

  /**
   * Custom CSS class for the popover content.
   * Optional, can be used to customize popover appearance.
   */
  popoverClassName?: string;

  /**
   * If true, disables the component completely.
   * Optional, defaults to false.
   */
  disabled?: boolean;

  /**
   * Responsive configuration for different screen sizes.
   * Allows customizing maxCount and other properties based on viewport.
   * Can be boolean true for default responsive behavior or an object for custom configuration.
   */
  responsive?:
    | boolean
    | {
        /** Configuration for mobile devices (< 640px) */
        mobile?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        /** Configuration for tablet devices (640px - 1024px) */
        tablet?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        /** Configuration for desktop devices (> 1024px) */
        desktop?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
      };

  /**
   * Minimum width for the component.
   * Optional, defaults to auto-sizing based on content.
   * When set, component will not shrink below this width.
   */
  minWidth?: string;

  /**
   * Maximum width for the component.
   * Optional, defaults to 100% of container.
   * Component will not exceed container boundaries.
   */
  maxWidth?: string;

  /**
   * If true, automatically removes duplicate options based on their value.
   * Optional, defaults to false (shows warning in dev mode instead).
   */
  deduplicateOptions?: boolean;

  /**
   * If true, the component will reset its internal state when defaultValue changes.
   * Useful for React Hook Form integration and form reset functionality.
   * Optional, defaults to true.
   */
  resetOnDefaultValueChange?: boolean;

  /**
   * If true, automatically closes the popover after selecting an option.
   * Useful for single-selection-like behavior or mobile UX.
   * Optional, defaults to false.
   */
  closeOnSelect?: boolean;

  /**
   * If true, shows a loading indicator in the dropdown.
   * Useful for showing loading state when fetching options externally.
   * Optional, defaults to false.
   */
  isLoading?: boolean;

  /**
   * Estimated item height for virtualization (default: 32px)
   */
  estimateSize?: number;

  /**
   * Enable virtualization for large option lists.
   * When true, only visible items are rendered.
   * Optional, defaults to true when options > 100.
   */
  enableVirtualization?: boolean;

  /**
   * Maximum width for badge labels. Text exceeding this will be truncated with tooltip.
   * Optional, defaults to '120px'.
   */
  badgeLabelMaxWidth?: string;

  /**
   * Maximum width for option labels in dropdown. Text exceeding this will be truncated with tooltip.
   * Optional, defaults to '200px'.
   */
  optionLabelMaxWidth?: string;
}

/**
 * Imperative methods exposed through ref
 */
export interface MultiSelectRef {
  /**
   * Programmatically reset the component to its default value
   */
  reset: () => void;
  /**
   * Get current selected values
   */
  getSelectedValues: () => string[];
  /**
   * Set selected values programmatically
   */
  setSelectedValues: (values: string[]) => void;
  /**
   * Clear all selected values
   */
  clear: () => void;
  /**
   * Focus the component
   */
  focus: () => void;
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      options: localOptions = [],
      loadOptions,
      debounceMs = 300,
      loadingText = 'Loading options...',
      loadingMoreText = 'Loading more...',
      onChange,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      animationConfig,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      triggerClassName,
      hideSelectAll = false,
      searchable = true,
      emptyIndicator,
      autoSize = false,
      singleLine = false,
      popoverClassName,
      disabled = false,
      responsive,
      minWidth,
      maxWidth,
      deduplicateOptions = false,
      resetOnDefaultValueChange = true,
      closeOnSelect = false,
      value,
      isLoading = false,
      estimateSize = 32,
      enableVirtualization,
      badgeLabelMaxWidth = '120px',
      optionLabelMaxWidth = '200px',
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useControlledState<string[]>({
      value,
      defaultValue: defaultValue || [],
      onChange,
    });

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Prevent scroll jump when popover opens.
    // cmdk calls scrollIntoView on the first item and base-ui auto-focuses the popup,
    // both of which cause the browser to scroll the page.
    const handlePopoverOpenChange = React.useCallback((open: boolean) => {
      if (open) {
        suppressScrollOnFocus();
      }
      setIsPopoverOpen(open);
    }, []);

    const selectedValuesLength = selectedValues?.length ?? 0;

    // Async mode detection
    const isAsyncMode = Boolean(loadOptions);

    // Async infinite scroll (only for async mode)
    const asyncData = useInfiniteScroll<MultiSelectOption>({
      loadOptions: loadOptions || (async () => ({ options: [], hasMore: false })),
      debounceMs,
      enabled: isAsyncMode && isPopoverOpen,
      initialSearch: '',
    });

    // Use local search for local mode, async search for async mode
    const [localSearchValue, setLocalSearchValue] = React.useState('');
    const searchValue = isAsyncMode ? asyncData.search : localSearchValue;
    const setSearchValue = isAsyncMode ? asyncData.setSearch : setLocalSearchValue;

    const [politeMessage, setPoliteMessage] = React.useState('');
    const [assertiveMessage, setAssertiveMessage] = React.useState('');
    const prevSelectedCount = React.useRef(selectedValuesLength ?? 0);
    const prevIsOpen = React.useRef(isPopoverOpen);
    const prevSearchValue = React.useRef(searchValue);

    const announce = React.useCallback(
      (message: string, priority: 'polite' | 'assertive' = 'polite') => {
        if (priority === 'assertive') {
          setAssertiveMessage(message);
          setTimeout(() => setAssertiveMessage(''), 100);
        } else {
          setPoliteMessage(message);
          setTimeout(() => setPoliteMessage(''), 100);
        }
      },
      []
    );

    const multiSelectId = React.useId();
    const listboxId = `${multiSelectId}-listbox`;
    const triggerDescriptionId = `${multiSelectId}-description`;
    const selectedCountId = `${multiSelectId}-count`;

    const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

    const isGroupedOptions = React.useCallback(
      (opts: MultiSelectOption[] | MultiSelectGroup[]): opts is MultiSelectGroup[] => {
        return (
          Array.isArray(opts) &&
          opts.length > 0 &&
          typeof opts[0] !== 'undefined' &&
          'heading' in opts[0]
        );
      },
      []
    );

    const arraysEqual = React.useCallback((a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }, []);

    const resetToDefault = React.useCallback(() => {
      setSelectedValues(defaultValue);
      setIsPopoverOpen(false);
      if (isAsyncMode) {
        asyncData.setSearch('');
      } else {
        setLocalSearchValue('');
      }
    }, [defaultValue, onChange, isAsyncMode, asyncData, setLocalSearchValue]);

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        reset: resetToDefault,
        getSelectedValues: () => selectedValues ?? [],
        setSelectedValues: (values: string[]) => {
          setSelectedValues(values);
        },
        clear: () => {
          setSelectedValues([]);
        },
        focus: () => {
          if (buttonRef.current) {
            buttonRef.current.focus();
            const originalOutline = buttonRef.current.style.outline;
            const originalOutlineOffset = buttonRef.current.style.outlineOffset;
            buttonRef.current.style.outline = '2px solid hsl(var(--ring))';
            buttonRef.current.style.outlineOffset = '2px';
            setTimeout(() => {
              if (buttonRef.current) {
                buttonRef.current.style.outline = originalOutline;
                buttonRef.current.style.outlineOffset = originalOutlineOffset;
              }
            }, 1000);
          }
        },
      }),
      [resetToDefault, selectedValues, onChange]
    );

    const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setScreenSize('mobile');
        } else if (width < 1024) {
          setScreenSize('tablet');
        } else {
          setScreenSize('desktop');
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }, []);

    const getResponsiveSettings = () => {
      if (!responsive) {
        return {
          maxCount: maxCount,
          hideIcons: false,
          compactMode: false,
        };
      }
      if (responsive === true) {
        const defaultResponsive = {
          mobile: { maxCount: 2, hideIcons: false, compactMode: true },
          tablet: { maxCount: 4, hideIcons: false, compactMode: false },
          desktop: { maxCount: 6, hideIcons: false, compactMode: false },
        };
        const currentSettings = defaultResponsive[screenSize];
        return {
          maxCount: currentSettings?.maxCount ?? maxCount,
          hideIcons: currentSettings?.hideIcons ?? false,
          compactMode: currentSettings?.compactMode ?? false,
        };
      }
      const currentSettings = responsive[screenSize];
      return {
        maxCount: currentSettings?.maxCount ?? maxCount,
        hideIcons: currentSettings?.hideIcons ?? false,
        compactMode: currentSettings?.compactMode ?? false,
      };
    };

    const responsiveSettings = getResponsiveSettings();

    const getBadgeAnimationClass = () => {
      if (animationConfig?.badgeAnimation) {
        switch (animationConfig.badgeAnimation) {
          case 'bounce':
            return isAnimating ? 'animate-bounce' : 'hover:-translate-y-1 hover:scale-110';
          case 'pulse':
            return 'hover:animate-pulse';
          case 'wiggle':
            return 'hover:animate-wiggle';
          case 'fade':
            return 'hover:opacity-80';
          case 'slide':
            return 'hover:translate-x-1';
          case 'none':
            return '';
          default:
            return '';
        }
      }
      return isAnimating ? 'animate-bounce' : '';
    };

    const getPopoverAnimationClass = () => {
      if (animationConfig?.popoverAnimation) {
        switch (animationConfig.popoverAnimation) {
          case 'scale':
            return 'animate-scaleIn';
          case 'slide':
            return 'animate-slideInDown';
          case 'fade':
            return 'animate-fadeIn';
          case 'flip':
            return 'animate-flipIn';
          case 'none':
            return '';
          default:
            return '';
        }
      }
      return '';
    };

    const getAllOptions = React.useCallback((): MultiSelectOption[] => {
      const options = isAsyncMode ? asyncData.options : localOptions;
      if (!options || options.length === 0) return [];

      // Async mode always returns flat options
      let allOptions: MultiSelectOption[];
      if (isGroupedOptions(options)) {
        allOptions = options.flatMap((group) => group.options);
      } else {
        allOptions = options;
      }

      const valueSet = new Set<string>();
      const duplicates: string[] = [];
      const uniqueOptions: MultiSelectOption[] = [];
      allOptions.forEach((option) => {
        if (valueSet.has(option.value)) {
          duplicates.push(option.value);
          if (!deduplicateOptions) {
            uniqueOptions.push(option);
          }
        } else {
          valueSet.add(option.value);
          uniqueOptions.push(option);
        }
      });

      if (process.env.NODE_ENV === 'development' && duplicates.length > 0) {
        const action = deduplicateOptions ? 'automatically removed' : 'detected';
        console.warn(
          `MultiSelect: Duplicate option values ${action}: ${duplicates.join(', ')}. ` +
            `${
              deduplicateOptions
                ? 'Duplicates have been removed automatically.'
                : "This may cause unexpected behavior. Consider setting 'deduplicateOptions={true}' or ensure all option values are unique."
            }`
        );
      }
      return deduplicateOptions ? uniqueOptions : allOptions;
    }, [isAsyncMode, asyncData.options, localOptions, deduplicateOptions, isGroupedOptions]);

    const getOptionByValue = React.useCallback(
      (value: string): MultiSelectOption | undefined => {
        const option = getAllOptions().find((option) => option.value === value);
        if (!option && process.env.NODE_ENV === 'development') {
          console.warn(`MultiSelect: Option with value "${value}" not found in options list`);
        }
        return option;
      },
      [getAllOptions]
    );

    const filteredOptions = React.useMemo(() => {
      // Async mode: filtering is done server-side via loadOptions
      if (isAsyncMode) {
        return asyncData.options;
      }

      // Local mode: client-side filtering
      if (!searchable || !searchValue) return localOptions;
      if (localOptions.length === 0) return [];

      if (isGroupedOptions(localOptions)) {
        return localOptions
          .map((group) => ({
            ...group,
            options: group.options.filter(
              (option) =>
                option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
                option.value.toLowerCase().includes(searchValue.toLowerCase())
            ),
          }))
          .filter((group) => group.options.length > 0);
      }

      return localOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase())
      );
    }, [isAsyncMode, asyncData.options, localOptions, searchValue, searchable, isGroupedOptions]);

    // Virtualization: compute whether to virtualize and flatten options
    const flatOptionsCount = React.useMemo(() => {
      if (isGroupedOptions(filteredOptions)) {
        return (filteredOptions as MultiSelectGroup[]).reduce(
          (acc, g) => acc + g.options.length,
          0
        );
      }
      return filteredOptions.length;
    }, [filteredOptions, isGroupedOptions]);

    const shouldVirtualize = enableVirtualization ?? flatOptionsCount > MAX_VIRTUALIZED_OPTIONS;

    // Flatten options for virtualization (handles both grouped and flat)
    const flattenedOptions = React.useMemo(() => {
      if (!shouldVirtualize) return [];

      if (isGroupedOptions(filteredOptions)) {
        const result: Array<{ type: 'heading' | 'option'; data: string | MultiSelectOption }> = [];
        for (const group of filteredOptions as MultiSelectGroup[]) {
          result.push({ type: 'heading', data: group.heading });
          for (const opt of group.options) {
            result.push({ type: 'option', data: opt });
          }
        }
        return result;
      }

      return (filteredOptions as MultiSelectOption[]).map((opt) => ({
        type: 'option' as const,
        data: opt,
      }));
    }, [filteredOptions, shouldVirtualize, isGroupedOptions]);

    // Virtualizer setup
    const virtualizer = useVirtualizer({
      count: flattenedOptions.length,
      getScrollElement: () => listRef.current,
      estimateSize: (index) => {
        // Headers are slightly taller
        return flattenedOptions[index]?.type === 'heading' ? 28 : estimateSize;
      },
      overscan: 5,
    });

    // Re-measure when popover opens or options change
    React.useEffect(() => {
      if (isPopoverOpen && shouldVirtualize && flattenedOptions.length > 0) {
        const timer = setTimeout(() => virtualizer.measure(), 0);
        return () => clearTimeout(timer);
      }
    }, [isPopoverOpen, flattenedOptions.length, shouldVirtualize, virtualizer]);

    // Render function for virtualized items
    const renderVirtualizedItem = (virtualItem: VirtualItem) => {
      const item = flattenedOptions[virtualItem.index];
      if (!item) return null;

      const style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
      };

      // Render group heading
      if (item.type === 'heading') {
        return (
          <div
            key={`heading-${virtualItem.index}`}
            style={style}
            className="px-2 py-1.5 font-medium text-muted-foreground text-xs"
          >
            {item.data as string}
          </div>
        );
      }

      // Render option
      const option = item.data as MultiSelectOption;
      const isSelected = selectedValues?.includes(option.value);

      return (
        <CommandItem
          key={option.value}
          value={option.value}
          onSelect={() => toggleOption(option.value)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled}
          style={style}
          className={cn('cursor-pointer', option.disabled && 'cursor-not-allowed opacity-50')}
          disabled={option.disabled}
        >
          <div
            className={cn(
              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
              isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
            )}
          >
            <CheckIcon className="h-4 w-4 text-white" />
          </div>
          {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <LongText maxWidth={optionLabelMaxWidth} className="text-xs leading-normal">
            {option.label}
          </LongText>
        </CommandItem>
      );
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...(selectedValues ?? [])];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;
      const newSelectedValues = selectedValues?.includes(optionValue)
        ? selectedValues?.filter((value) => value !== optionValue)
        : [...(selectedValues ?? []), optionValue];
      setSelectedValues(newSelectedValues);
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    const handleClear = () => {
      if (disabled) return;
      setSelectedValues([]);
    };

    const handleTogglePopover = () => {
      if (disabled) return;
      handlePopoverOpenChange(!isPopoverOpen);
    };

    const clearExtraOptions = () => {
      if (disabled) return;
      const newSelectedValues = selectedValues?.slice(0, responsiveSettings.maxCount) ?? [];
      setSelectedValues(newSelectedValues);
    };

    const toggleAll = () => {
      if (disabled) return;
      const allOptions = getAllOptions().filter((option) => !option.disabled);
      if (selectedValuesLength === allOptions.length) {
        handleClear();
      } else {
        const allValues = allOptions.map((option) => option.value);
        setSelectedValues(allValues);
      }

      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    React.useEffect(() => {
      if (!resetOnDefaultValueChange) return;
      const prevDefaultValue = prevDefaultValueRef.current;
      if (!arraysEqual(prevDefaultValue, defaultValue)) {
        if (!arraysEqual(selectedValues ?? [], defaultValue ?? [])) {
          setSelectedValues(defaultValue);
        }
        prevDefaultValueRef.current = [...defaultValue];
      }
    }, [defaultValue, selectedValues, arraysEqual, resetOnDefaultValueChange]);

    const getWidthConstraints = () => {
      const defaultMinWidth = screenSize === 'mobile' ? '0px' : '200px';
      const effectiveMinWidth = minWidth || defaultMinWidth;
      const effectiveMaxWidth = maxWidth || '100%';
      return {
        minWidth: effectiveMinWidth,
        maxWidth: effectiveMaxWidth,
        width: autoSize ? 'auto' : '100%',
      };
    };

    const widthConstraints = getWidthConstraints();

    React.useEffect(() => {
      if (!isPopoverOpen) {
        if (isAsyncMode) {
          asyncData.setSearch('');
        } else {
          setLocalSearchValue('');
        }
      }
    }, [isPopoverOpen, isAsyncMode, asyncData, setLocalSearchValue]);

    React.useEffect(() => {
      const selectedCount = selectedValuesLength ?? 0;
      const allOptions = getAllOptions();
      const totalOptions = allOptions.filter((opt) => !opt.disabled).length;
      if (selectedCount !== prevSelectedCount.current) {
        const diff = selectedCount - prevSelectedCount.current;
        if (diff > 0) {
          const addedItems = selectedValues?.slice(-diff) ?? [];
          const addedLabels = addedItems
            .map((value) => allOptions.find((opt) => opt.value === value)?.label)
            .filter(Boolean);

          if (addedLabels.length === 1) {
            announce(
              `${addedLabels[0]} selected. ${selectedCount} of ${totalOptions} options selected.`
            );
          } else {
            announce(
              `${addedLabels.length} options selected. ${selectedCount} of ${totalOptions} total selected.`
            );
          }
        } else if (diff < 0) {
          announce(`Option removed. ${selectedCount} of ${totalOptions} options selected.`);
        }
        prevSelectedCount.current = selectedCount;
      }

      if (isPopoverOpen !== prevIsOpen.current) {
        if (isPopoverOpen) {
          announce(
            `Dropdown opened. ${totalOptions} options available. Use arrow keys to navigate.`
          );
        } else {
          announce('Dropdown closed.');
        }
        prevIsOpen.current = isPopoverOpen;
      }

      if (searchValue !== prevSearchValue.current && searchValue !== undefined) {
        if (searchValue && isPopoverOpen) {
          const filteredCount = allOptions.filter(
            (opt) =>
              opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
              opt.value.toLowerCase().includes(searchValue.toLowerCase())
          ).length;

          announce(
            `${filteredCount} option${filteredCount === 1 ? '' : 's'} found for "${searchValue}"`
          );
        }
        prevSearchValue.current = searchValue;
      }
    }, [selectedValues, isPopoverOpen, searchValue, announce, getAllOptions]);

    return (
      <div className={cn('w-full min-w-[200px]', className)}>
        <div className="sr-only">
          <div aria-live="polite" aria-atomic="true" role="status">
            {politeMessage}
          </div>
          <div aria-live="assertive" aria-atomic="true" role="alert">
            {assertiveMessage}
          </div>
        </div>

        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange} modal={modalPopover}>
          <div id={triggerDescriptionId} className="sr-only">
            Multi-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.
          </div>
          <div id={selectedCountId} className="sr-only" aria-live="polite">
            {selectedValuesLength === 0
              ? 'No options selected'
              : `${selectedValuesLength} option${
                  selectedValuesLength === 1 ? '' : 's'
                } selected: ${selectedValues
                  ?.map((value) => getOptionByValue(value)?.label)
                  .filter(Boolean)
                  .join(', ')}`}
          </div>

          <PopoverTrigger
            render={(triggerProps) => (
              <Button
                {...triggerProps}
                ref={(node) => {
                  // Merge triggerProps.ref (for popover positioning) and buttonRef (for imperative methods)
                  if (typeof triggerProps.ref === 'function') {
                    triggerProps.ref(node);
                  } else if (triggerProps.ref) {
                    (triggerProps.ref as React.MutableRefObject<HTMLButtonElement | null>).current =
                      node;
                  }
                  buttonRef.current = node;
                }}
                {...props}
                variant="outline"
                onClick={handleTogglePopover}
                disabled={disabled}
                role="combobox"
                aria-expanded={isPopoverOpen}
                aria-haspopup="listbox"
                aria-controls={isPopoverOpen ? listboxId : undefined}
                aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
                aria-label={`Multi-select: ${selectedValuesLength} of ${
                  getAllOptions().length
                } options selected. ${placeholder}`}
                className={cn(
                  'flex h-auto min-h-8 items-center justify-between rounded-md border border-input bg-transparent px-0 py-1 text-xs shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg]:pointer-events-auto',
                  autoSize ? 'w-auto' : 'w-full',
                  responsiveSettings.compactMode && 'min-h-7 text-xs',
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
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        singleLine ? 'multiselect-singleline-scroll overflow-x-auto' : 'flex-wrap',
                        responsiveSettings.compactMode && 'gap-0.5'
                      )}
                      style={
                        singleLine
                          ? {
                              paddingBottom: '4px',
                            }
                          : {}
                      }
                    >
                      {selectedValues
                        ?.slice(0, responsiveSettings.maxCount)
                        .slice(0, responsiveSettings.maxCount)
                        .map((value) => {
                          const option = getOptionByValue(value);
                          const IconComponent = option?.icon;
                          const customStyle = option?.style;
                          if (!option) {
                            return null;
                          }
                          const badgeStyle: React.CSSProperties = {
                            animationDuration: `${animation}s`,
                            ...(customStyle?.badgeColor && {
                              backgroundColor: customStyle.badgeColor,
                            }),
                            ...(customStyle?.gradient && {
                              background: customStyle.gradient,
                              color: 'white',
                            }),
                          };
                          const badgeClassName = cn(
                            getBadgeAnimationClass(),
                            multiSelectVariants({ variant }),
                            customStyle?.gradient &&
                              'border-transparent text-white dark:text-foreground',
                            responsiveSettings.compactMode && 'px-1.5 py-0.5 text-xs',
                            screenSize === 'mobile' && 'max-w-[120px] truncate',
                            singleLine && 'shrink-0 whitespace-nowrap'
                          );

                          const iconClassName = cn(
                            'mr-2 h-4 w-4',
                            responsiveSettings.compactMode && 'mr-1 h-3 w-3',
                            customStyle?.iconColor && 'text-current'
                          );

                          const iconStyle = customStyle?.iconColor
                            ? { color: customStyle.iconColor }
                            : undefined;

                          return (
                            <SelectedBadgeNode
                              key={value}
                              label={option.label}
                              badgeLabelMaxWidth={badgeLabelMaxWidth}
                              badgeClassName={badgeClassName}
                              badgeStyle={{
                                ...badgeStyle,
                                animationDuration: `${animationConfig?.duration || animation}s`,
                                animationDelay: `${animationConfig?.delay || 0}s`,
                              }}
                              IconComponent={IconComponent}
                              showIcon={!responsiveSettings.hideIcons}
                              iconClassName={iconClassName}
                              iconStyle={iconStyle}
                              compactMode={responsiveSettings.compactMode}
                              onRemove={() => toggleOption(value)}
                              removeAriaLabel={`Remove ${option.label} from selection`}
                            />
                          );
                        })
                        .filter(Boolean)}
                      {selectedValuesLength > responsiveSettings.maxCount && (
                        <Badge
                          className={cn(
                            'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                            getBadgeAnimationClass(),
                            multiSelectVariants({ variant }),
                            responsiveSettings.compactMode && 'px-1.5 py-0.5 text-xs',
                            singleLine && 'shrink-0 whitespace-nowrap',
                            '[&>svg]:pointer-events-auto'
                          )}
                          style={{
                            animationDuration: `${animationConfig?.duration || animation}s`,
                            animationDelay: `${animationConfig?.delay || 0}s`,
                          }}
                        >
                          {`+ ${selectedValuesLength - responsiveSettings.maxCount} more`}
                          <XCircle
                            className={cn(
                              'ml-2 h-4 w-4 cursor-pointer',
                              responsiveSettings.compactMode && 'ml-1 h-3 w-3'
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              clearExtraOptions();
                            }}
                          />
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClear();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            event.stopPropagation();
                            handleClear();
                          }
                        }}
                        aria-label={`Clear all ${selectedValuesLength} selected options`}
                        className="mx-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      >
                        <XIcon className="h-4 w-4" />
                      </div>
                      <Separator orientation="vertical" className="flex h-full min-h-6" />
                      <ChevronDown
                        className="mx-2 h-4 cursor-pointer text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto flex w-full items-center justify-between">
                    <span className="mx-3 text-muted-foreground text-xs">{placeholder}</span>
                    <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                  </div>
                )}
              </Button>
            )}
          />
          <PopoverContent
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label="Available options"
            className={cn(
              'w-auto p-0',
              getPopoverAnimationClass(),
              screenSize === 'mobile' && 'w-[85vw] max-w-[280px]',
              screenSize === 'tablet' && 'w-[70vw] max-w-md',
              screenSize === 'desktop' && 'min-w-[300px]',
              popoverClassName
            )}
            style={{
              animationDuration: `${animationConfig?.duration || animation}s`,
              animationDelay: `${animationConfig?.delay || 0}s`,
              maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
              maxHeight: screenSize === 'mobile' ? '70vh' : '60vh',
              touchAction: 'manipulation',
            }}
            align="start"
          >
            <Command shouldFilter={false}>
              {searchable && (
                <CommandInput
                  placeholder="Search options..."
                  onKeyDown={handleInputKeyDown}
                  value={searchValue}
                  onValueChange={(value) => setSearchValue(value)}
                  aria-label="Search through available options"
                  aria-describedby={`${multiSelectId}-search-help`}
                />
              )}
              {searchable && (
                <div id={`${multiSelectId}-search-help`} className="sr-only">
                  Type to filter options. Use arrow keys to navigate results.
                </div>
              )}
              <CommandList
                ref={listRef}
                className={cn(
                  'multiselect-scrollbar max-h-[40vh] overflow-y-auto',
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
                    <CommandEmpty>{emptyIndicator || 'No results found.'}</CommandEmpty>
                    {!hideSelectAll && !searchValue && (
                      <CommandGroup>
                        <CommandItem
                          key="all"
                          onSelect={toggleAll}
                          role="option"
                          aria-selected={
                            selectedValuesLength ===
                            getAllOptions().filter((opt) => !opt.disabled).length
                          }
                          aria-label={`Select all ${getAllOptions().length} options`}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              selectedValuesLength ===
                                getAllOptions().filter((opt) => !opt.disabled).length
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible'
                            )}
                            aria-hidden="true"
                          >
                            <CheckIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">
                            (Select All
                            {getAllOptions().length > 20
                              ? ` - ${getAllOptions().length} options`
                              : ''}
                            )
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {shouldVirtualize ? (
                      // Virtualized rendering for large lists
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
                    ) : isGroupedOptions(filteredOptions) ? (
                      // Original grouped options rendering
                      filteredOptions.map((group) => (
                        <CommandGroup key={group.heading} heading={group.heading}>
                          {group.options.map((option) => {
                            const isSelected = selectedValues?.includes(option.value);
                            return (
                              <CommandItem
                                key={option.value}
                                onSelect={() => toggleOption(option.value)}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={option.disabled}
                                aria-label={`${option.label}${
                                  isSelected ? ', selected' : ', not selected'
                                }${option.disabled ? ', disabled' : ''}`}
                                className={cn(
                                  'cursor-pointer',
                                  option.disabled && 'cursor-not-allowed opacity-50'
                                )}
                                disabled={option.disabled}
                              >
                                <div
                                  className={cn(
                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'opacity-50 [&_svg]:invisible'
                                  )}
                                  aria-hidden="true"
                                >
                                  <CheckIcon className="h-4 w-4 text-white" />
                                </div>
                                {option.icon && (
                                  <option.icon
                                    className="mr-2 h-4 w-4 text-muted-foreground"
                                    aria-hidden="true"
                                  />
                                )}
                                <LongText
                                  maxWidth={optionLabelMaxWidth}
                                  className="text-xs leading-normal"
                                >
                                  {option.label}
                                </LongText>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      ))
                    ) : (
                      // Original flat options rendering
                      <CommandGroup>
                        {filteredOptions.map((option) => {
                          const isSelected = selectedValues?.includes(option.value);
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => toggleOption(option.value)}
                              role="option"
                              aria-selected={isSelected}
                              aria-disabled={option.disabled}
                              aria-label={`${option.label}${
                                isSelected ? ', selected' : ', not selected'
                              }${option.disabled ? ', disabled' : ''}`}
                              className={cn(
                                'cursor-pointer',
                                option.disabled && 'cursor-not-allowed opacity-50'
                              )}
                              disabled={option.disabled}
                            >
                              <div
                                className={cn(
                                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50 [&_svg]:invisible'
                                )}
                                aria-hidden="true"
                              >
                                <CheckIcon className="h-4 w-4 text-white" />
                              </div>
                              {option.icon && (
                                <option.icon
                                  className="mr-2 h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}
                              <LongText
                                maxWidth={optionLabelMaxWidth}
                                className="text-xs leading-normal"
                              >
                                {option.label}
                              </LongText>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}

                    {/* Infinite scroll trigger for async mode */}
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
                    {selectedValuesLength > 0 && (
                      <>
                        <CommandItem
                          onSelect={handleClear}
                          className="flex-1 cursor-pointer justify-center"
                        >
                          Clear
                        </CommandItem>
                        <Separator orientation="vertical" className="flex h-full min-h-6" />
                      </>
                    )}
                    <CommandItem
                      onSelect={() => setIsPopoverOpen(false)}
                      className="max-w-full flex-1 cursor-pointer justify-center"
                    >
                      Close
                    </CommandItem>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          {animation > 0 && selectedValuesLength > 0 && (
            <WandSparkles
              className={cn(
                'my-2 h-3 w-3 cursor-pointer bg-background text-foreground',
                isAnimating ? '' : 'text-muted-foreground'
              )}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </Popover>
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
export type { MultiSelectOption, MultiSelectGroup, MultiSelectProps };
