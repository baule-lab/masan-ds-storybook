import type { ComponentProps } from 'react';
import type { FieldPath, FieldValues, Path } from 'react-hook-form';
import { ControlWrapper } from '../../ui/forms/form';
import { Input } from '../../ui/forms/input';

import { FormControl } from './form-control';

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ComponentProps<typeof Input> {
  name: TName;
  label?: string;
  required?: boolean;
  watchName?: FieldPath<TFieldValues>[];
  resetOnChange?: FieldPath<TFieldValues>[];
}

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  required,
  watchName,
  resetOnChange,
  disabled,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormControl
      name={name as Path<TFieldValues>}
      watchName={watchName}
      resetOnChange={resetOnChange}
      render={({ field, value, onChange }) => (
        <ControlWrapper label={label} required={required}>
          <Input
            {...inputProps}
            {...field}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
          />
        </ControlWrapper>
      )}
    />
  );
};
