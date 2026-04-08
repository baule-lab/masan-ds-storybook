import { useWatchField } from '../../../hooks/use-watch-field';
import { FormField } from '../../ui/forms/form';
import type { ReactNode } from 'react';
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

type RenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
  watchedValues: unknown[];
  disabled: boolean;
  value: TFieldValues[TName];
  onChange?: (value: TFieldValues[TName]) => void;
};

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /** Field name in the form */
  name: TName;
  /** Field names to watch for changes */
  watchName?: FieldPath<TFieldValues>[];
  /** Whether the field is disabled */
  disabled?: boolean;

  resetOnChange?: FieldPath<TFieldValues>[];
  /** React Hook Form validation rules */
  rules?: Parameters<typeof FormField<TFieldValues, TName>>[0]['rules'];
  /** Render function for custom control UI */
  render: (props: RenderProps<TFieldValues, TName>) => ReactNode;
};

export const FormControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  watchName,
  disabled = false,
  resetOnChange,
  rules,
  render,
}: FormControlProps<TFieldValues, TName>) => {
  const form = useFormContext<TFieldValues>();

  const { watchedValues } = useWatchField({
    watchName: watchName as string[] | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: form.control as any,
    enabled: !disabled,
  });

  const handleChange = () => {
    if (resetOnChange) {
      resetOnChange.forEach((fieldName) => {
        form.setValue(fieldName, undefined as TFieldValues[TName]);
      });
    }
  };

  return (
    <FormField<TFieldValues, TName>
      control={form.control}
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) => (
        <>
          {render({
            field,
            fieldState,
            formState,
            watchedValues,
            disabled,
            value: field.value,
            onChange: (value: any) => {
              field.onChange(value);
              handleChange();
            },
          })}
        </>
      )}
    />
  );
};
