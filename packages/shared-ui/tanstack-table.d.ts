import '@tanstack/react-table'

export interface SaveColumnVisibilityStatusFeature { 
  getEnabledSaveColumnVisibilityStatus: () => boolean;
  setEnabledSaveColumnVisibilityStatus: (enabled: boolean) => void;
}


declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    interface ColumnMeta<TData extends unknown, TValue = unknown> {
        headerLabel?: string
        /**
         * CSS class name for both header and cell
         */
        className?: string;
        /**
         * CSS class name for table header cell
         */
        thClassName?: string;
        /**
         * CSS class name for table body cell
         */
        tdClassName?: string;
        /**
         * Make column sticky (fixed) on left or right side
         * @example
         * meta: { sticky: 'left' } // Fixed to left side
         * meta: { sticky: 'right' } // Fixed to right side
         */
        sticky?: "left" | "right";
        /**
         * Minimum column width in pixels
         * @default 50
         */
        minSize?: number;
        /**
         * Maximum column width in pixels
         * @default 1000
         */
        maxSize?: number;
        /**
         * Enable or disable column resizing
         * @default true
         */
        enableResizing?: boolean;
      }

  
    interface Table<TData extends RowData> extends SaveColumnVisibilityStatusFeature {}
    interface TableState { 
      saveColumnVisibilityStatus: boolean; 
    }
  }
  

  import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue = unknown> {
    /**
     * CSS class name for both header and cell
     */
    className?: string;
    /**
     * CSS class name for table header cell
     */
    thClassName?: string;
    /**
     * CSS class name for table body cell
     */
    tdClassName?: string;
    /**
     * Make column sticky (fixed) on left or right side
     * @example
     * meta: { sticky: 'left' } // Fixed to left side
     * meta: { sticky: 'right' } // Fixed to right side
     */
    sticky?: "left" | "right";
    /**
     * Minimum column width in pixels
     * @default 50
     */
    minSize?: number;
    /**
     * Maximum column width in pixels
     * @default 1000
     */
    maxSize?: number;
    /**
     * Enable or disable column resizing
     * @default true
     */
    enableResizing?: boolean;
  }
}
