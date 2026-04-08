import type { NotToggleProps } from 'react-querybuilder';
import { Switch } from '../../ui/forms/switch';
import { Label } from '../../ui/display/label';

export type ShadcnNotToggleProps = NotToggleProps;

export function ShadcnNotToggle({
  className,
  handleOnChange,
  label,
  checked,
  title,
  disabled,
  // Extract and ignore query-builder specific props
  testID: _testID,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  schema: _schema,
  ...extraProps
}: ShadcnNotToggleProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`} {...extraProps}>
      <Switch
        id="not-toggle"
        checked={checked}
        onCheckedChange={(checked) => handleOnChange(checked)}
        disabled={disabled}
        title={title}
      />
      <Label htmlFor="not-toggle" className="cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

ShadcnNotToggle.displayName = 'ShadcnNotToggle';
