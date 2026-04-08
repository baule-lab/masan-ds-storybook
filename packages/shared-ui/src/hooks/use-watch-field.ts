import type { Control, FieldValues } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

type UseWatchedFieldOptions = {
  watchName?: string[];
  control: Control<FieldValues>;
  enabled?: boolean;
};

type UseWatchedFieldReturn = {
  watchedValues: unknown[];
  queryParams: Record<string, string>;
};

/**
 * A hook that watches form fields and triggers a callback when values change.
 * Uses ref-based tracking to detect changes during render, avoiding useEffect.
 *
 * @param options - Configuration options
 * @param options.watchName - Array of field names to watch
 * @param options.control - The react-hook-form control instance
 * @param options.enabled - Whether the watch is enabled (default: true)
 * @returns Object containing watched values and computed query params
 */
export function useWatchField({
  watchName,
  control,
  enabled = true,
}: UseWatchedFieldOptions): UseWatchedFieldReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watchedValues = useWatch({
    control,
    name: (watchName ?? []) as any,
    disabled: !watchName?.length || !enabled,
  });

  // Compute query params from watched values
  const queryParams = watchName
    ? (watchedValues as unknown[]).reduce<Record<string, string>>((acc, value, index) => {
        if (value) {
          acc[watchName[index] ?? ''] =
            typeof value === 'string' ? value : (value as string[]).join(',');
        }
        return acc;
      }, {})
    : {};

  return {
    watchedValues: watchedValues as unknown[],
    queryParams,
  };
}
