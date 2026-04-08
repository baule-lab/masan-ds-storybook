import type { OptionList } from 'react-querybuilder';
import { isOptionGroupArray } from 'react-querybuilder';
import { SelectGroup, SelectItem, SelectLabel } from '../../ui/forms/select';

export const toSelectOptions = (list: OptionList) => {
  if (isOptionGroupArray(list)) {
    return list.map((group) => (
      <SelectGroup key={group.label}>
        <SelectLabel>{group.label}</SelectLabel>
        {group.options.map((opt) => (
          <SelectItem key={opt.name} value={opt.name ?? ''} disabled={!!opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectGroup>
    ));
  }
  if (Array.isArray(list)) {
    return list.map((opt) => (
      <SelectItem key={opt.name} value={opt.name ?? ''} disabled={!!opt.disabled}>
        {opt.label}
      </SelectItem>
    ));
  }
  return null;
};
