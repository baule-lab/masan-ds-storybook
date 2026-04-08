import { forwardRef } from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Input } from '../../ui/forms/input';
import { useControlledState } from '../../../hooks/use-controlled-state';
import { toNumber } from '../../../utils/number';

export interface NumberInputProps
  extends Omit<
    NumericFormatProps,
    'value' | 'onValueChange' | 'customInput' | 'getInputRef' | 'onChange'
  > {
  stepper?: number;
  thousandSeparator?: string | boolean;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number | string; // Controlled value
  onChange?: (value: number | string | undefined) => void;
  /*
  if allowDecimal is true, it will allow decimal places
  if allowDecimal is not provided (undefined), it will be false
  */
  allowDecimal?: boolean;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      defaultValue: defaultValueProp,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      onChange: onChangeProp,
      fixedDecimalScale,
      decimalScale,
      value: valueProp,
      thousandSeparator = ',',
      allowDecimal = false,
      ...props
    },
    ref
  ) => {
    // const [value, onChange] = useState<number | undefined>(valueProp ?? 0);
    const [value, onChange] = useControlledState<number | string | undefined>({
      value: valueProp ? toNumber(valueProp) : undefined,
      defaultValue: defaultValueProp,
      onChange: onChangeProp,
    });

    const handleChange = (values: { value: string; floatValue: number | undefined }) => {
      const newValue = values.floatValue === undefined ? '' : values.floatValue;
      onChange(newValue);
    };

    const handleBlur = () => {
      if (value !== undefined) {
        if (toNumber(value) < min) {
          onChange(min);
          (ref as React.RefObject<HTMLInputElement>).current!.value = String(min);
        } else if (toNumber(value) > max) {
          onChange(max);
          (ref as React.RefObject<HTMLInputElement>).current!.value = String(max);
        }
      }
    };

    return (
      <NumericFormat
        allowNegative={min < 0}
        max={max}
        min={min}
        customInput={Input}
        getInputRef={ref}
        {...props}
        thousandSeparator={thousandSeparator}
        decimalScale={allowDecimal ? decimalScale : 0}
        value={toNumber(value)}
        onValueChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
