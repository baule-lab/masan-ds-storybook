// ─── Components ─────────────────────────────────────────────────────────────
export * from './components';

// ─── Lib & Utilities ────────────────────────────────────────────────────────
export * from './lib/utils';
export * from './lib/dexie';
export * from './utils/data';
export * from './utils/date';
export * from './utils/number';
export * from './utils/array';
export * from './utils/object';
export * from './utils/string';
export * from './utils/is';
export * from './utils/promotion-colors';
export * from './utils/date-formatting';
export * from './utils/number-formatting';

// ─── Hooks ──────────────────────────────────────────────────────────────────
export * from './hooks/use-mobile';
export * from './hooks/use-full-height-table';
export * from './hooks/use-infinite-scroll';
export * from './hooks/use-controlled-state';
export * from './hooks/use-badge-variant';
export * from './hooks/use-reduced-motion';
export * from './hooks/use-debounce-callback';
export * from './hooks/use-debounced-value';
export * from './hooks/use-intersection-observer';
export * from './hooks/use-table-local-state';
export * from './hooks/use-table-url-state';
export * from './hooks/use-watch-field';

// ─── External Re-exports ────────────────────────────────────────────────────
export { useVirtualizer } from '@tanstack/react-virtual';
export type { VirtualItem, Virtualizer } from '@tanstack/react-virtual';

// ─── Contexts ───────────────────────────────────────────────────────────────
export * from './context';

// ─── Types ──────────────────────────────────────────────────────────────────
export * from './types/date';
export * from './types/uom';
export * from './types/screen';
