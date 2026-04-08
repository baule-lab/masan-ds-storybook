import { useState, type ChangeEvent, type ComponentProps, useEffect, useCallback } from 'react';
import { Input } from '../../ui/forms/input';

import { useDebounceCallback } from '../../../hooks/use-debounce-callback';

export interface DebounceInputProps extends Omit<ComponentProps<typeof Input>, 'onChange'> {
  debounceMs?: number;
  onChange?: (value: string) => void;
}

export const DebounceInput = ({
  debounceMs = 500,
  onChange,
  ...inputProps
}: DebounceInputProps) => {
  const [value, setValue] = useState(inputProps.value);

  const debouncedChange = useDebounceCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  }, debounceMs);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debouncedChange?.(event);
  }, []);

  useEffect(() => {
    setValue(inputProps.value);
  }, [inputProps.value]);

  return <Input {...inputProps} value={value} onChange={handleChange} />;
};
