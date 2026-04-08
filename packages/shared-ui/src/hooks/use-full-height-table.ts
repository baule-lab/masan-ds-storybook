import { useEffect, useState, useCallback, useRef } from 'react';

interface UseFullHeightTableOptions {
  /**
   * Offset from the top of the viewport (e.g., header height)
   * If not provided, will auto-detect common header selectors
   * @default auto-detect
   */
  topOffset?: number;

  /**
   * Offset from the bottom of the viewport (e.g., footer height)
   * @default 0
   */
  bottomOffset?: number;

  /**
   * Additional padding to subtract from the calculated height
   * If not provided, will auto-detect elements above the table
   * @default auto-detect
   */
  additionalPadding?: number;

  /**
   * Minimum height for the table
   * @default 300
   */
  minHeight?: number;

  /**
   * Maximum height for the table (optional)
   */
  maxHeight?: number;

  /**
   * CSS selector for elements above the table to calculate their height
   * These elements will be subtracted from the available height
   * @default auto-detect common selectors
   */
  elementsAbove?: string[];

  /**
   * CSS selector for elements below the table to calculate their height
   * These elements will be subtracted from the available height
   */
  elementsBelow?: string[];

  /**
   * Auto-detect common header/navbar elements
   * @default true
   */
  autoDetectHeaders?: boolean;

  /**
   * Auto-detect elements above the table (filters, toolbars, etc.)
   * @default true
   */
  autoDetectElementsAbove?: boolean;

  /**
   * Final adjustment to subtract from calculated height (for fine-tuning)
   * @default 0
   */
  finalAdjustment?: number;
}

interface UseFullHeightTableReturn {
  /**
   * The calculated height for the table
   */
  height: string;

  /**
   * Ref to attach to the table container for more accurate calculations
   */
  containerRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Function to manually recalculate the height
   */
  recalculate: () => void;

  /**
   * The raw calculated height in pixels
   */
  heightPx: number;
}

/**
 * Hook to calculate the full height available for a DataTable
 * Takes into account viewport height, offsets, and elements above/below the table
 * Only calculates once after initial render, never recalculates automatically
 */
export function useFullHeightTable(
  options: UseFullHeightTableOptions = {}
): UseFullHeightTableReturn {
  const { minHeight, finalAdjustment = 0 } = options;

  const [heightPx, setHeightPx] = useState<number>(minHeight || 0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasCalculatedRef = useRef(false);
  const optionsRef = useRef(options);

  // Store initial options to use in calculation
  optionsRef.current = options;

  const calculateHeight = useCallback(() => {
    // Use stored options from initial render
    const opts = optionsRef.current;

    try {
      // Get viewport height
      const viewportHeight = window.innerHeight;

      // Auto-detect common header/navbar selectors
      const defaultHeaderSelectors = [
        'nav',
        'header',
        '[role="banner"]',
        '.navbar',
        '.header',
        '.top-bar',
      ];

      // Auto-detect elements above table (filters, toolbars, etc.)
      const defaultElementsAboveSelectors = [
        '.data-table-container > div:first-child', // First child in data-table-container (usually filters)
        '.filters',
        '.toolbar',
        '.actions',
        '.search-bar',
        '.filter-bar',
      ];

      // Determine which selectors to use
      let selectorsToCheck: string[] = [];

      if (opts.autoDetectHeaders && !opts.topOffset) {
        selectorsToCheck = [...selectorsToCheck, ...defaultHeaderSelectors];
      }

      if (opts.autoDetectElementsAbove && !opts.additionalPadding) {
        selectorsToCheck = [...selectorsToCheck, ...defaultElementsAboveSelectors];
      }

      if (opts.elementsAbove) {
        selectorsToCheck = [...selectorsToCheck, ...opts.elementsAbove];
      }

      // Calculate height of detected elements (avoid double counting)
      let elementsAboveHeight = 0;
      const processedElements = new Set<Element>();

      selectorsToCheck.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            // Skip if we already processed this element or its parent
            if (processedElements.has(element)) return;

            // Check if any parent is already processed
            let hasProcessedParent = false;
            for (const processed of processedElements) {
              if (processed.contains(element) || element.contains(processed)) {
                hasProcessedParent = true;
                break;
              }
            }

            if (!hasProcessedParent) {
              const rect = element.getBoundingClientRect();
              elementsAboveHeight += rect.height;
              processedElements.add(element);
            }
          });
        } catch (_e) {
          // Ignore invalid selectors
        }
      });

      // Calculate height of elements below the table
      let elementsBelowHeight = 0;
      (opts.elementsBelow || []).forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            elementsBelowHeight += rect.height;
          });
        } catch (_e) {
          // Ignore invalid selectors
        }
      });

      // Calculate container top position
      let containerTop = 0;
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        containerTop = containerRect.top;
      } else if (opts.topOffset !== undefined) {
        containerTop = opts.topOffset;
      }

      // Calculate available height
      let availableHeight =
        viewportHeight -
        containerTop -
        (opts.bottomOffset || 0) -
        elementsAboveHeight -
        elementsBelowHeight -
        (opts.additionalPadding || 0);

      // Apply min/max constraints
      availableHeight = Math.max(availableHeight || 0, opts.minHeight || 0);
      if (opts.maxHeight) {
        availableHeight = Math.min(availableHeight, opts.maxHeight);
      }
      setHeightPx(Math.floor(availableHeight));
    } catch (error) {
      console.warn('Error calculating table height:', error);
      setHeightPx(opts.minHeight || 0);
    }
  }, []);

  // Stable recalculate function that doesn't change on every render
  const recalculate = useCallback(() => {
    calculateHeight();
  }, [calculateHeight]);

  // Calculate only once after DOM is ready (not on initial render)
  useEffect(() => {
    if (hasCalculatedRef.current) {
      return;
    }

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      if (!hasCalculatedRef.current) {
        calculateHeight();
        hasCalculatedRef.current = true;
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [calculateHeight]);

  const height = `${(heightPx || 0) - finalAdjustment}px`;
  return {
    height,
    containerRef,
    recalculate,
    heightPx: heightPx || 0,
  };
}
