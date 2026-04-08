import * as React from 'react';
import { useControlledState } from '../../../../hooks/use-controlled-state';
import { useInfiniteScroll } from '../../../../hooks/use-infinite-scroll';
import { useDebouncedValue } from '../../../../hooks/use-debounced-value';
import type { TreeSelectItem, TreeSelectInnerProps } from '../types';

type NormalizedId = string;

export type TreeSelectRow = {
  id: NormalizedId;
  node: TreeSelectItem;
  depth: number;
  parentId?: NormalizedId;
  isLeaf: boolean;
  isExpanded: boolean;
};

export type SelectionState = {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
};

export type UseTreeSelectLogicResult = {
  /** Controlled/uncontrolled selected values (array contract). */
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;

  /** Async mode flag and data (when loadOptions is provided). */
  isAsyncMode: boolean;
  asyncData:
    | ReturnType<typeof useInfiniteScroll<TreeSelectItem>>
    | {
        options: TreeSelectItem[];
        search: string;
        setSearch: (value: string) => void;
        page: number;
        hasMore: boolean;
        isLoading: boolean;
        isLoadingMore: boolean;
        observerTarget: React.Ref<HTMLDivElement>;
        fetchOptions: () => Promise<void>;
        reset: () => void;
      };

  /** Effective search value and setter (local or async). */
  searchValue: string;
  setSearchValue: (value: string) => void;

  /** Flattened rows for rendering / virtualization. */
  rows: TreeSelectRow[];

  /** Map of node id to selection state (checked/indeterminate/disabled). */
  selectionMap: Record<NormalizedId, SelectionState>;

  /** Toggle a single node with cascade behavior. */
  toggleNode: (id: NormalizedId) => void;

  /** Toggle all selectable nodes. */
  toggleAll: () => void;

  /** Clear all selections. */
  clear: () => void;

  /** Utility: get display label for a selected value. */
  getLabelForValue: (value: string) => string | undefined;

  /** Expand/collapse a single node. */
  toggleExpanded: (id: NormalizedId) => void;

  /** Reset view-related state such as search and expanded nodes. */
  resetViewState: () => void;
};

const normalizeId = (value: string): NormalizedId => value;

type BuildMapsResult = {
  rows: TreeSelectRow[];
  byId: Map<NormalizedId, TreeSelectItem>;
  parents: Map<NormalizedId, NormalizedId | undefined>;
  children: Map<NormalizedId, NormalizedId[]>;
};

const buildTreeMaps = (tree: TreeSelectItem[], expandedIds: Set<NormalizedId>): BuildMapsResult => {
  const rows: TreeSelectRow[] = [];
  const byId = new Map<NormalizedId, TreeSelectItem>();
  const parents = new Map<NormalizedId, NormalizedId | undefined>();
  const children = new Map<NormalizedId, NormalizedId[]>();

  const visit = (
    nodes: TreeSelectItem[] | undefined,
    depth: number,
    parentId?: NormalizedId,
    parentVisible = true
  ) => {
    if (!nodes || nodes.length === 0) return;
    for (const node of nodes) {
      const id = normalizeId(node.value);
      byId.set(id, node);
      parents.set(id, parentId);

      const childNodes = node.children ?? [];
      const childIds: NormalizedId[] = childNodes.map((c) => normalizeId(c.value));
      children.set(id, childIds);

      const isExpanded = childNodes.length > 0 ? expandedIds.has(id) : false;
      const isLeaf = childNodes.length === 0;
      const isVisible = depth === 0 || parentVisible;

      if (isVisible) {
        rows.push({
          id,
          node,
          depth,
          parentId,
          isLeaf,
          isExpanded,
        });
      }

      const nextParentVisible = isVisible && isExpanded;
      visit(childNodes, depth + 1, id, nextParentVisible);
    }
  };

  visit(tree, 0, undefined, true);

  return { rows, byId, parents, children };
};

const collectDescendantLeaves = (
  id: NormalizedId,
  children: Map<NormalizedId, NormalizedId[]>
): NormalizedId[] => {
  const result: NormalizedId[] = [];
  const stack: NormalizedId[] = [id];

  while (stack.length) {
    const current = stack.pop();
    if (current === undefined) {
      continue;
    }
    const childIds = children.get(current) ?? [];

    if (childIds.length === 0) {
      result.push(current);
    } else {
      for (const child of childIds) {
        stack.push(child);
      }
    }
  }

  return result;
};

const buildSelectionMap = (
  allIds: NormalizedId[],
  children: Map<NormalizedId, NormalizedId[]>,
  byId: Map<NormalizedId, TreeSelectItem>,
  selected: Set<NormalizedId>
): Record<NormalizedId, SelectionState> => {
  const map: Record<NormalizedId, SelectionState> = {};

  const computeState = (id: NormalizedId): SelectionState => {
    const existing = map[id];
    if (existing) {
      return existing;
    }

    const node = byId.get(id);
    const disabled = Boolean(node?.disabled || node?.disableCheckbox);
    const childIds = children.get(id) ?? [];

    if (childIds.length === 0) {
      const checked = selected.has(id);
      const state: SelectionState = { checked, indeterminate: false, disabled };
      map[id] = state;
      return state;
    }

    let allChildrenChecked = true;
    let anyChildChecked = false;

    for (const childId of childIds) {
      const childState = computeState(childId);
      if (childState.checked || childState.indeterminate) {
        anyChildChecked = true;
      }
      if (!childState.checked || childState.indeterminate) {
        allChildrenChecked = false;
      }
    }

    const checked = allChildrenChecked && !disabled;
    const indeterminate = !checked && anyChildChecked;
    const state: SelectionState = { checked, indeterminate, disabled };
    map[id] = state;
    return state;
  };

  for (const id of allIds) {
    if (!map[id]) {
      map[id] = computeState(id);
    }
  }

  return map;
};

type InternalTreeSelectProps = {
  treeData: TreeSelectItem[];
  value?: string[] | string | null;
  defaultValue?: string[] | string | null;
  multiple?: boolean;
  loadOptions?: TreeSelectInnerProps['loadOptions'];
  debounceMs?: TreeSelectInnerProps['debounceMs'];
  defaultExpandAll?: boolean;
  observerRoot?: Element | Document | null;
  isOpen?: boolean;
  /**
   * Internal normalized `onChange` that always receives `string[]`
   * and the corresponding `TreeSelectItem[]`, regardless of single
   * or multiple mode.
   */
  onChange?: (value: string[], selectedNodes: TreeSelectItem[]) => void;
};

const normalizeToArray = (
  value: InternalTreeSelectProps['value'],
  multiple: boolean
): string[] | undefined => {
  if (multiple) {
    return value as string[] | undefined;
  }
  const single = (value as string | null | undefined) ?? null;
  if (single == null) return [];
  return [single];
};

const normalizeDefaultToArray = (
  defaultValue: InternalTreeSelectProps['defaultValue'],
  multiple: boolean
): string[] | undefined => {
  if (multiple) {
    return defaultValue as string[] | undefined;
  }
  const single = (defaultValue as string | null | undefined) ?? null;
  if (single == null) return [];
  return [single];
};

export function useTreeSelectLogic(props: InternalTreeSelectProps): UseTreeSelectLogicResult {
  const {
    treeData,
    value,
    defaultValue,
    onChange,
    loadOptions,
    debounceMs = 300,
    multiple = true,
    defaultExpandAll = false,
    observerRoot = null,
    isOpen = true,
  } = props;

  const normalizedValue = normalizeToArray(value, multiple);
  const normalizedDefaultValue = normalizeDefaultToArray(defaultValue, multiple);

  const [selectedValues, setSelectedValues] = useControlledState<string[]>({
    value: normalizedValue,
    defaultValue: normalizedDefaultValue ?? [],
    // We intentionally do not forward `onChange` directly so that we can
    // also provide the resolved `TreeSelectItem[]` to callers.
    onChange: (nextValues) => {
      const safeValues = nextValues ?? [];
      // `byId` is populated after the first render and kept stable via `useMemo`,
      // so it's safe to read here when changes actually occur (post-mount).
      const selectedNodes: TreeSelectItem[] = safeValues
        .map((id) => byId.get(id))
        .filter((node): node is TreeSelectItem => Boolean(node));
      onChange?.(safeValues, selectedNodes);
    },
  });

  const isAsyncMode = Boolean(loadOptions);

  const infiniteScroll = useInfiniteScroll<TreeSelectItem>({
    loadOptions: async (search, page) => {
      if (!loadOptions) {
        return { options: [], hasMore: false };
      }
      return loadOptions(search, page);
    },
    debounceMs,
    enabled: isAsyncMode && isOpen,
    initialSearch: '',
    observerRoot,
  });

  const asyncData = isAsyncMode
    ? infiniteScroll
    : {
        options: treeData,
        search: '',
        setSearch: () => {},
        page: 1,
        hasMore: false,
        isLoading: false,
        isLoadingMore: false,
        error: null,
        observerTarget: () => {},
        fetchOptions: async () => {},
        reset: () => {},
      };

  // NOTE:
  // - In async mode, `asyncData.options` is expected to already contain
  //   hierarchical `TreeSelectItem[]` with `children` populated when you
  //   want true tree behaviour (expand/collapse, indentation).
  // - If your `loadOptions` implementation returns a flat list of items
  //   with no `children`, the component will intentionally behave like a
  //   flat infinite list instead of a tree.
  const [localSearchValue, setLocalSearchValue] = React.useState('');
  const searchValue = isAsyncMode ? asyncData.search : localSearchValue;
  const setSearchValue = (val: string) => {
    if (isAsyncMode) {
      asyncData.setSearch(val);
    } else {
      setLocalSearchValue(val);
    }
  };

  /**
   * Debounced search value used for expensive operations such as
   * filtering the tree. This keeps the input responsive while
   * avoiding re-filtering on every keystroke.
   */
  const debouncedSearch = useDebouncedValue(searchValue, debounceMs);

  const createInitialExpandedIds = (
    source: TreeSelectItem[],
    expandAll: boolean
  ): Set<NormalizedId> => {
    // Always expand root nodes so the first level is visible.
    const initial = new Set(source.map((n) => normalizeId(n.value)));

    // Optionally expand all expandable nodes (those with children).
    if (expandAll) {
      const visit = (nodes: TreeSelectItem[] | undefined) => {
        if (!nodes) return;
        for (const node of nodes) {
          const id = normalizeId(node.value);
          if (node.children && node.children.length > 0) {
            initial.add(id);
            visit(node.children);
          }
        }
      };
      visit(source);
    }

    return initial;
  };

  const [expandedIds, setExpandedIds] = React.useState<Set<NormalizedId>>(() => {
    const source = (isAsyncMode ? asyncData.options : treeData) ?? [];
    return createInitialExpandedIds(source, defaultExpandAll);
  });

  const toggleExpanded = React.useCallback((id: NormalizedId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetViewState = React.useCallback(() => {
    // Reset search value and avoid triggering destructive option replacement in
    // async mode (e.g. close/reopen flow).
    if (isAsyncMode) {
      asyncData.setSearch('', { skipFetch: true });
    } else {
      setLocalSearchValue('');
    }

    // Reset expanded state back to the initial configuration.
    const source = (isAsyncMode ? asyncData.options : treeData) ?? [];
    setExpandedIds(createInitialExpandedIds(source, defaultExpandAll));
  }, [isAsyncMode, asyncData, treeData, defaultExpandAll]);

  const effectiveTree = React.useMemo<TreeSelectItem[]>(() => {
    const source = (isAsyncMode ? asyncData.options : treeData) ?? [];
    if (!debouncedSearch) return source;

    const matches = (node: TreeSelectItem): boolean => {
      const titleText =
        typeof node.title === 'string'
          ? node.title
          : // Fallback for non-string titles: rely on value
            '';
      const valueText = String(node.value);
      const query = debouncedSearch.toLowerCase();
      return titleText.toLowerCase().includes(query) || valueText.toLowerCase().includes(query);
    };

    const filterTree = (nodes: TreeSelectItem[] | undefined): TreeSelectItem[] => {
      if (!nodes) return [];
      const result: TreeSelectItem[] = [];
      for (const node of nodes) {
        const childFiltered = filterTree(node.children);
        if (matches(node) || childFiltered.length > 0) {
          result.push({
            ...node,
            children: childFiltered.length > 0 ? childFiltered : node.children,
          });
        }
      }
      return result;
    };

    return filterTree(source);
  }, [isAsyncMode, asyncData.options, treeData, debouncedSearch]);

  const {
    rows,
    byId,
    children: childrenMap,
  } = React.useMemo(() => buildTreeMaps(effectiveTree, expandedIds), [effectiveTree, expandedIds]);

  const selectedSet = React.useMemo(() => new Set<string>(selectedValues ?? []), [selectedValues]);

  const selectionMap = React.useMemo(
    () =>
      buildSelectionMap(
        rows.map((r) => r.id),
        childrenMap,
        byId,
        selectedSet
      ),
    [rows, childrenMap, byId, selectedSet]
  );

  const toggleNode = React.useCallback(
    (id: NormalizedId) => {
      const node = byId.get(id);
      if (!node || node.disabled || node.disableCheckbox) return;

      if (!multiple) {
        const next = new Set<string>(selectedSet);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.clear();
          next.add(id);
        }
        setSelectedValues(Array.from(next));
      } else {
        const affectedLeafIds = collectDescendantLeaves(id, childrenMap);
        const allSelected = affectedLeafIds.every((nid) => selectedSet.has(nid));

        const next = new Set(selectedSet);
        if (allSelected) {
          for (const nid of affectedLeafIds) {
            next.delete(nid);
          }
        } else {
          for (const nid of affectedLeafIds) {
            const n = byId.get(nid);
            if (n && !n.disabled && !n.disableCheckbox) {
              next.add(nid);
            }
          }
        }

        setSelectedValues(Array.from(next));
      }
    },
    [byId, childrenMap, selectedSet, setSelectedValues, multiple]
  );

  const clear = React.useCallback(() => {
    setSelectedValues([]);
  }, [setSelectedValues]);

  const toggleAll = React.useCallback(() => {
    const selectableLeafIds: NormalizedId[] = [];

    for (const [id, node] of byId) {
      const childIds = childrenMap.get(id) ?? [];
      const isLeaf = childIds.length === 0;
      if (isLeaf && !node.disabled && !node.disableCheckbox) {
        selectableLeafIds.push(id);
      }
    }

    const allSelected =
      selectableLeafIds.length > 0 && selectableLeafIds.every((id) => selectedSet.has(id));

    if (allSelected) {
      clear();
    } else {
      setSelectedValues(selectableLeafIds);
    }
  }, [byId, childrenMap, selectedSet, clear, setSelectedValues]);

  const getLabelForValue = React.useCallback(
    (valueStr: string): string | undefined => {
      const node = byId.get(valueStr);
      if (!node) return undefined;
      if (typeof node.title === 'string') return node.title;
      return String(node.value);
    },
    [byId]
  );

  return {
    selectedValues: selectedValues ?? [],
    setSelectedValues: (vals: string[]) => setSelectedValues(vals),
    isAsyncMode,
    asyncData,
    searchValue,
    setSearchValue,
    rows,
    selectionMap,
    toggleNode,
    toggleAll,
    clear,
    getLabelForValue,
    toggleExpanded,
    resetViewState,
  };
}
