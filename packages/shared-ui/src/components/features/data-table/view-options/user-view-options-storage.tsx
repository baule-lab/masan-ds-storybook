import type { RowData, Table, TableFeature, VisibilityState } from '@tanstack/react-table';
import { useState } from 'react';

const STORAGE_KEY_PREFIX = 'table-view-options';

function getCurrentPathname(): string {
  if (globalThis.window !== undefined && globalThis.window?.location?.pathname) {
    return globalThis.window.location.pathname;
  }

  return 'default';
}

function getStorageKey(pathname: string): string {
  return `${STORAGE_KEY_PREFIX}:${pathname}`;
}

function getStoredVisibility(pathname: string): VisibilityState | null {
  try {
    const storageKey = getStorageKey(pathname);
    const savedValue = localStorage.getItem(storageKey);
    if (savedValue) {
      return JSON.parse(savedValue) as VisibilityState;
    }
    return null;
  } catch {
    // localStorage might be disabled or data corrupted
    return null;
  }
}

function saveStoredVisibility(pathname: string, visibility: VisibilityState): void {
  try {
    const storageKey = getStorageKey(pathname);
    localStorage.setItem(storageKey, JSON.stringify(visibility));
  } catch {
    // Storage might be full or disabled
  }
}

function clearStoredVisibility(pathname: string): void {
  try {
    const storageKey = getStorageKey(pathname);
    localStorage.removeItem(storageKey);
  } catch {
    // Storage might be disabled
  }
}

type UseColumnVisibilityReturn = [
  VisibilityState,
  (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void,
  TableFeature<RowData>,
];

export function useColumnVisibility(storageKey?: string): UseColumnVisibilityReturn {
  const currentPathname = storageKey ?? getCurrentPathname();

  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>(() => {
    const storedVisibility = getStoredVisibility(currentPathname);
    return storedVisibility ?? {};
  });

  const [enabledSaveColumnStatus, setEnabledSaveColumnStatus] = useState(
    Boolean(Object.keys(columnVisibility).length > 0)
  );

  const setColumnVisibility = (
    visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ): void => {
    setColumnVisibilityState((prev) => {
      const next = typeof visibility === 'function' ? visibility(prev) : visibility;
      if (enabledSaveColumnStatus) {
        saveStoredVisibility(currentPathname, next);
      } else {
        clearStoredVisibility(currentPathname);
      }
      return next;
    });
  };

  const SaveColumnVisibilityStatusFeatureImpl: TableFeature<RowData> = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    getInitialState: (state: any) => {
      return {
        ...state,
        saveColumnVisibilityStatus: Boolean(Object.keys(columnVisibility).length > 0),
      };
    },

    createTable: <TData extends RowData>(table: Table<TData>): void => {
      table.getEnabledSaveColumnVisibilityStatus = () => {
        return table.getState().saveColumnVisibilityStatus ?? false;
      };

      table.setEnabledSaveColumnVisibilityStatus = (status: boolean) => {
        setEnabledSaveColumnStatus(status);
        table.setState((old) => ({
          ...old,
          saveColumnVisibilityStatus: status,
        }));
      };
    },
  };

  return [columnVisibility, setColumnVisibility, SaveColumnVisibilityStatusFeatureImpl];
}
