import { cn } from '../../../lib/utils';
import { Tabs, TabsList, TabsTrigger } from '../../ui/actions/tabs';
import { useControlledState } from '../../../hooks/use-controlled-state';

export type SegmentedControlProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  disabled?: boolean;
};

export const SegmentedControl = ({
  value: valueProp,
  defaultValue: defaultValueProp,
  onChange,
  options,
  disabled,
}: SegmentedControlProps) => {
  const [value, setValue] = useControlledState({
    value: valueProp,
    defaultValue: defaultValueProp,
    onChange,
  });

  return (
    <Tabs value={value} onValueChange={setValue} className={cn(disabled && 'opacity-50')}>
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value} disabled={disabled}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
