import type { VersatileSelectorProps } from 'react-querybuilder';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '../../ui/forms/select';

import { toSelectOptions } from './utils';
import {
  MultiSelect,
  type MultiSelectGroup,
  type MultiSelectOption,
} from '../../patterns/multi-select';

export type ShadcnValueSelectorProps = VersatileSelectorProps &
  Omit<React.ComponentPropsWithoutRef<typeof Select>, 'multiple'>;

export function ShadcnValueSelector(props: ShadcnValueSelectorProps) {
  const { className, handleOnChange, options, value, title, disabled, multiple } = props;
  // Use MultiSelect for multiple selection mode
  if (multiple) {
    const valueArray = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <MultiSelect
        options={options as MultiSelectOption[] | MultiSelectGroup[]}
        value={valueArray}
        onChange={(newValue) => handleOnChange(newValue.join(','))}
        disabled={disabled}
        placeholder="Select..."
      />
    );
  }

  return (
    <Select
      items={options as { value: string; label: string }[]}
      value={value as string}
      onValueChange={handleOnChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-[180px] ${className ?? ''}`} title={title}>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{toSelectOptions(options)}</SelectGroup>
      </SelectContent>
    </Select>
  );
}

ShadcnValueSelector.displayName = 'ShadcnValueSelector';
