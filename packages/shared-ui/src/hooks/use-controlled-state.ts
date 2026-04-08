import * as React from 'react';

export interface UseControlledStateOptions<T> {
  /**
   * Controlled value. When provided, the component is controlled.
   */
  value?: T;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: T;
  /**
   * Callback fired when the value changes (for controlled mode).
   */
  onChange?: (value: T) => void;
}

/**
 * Hook to manage controlled/uncontrolled state for form controls.
 *
 * @example
 * // Controlled mode
 * const [value, setValue] = useControlledState({
 *   value: controlledValue,
 *   onChange: (newValue) => setControlledValue(newValue),
 * });
 *
 * @example
 * // Uncontrolled mode
 * const [value, setValue] = useControlledState({
 *   defaultValue: 'initial',
 * });
 */
export function useControlledState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControlledStateOptions<T>): [T | undefined, (value: T | undefined) => void] {
  // A field is considered controlled **only** when `value` is provided.
  // Presence of `onChange` alone should not force controlled mode; this
  // allows patterns like uncontrolled components that still emit changes.
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue);

  const value = isControlled ? controlledValue : internalValue;

  const setValue = (newValue: T | undefined) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    // Always notify listeners when the value changes, regardless of mode.
    onChange?.(newValue as T);
  };

  return [value, setValue];
}
