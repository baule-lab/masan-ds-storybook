import { getCompatContextProvider } from 'react-querybuilder';
import { X, Copy, Lock, Unlock, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { ShadcnActionElement } from './shadcn-action-element';
import { ShadcnDragHandle } from './shadcn-drag-handle';
import { ShadcnNotToggle } from './shadcn-not-toggle';
import { ShadcnValueEditor } from './shadcn-value-editor';
import { ShadcnValueSelector } from './shadcn-value-selector';

// Classnames for shadcn/ui styling
export const shadcnControlClassnames = {
  ruleGroup: 'rounded-lg border bg-background p-4 shadow-sm',
  header: 'flex items-center gap-2 mb-2',
  body: 'space-y-2',
  combinators: 'px-2',
  addRule: '',
  addGroup: '',
  removeGroup: '',
  notToggle: '',
  rule: 'flex items-center gap-2 rounded-md border bg-muted/50 p-2',
  fields: '',
  operators: '',
  value: '',
  removeRule: 'ml-auto',
  dragHandle: 'cursor-grab',
  lockRule: '',
  lockGroup: '',
};

// Control elements using shadcn/ui components
export const shadcnControlElements = {
  actionElement: ShadcnActionElement,
  dragHandle: ShadcnDragHandle,
  notToggle: ShadcnNotToggle,
  valueEditor: ShadcnValueEditor,
  valueSelector: ShadcnValueSelector,
  fieldSelector: ShadcnValueSelector,
  combinatorSelector: ShadcnValueSelector,
  operatorSelector: ShadcnValueSelector,
};

// Translations with icons
export const shadcnTranslations = {
  removeRule: { label: <X className="h-4 w-4" />, title: 'Remove rule' },
  removeGroup: { label: <X className="h-4 w-4" />, title: 'Remove group' },
  addRule: {
    label: (
      <>
        <Plus className="mr-1 h-4 w-4" /> Rule
      </>
    ),
    title: 'Add rule',
  },
  addGroup: {
    label: (
      <>
        <Plus className="mr-1 h-4 w-4" /> Group
      </>
    ),
    title: 'Add group',
  },
  cloneRule: { label: <Copy className="h-4 w-4" />, title: 'Clone rule' },
  cloneRuleGroup: { label: <Copy className="h-4 w-4" />, title: 'Clone group' },
  lockRule: { label: <Unlock className="h-4 w-4" />, title: 'Lock rule' },
  lockGroup: { label: <Unlock className="h-4 w-4" />, title: 'Lock group' },
  lockRuleDisabled: { label: <Lock className="h-4 w-4" />, title: 'Unlock rule' },
  lockGroupDisabled: { label: <Lock className="h-4 w-4" />, title: 'Unlock group' },
  shiftActionUp: { label: <ChevronUp className="h-4 w-4" />, title: 'Move up' },
  shiftActionDown: { label: <ChevronDown className="h-4 w-4" />, title: 'Move down' },
};

// Main context provider with all shadcn/ui settings
export const QueryBuilderShadcn = getCompatContextProvider({
  controlClassnames: shadcnControlClassnames,
  controlElements: shadcnControlElements,
  translations: shadcnTranslations,
});

// Re-export components for individual use
export { ShadcnActionElement } from './shadcn-action-element';
export { ShadcnDragHandle } from './shadcn-drag-handle';
export { ShadcnNotToggle } from './shadcn-not-toggle';
export { ShadcnValueEditor } from './shadcn-value-editor';
export { ShadcnValueSelector } from './shadcn-value-selector';

export { toSelectOptions } from './utils';

// Re-export react-querybuilder for convenience
export { QueryBuilder, formatQuery } from 'react-querybuilder';
export type {
  Field,
  RuleGroupType,
  RuleType,
  OptionList,
  ValueEditorProps,
  ActionWithRulesProps,
} from 'react-querybuilder';
