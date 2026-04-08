import type * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { treeSelectVariants } from './component';

export interface AnimationConfig {
  /** Badge animation type */
  badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * Single tree node used by TreeSelect / TreeMultipleSelect.
 */
export type TreeSelectItem = {
  /** Node label shown in the list. */
  title: React.ReactNode;
  /** Unique value for the node. */
  value: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Disable selection of this node (and optionally its subtree). */
  disabled?: boolean;
  /** Disable checkbox UI for this node only (keeps it in the tree). */
  disableCheckbox?: boolean;
  /** Child nodes in the tree. */
  children?: TreeSelectItem[];
};

/**
 * Imperative methods exposed through ref.
 */
export type TreeSelectRef = {
  /** Programmatically reset the component to its default value. */
  reset: () => void;
  /** Get current selected values. */
  getSelectedValues: () => string[];
  /** Set selected values programmatically. */
  setSelectedValues: (values: string[]) => void;
  /** Clear all selected values. */
  clear: () => void;
  /** Focus the component. */
  focus: () => void;
};

// ─── Responsive config (shared) ─────────────────────────────────────────────
export type ResponsiveConfig =
  | boolean
  | {
      mobile?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
      tablet?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
      desktop?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
    };

// ─── Shared base (no value / onChange / mode-specific props) ────────────────
type SharedTreeSelectProps = {
  /** Hierarchical data to render in the tree. */
  treeData: TreeSelectItem[];

  /** Async loader for remote tree data with infinite scroll support. */
  loadOptions?: (
    search: string,
    page: number
  ) => Promise<{
    options: TreeSelectItem[];
    hasMore: boolean;
  }>;

  /** Debounce delay for async search (ms). Defaults to 300. */
  debounceMs?: number;

  /** Loading text shown during initial async load. */
  loadingText?: string;

  /** Loading text shown when loading more async items. */
  loadingMoreText?: string;

  /** Custom empty state when no items match search. */
  emptyIndicator?: React.ReactNode;

  /** Placeholder when no values are selected. */
  placeholder?: string;

  /** Disable the component completely. */
  disabled?: boolean;

  /** Whether the search input is rendered. Defaults to `true`. */
  searchable?: boolean;

  /** Disable the clear-all action in the footer. */
  disableClear?: boolean;

  /**
   * When true, expands all expandable nodes by default on first render.
   */
  defaultExpandAll?: boolean;

  /** Whether the popover is modal. */
  modalPopover?: boolean;

  /** Callback when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Root container class name. */
  className?: string;

  /** Trigger button class name. */
  triggerClassName?: string;

  /** Popover content class name. */
  popoverClassName?: string;

  /** If true, component width adapts to content instead of filling container. */
  autoSize?: boolean;

  /** Minimum width for the component. */
  minWidth?: string;

  /** Maximum width for the component. */
  maxWidth?: string;

  /**
   * Maximum height for the dropdown popover.
   * Accepts any valid CSS size (e.g. "320px", "60vh").
   */
  popoverMaxHeight?: string;

  /** Estimated row height for virtualization (default: 32px). */
  estimateSize?: number;

  /** Enable virtualization for large trees. */
  enableVirtualization?: boolean;

  /** Maximum width for option labels in the dropdown. */
  optionLabelMaxWidth?: string;

  /** External loading flag for async mode. */
  isLoading?: boolean;
};

// ─── TreeSelect (single-value) ──────────────────────────────────────────────

/**
 * Props for the **single-value** `TreeSelect` component.
 *
 * - `value` / `defaultValue` are `string | null`.
 * - `onChange` receives a single `string | null` and the corresponding node.
 *
 * Example:
 * ```tsx
 * const [value, setValue] = useState<string | null>(null);
 * <TreeSelect value={value} onChange={setValue} treeData={data} />
 * ```
 */
export type TreeSelectProps = SharedTreeSelectProps & {
  /** Controlled selected value. */
  value?: string | null;
  /** Default selected value when the component mounts. */
  defaultValue?: string | null;
  /**
   * Change callback.
   *
   * - `value` is the selected id, or `null` when cleared.
   * - `selectedNode` is the corresponding node when selected.
   */
  onChange?: (value: string | null, selectedNode: TreeSelectItem | undefined) => void;
};

// ─── TreeMultipleSelect (multi-value) ──────────────────────────────────────────

/**
 * Props for the **multi-value** `TreeMultipleSelect` component.
 *
 * - `value` / `defaultValue` are `string[]`.
 * - `onChange` receives a `string[]` and corresponding `TreeSelectItem[]`.
 *
 * Example:
 * ```tsx
 * const [value, setValue] = useState<string[]>([]);
 * <TreeMultipleSelect value={value} onChange={setValue} treeData={data} />
 * ```
 */
export type TreeMultipleSelectProps = SharedTreeSelectProps &
  VariantProps<typeof treeSelectVariants> & {
    /** Controlled selected values. */
    value?: string[];
    /** Default selected values when the component mounts. */
    defaultValue?: string[];
    /**
     * Change callback.
     *
     * - `value` is the full list of selected ids.
     * - `selectedNodes` are the corresponding node objects.
     */
    onChange?: (value: string[], selectedNodes: TreeSelectItem[]) => void;

    /** Maximum number of badges to show before summarizing. */
    maxCount?: number;

    /** Disable the select-all checkbox in the list. */
    disableSelectAll?: boolean;

    /** Select all selectable leaf nodes on first render. */
    defaultSelectAll?: boolean;

    /** If true, badges render in a single horizontally scrollable line. */
    singleLine?: boolean;

    /** Maximum width for badge labels; text beyond this is truncated with tooltip. */
    badgeLabelMaxWidth?: string;

    /** Animation duration in seconds for visual effects on badges. */
    animation?: number;

    /** Advanced animation configuration for different component parts. */
    animationConfig?: AnimationConfig;

    /** Responsive configuration for different screen sizes. */
    responsive?: ResponsiveConfig;
  };

// ─── Internal type (used by TreeSelectInner only) ───────────────────────────

/** @internal Combined props accepted by the shared inner implementation. */
export type TreeSelectInnerProps = SharedTreeSelectProps &
  VariantProps<typeof treeSelectVariants> & {
    multiple: boolean;
    value?: string[] | string | null;
    defaultValue?: string[] | string | null;
    onChange?: TreeMultipleSelectProps['onChange'] | TreeSelectProps['onChange'];
    maxCount?: number;
    disableSelectAll?: boolean;
    defaultSelectAll?: boolean;
    singleLine?: boolean;
    badgeLabelMaxWidth?: string;
    animation?: number;
    animationConfig?: AnimationConfig;
    responsive?: ResponsiveConfig;
  };
