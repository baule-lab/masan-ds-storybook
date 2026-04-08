import type { ValueEditorProps } from 'react-querybuilder';
import { Input } from '../../ui/forms/input';
import { Textarea } from '../../ui/forms/textarea';
import { Checkbox } from '../../ui/forms/checkbox';
import { Switch } from '../../ui/forms/switch';
import { RadioGroup, RadioGroupItem } from '../../ui/forms/radio-group';
import { Label } from '../../ui/display/label';
import { ShadcnValueSelector } from './shadcn-value-selector';

export type ShadcnValueEditorProps = ValueEditorProps & {
  extraProps?: Record<string, unknown>;
};

export function ShadcnValueEditor(props: ShadcnValueEditorProps) {
  const {
    fieldData,
    operator,
    value,
    handleOnChange,
    title,
    className,
    type,
    inputType,
    values = [],
    disabled,
    path,
    level,
    schema,
    extraProps = {},
  } = props;

  // Handle null/notNull operators
  if (operator === 'null' || operator === 'notNull') {
    return null;
  }

  // Handle between/notBetween operators
  if (
    (operator === 'between' || operator === 'notBetween') &&
    (type === 'select' || type === 'text')
  ) {
    const valueArray = Array.isArray(value) ? value : [value, ''];

    const handleBetweenChange = (val: string, idx: number) => {
      const newValue = [...valueArray];
      newValue[idx] = val;
      handleOnChange(newValue.join(','));
    };

    const editors = ['from', 'to'].map((pos, idx) => {
      if (type === 'text') {
        return (
          <Input
            key={pos}
            type={inputType || 'text'}
            className="w-[100px]"
            value={valueArray[idx] ?? ''}
            onChange={(e) => handleBetweenChange(e.target.value, idx)}
            disabled={disabled}
            placeholder={pos}
            {...extraProps}
          />
        );
      }
      return (
        <ShadcnValueSelector
          key={pos}
          options={values}
          value={valueArray[idx] ?? ''}
          handleOnChange={(v) => handleBetweenChange(v, idx)}
          disabled={disabled}
          path={path}
          level={level}
          schema={schema}
          {...extraProps}
        />
      );
    });

    return (
      <span className="flex items-center gap-2">
        {editors[0]}
        <span className="text-muted-foreground">and</span>
        {editors[1]}
      </span>
    );
  }

  // Handle different input types
  switch (type) {
    case 'select':
    case 'multiselect':
      return (
        <ShadcnValueSelector
          className={className}
          title={title}
          options={values}
          value={value}
          handleOnChange={handleOnChange}
          disabled={disabled}
          multiple={type === 'multiselect'}
          path={path}
          level={level}
          schema={schema}
          {...extraProps}
        />
      );

    case 'textarea':
      return (
        <Textarea
          className={className}
          value={value}
          onChange={(e) => handleOnChange(e.target.value)}
          disabled={disabled}
          title={title}
          placeholder={fieldData?.placeholder}
          {...extraProps}
        />
      );

    case 'switch':
      return (
        <Switch
          className={className}
          checked={!!value}
          onCheckedChange={handleOnChange}
          disabled={disabled}
          title={title}
          {...extraProps}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          className={className}
          checked={!!value}
          onCheckedChange={handleOnChange}
          disabled={disabled}
          title={title}
          {...extraProps}
        />
      );

    case 'radio':
      return (
        <RadioGroup
          className={className}
          value={value}
          onValueChange={handleOnChange}
          disabled={disabled}
        >
          {values.map((opt) => (
            <div key={opt.name} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.name ?? ''} id={opt.name} disabled={opt.disabled} />
              <Label htmlFor={opt.name}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    default:
      return (
        <Input
          type={inputType || 'text'}
          className={`w-[180px] ${className ?? ''}`}
          value={value}
          onChange={(e) => handleOnChange(e.target.value)}
          disabled={disabled}
          title={title}
          placeholder={fieldData?.placeholder}
          {...extraProps}
        />
      );
  }
}

ShadcnValueEditor.displayName = 'ShadcnValueEditor';
