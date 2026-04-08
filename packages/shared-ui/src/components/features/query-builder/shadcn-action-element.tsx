import type { ActionWithRulesProps } from 'react-querybuilder';
import { Button } from '../../ui/actions/button';

export type ShadcnActionProps = ActionWithRulesProps & React.ComponentProps<typeof Button>;

export function ShadcnActionElement({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Extract and ignore query-builder specific props
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ruleOrGroup: _ruleOrGroup,
  schema: _schema,
  ...extraProps
}: ShadcnActionProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      title={disabledTranslation && disabled ? disabledTranslation.title : title}
      onClick={(e) => handleOnClick(e)}
      disabled={disabled}
      {...extraProps}
    >
      {disabledTranslation && disabled ? disabledTranslation.label : label}
    </Button>
  );
}

ShadcnActionElement.displayName = 'ShadcnActionElement';
