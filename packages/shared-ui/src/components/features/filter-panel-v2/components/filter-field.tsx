import { memo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../ui/actions/tabs';
import { AsyncSelect } from '../../../patterns/async-select';
import { MultiSelect } from '../../../patterns/multi-select';
import { DatePicker, DateRangePicker, type DateValue, type DateRange } from '../../date-picker';
import { cn } from '../../../../lib/utils';
import type {
  AdvancedFilterConfigV2,
  DatePickerFilterConfigV2,
  DateRangePickerFilterConfigV2,
  FilterConfigV2,
  FilterValueV2,
  MultiSelectFilterConfigV2,
  SelectFilterConfigV2,
  TabFilterConfigV2,
  TreeMultipleSelectFilterConfig,
  TreeSelectFilterConfig,
} from '../types';
import { TreeMultipleSelect, TreeSelect } from '../../../patterns/tree-select';

// ---------------------------------------------------------------------------
// Shared renderer prop shape
// ---------------------------------------------------------------------------

type RendererProps<TFilter> = {
  filter: TFilter;
  value: FilterValueV2;
  onChange: (value: FilterValueV2) => void;
  layout: 'row' | 'column';
};

// ---------------------------------------------------------------------------
// Per-type renderer components
// ---------------------------------------------------------------------------

function TabsFilter({ filter, value, onChange }: RendererProps<TabFilterConfigV2>) {
  return (
    <Tabs
      value={value as string}
      onValueChange={(v) => {
        onChange(v);
        filter.onChange?.(v);
      }}
    >
      <TabsList>
        {filter.options.map((option) => (
          <TabsTrigger disabled={filter.disable} key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function AsyncSelectFilter({
  filter,
  value,
  onChange,
  layout,
}: RendererProps<SelectFilterConfigV2>) {
  if (!filter.asyncSelectProps) return null;
  return (
    <AsyncSelect
      {...filter.asyncSelectProps}
      value={value as string}
      onChange={(v) => onChange(v)}
      className={cn(layout === 'row' ? 'w-50' : 'w-full', filter.asyncSelectProps.className)}
      disabled={filter.disable}
    />
  );
}

function MultiSelectFilter({
  filter,
  value,
  onChange,
  layout,
}: RendererProps<MultiSelectFilterConfigV2>) {
  if (!filter.multiSelectProps) return null;
  return (
    <MultiSelect
      {...filter.multiSelectProps}
      value={value as string[]}
      onChange={(v) => onChange(v)}
      className={cn(layout === 'row' ? 'w-50' : 'w-full', filter.multiSelectProps.className)}
      disabled={filter.disable}
    />
  );
}

function TreeSelectFilter({ filter, value, onChange }: RendererProps<TreeSelectFilterConfig>) {
  if (!filter.treeSelectProps) return null;
  return (
    <TreeSelect
      {...filter.treeSelectProps}
      value={value as string}
      onChange={(v) => onChange(v ?? '')}
      className={cn('w-50', filter.treeSelectProps.className)}
      disabled={filter.disable}
    />
  );
}

function TreeMultipleSelectFilter({
  filter,
  value,
  onChange,
}: RendererProps<TreeMultipleSelectFilterConfig>) {
  if (!filter.treeMultipleSelectProps) return null;
  return (
    <TreeMultipleSelect
      {...filter.treeMultipleSelectProps}
      value={value as string[]}
      onChange={(v) => onChange(v ?? [])}
      className={cn('w-50', filter.treeMultipleSelectProps.className)}
      disabled={filter.disable}
    />
  );
}

function DatePickerFilter({
  filter,
  value,
  onChange,
  layout,
}: RendererProps<DatePickerFilterConfigV2>) {
  const content = (
    <DatePicker
      outputFormat="iso"
      showPresets
      showActions
      {...filter.datePickerProps}
      value={value as DateValue}
      onChange={(v) => {
        onChange(v);
        filter.onChange?.(v);
      }}
      disabled={filter.disable}
    />
  );
  return layout === 'row' ? <div className="w-fit">{content}</div> : content;
}

function DateRangePickerFilter({
  filter,
  value,
  onChange,
  layout,
}: RendererProps<DateRangePickerFilterConfigV2>) {
  const content = (
    <DateRangePicker
      key={`${filter.key}-${filter.dateRangePickerProps?.defaultMode ?? 'date'}`}
      outputFormat="iso"
      showPresets
      showActions
      {...filter.dateRangePickerProps}
      value={value as DateRange}
      onChange={(v, meta) => {
        onChange(v);
        filter.onChange?.(v, meta);
      }}
      disabled={filter.disable}
    />
  );
  return layout === 'row' ? <div className="w-fit">{content}</div> : content;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const FILTER_RENDERERS = {
  tabs: TabsFilter,
  select: AsyncSelectFilter,
  'multi-select': MultiSelectFilter,
  'tree-select': TreeSelectFilter,
  'tree-multiple-select': TreeMultipleSelectFilter,
  'date-picker': DatePickerFilter,
  'date-range-picker': DateRangePickerFilter,
} as const satisfies Record<FilterConfigV2['type'], React.ComponentType<RendererProps<never>>>;

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export type FilterFieldPropsV2 = {
  filter: FilterConfigV2 | AdvancedFilterConfigV2;
  values: Record<string, FilterValueV2>;
  onChange: (key: string, value: FilterValueV2) => void;
  layout: 'row' | 'column';
};

export const FilterField = memo(function FilterField({
  filter,
  values,
  onChange,
  layout,
}: FilterFieldPropsV2) {
  const Component = FILTER_RENDERERS[filter.type] as React.ComponentType<
    RendererProps<typeof filter>
  >;

  if (!Component) return null;

  const wrapperClassName = layout === 'row' ? 'flex items-center gap-2' : 'flex flex-col gap-2';
  const labelClassName =
    layout === 'row'
      ? 'whitespace-nowrap font-medium text-muted-foreground text-sm'
      : 'font-medium text-muted-foreground text-sm';

  return (
    <div className={wrapperClassName}>
      <span className={labelClassName}>{filter.label}:</span>
      <Component
        filter={filter}
        value={values[filter.key]}
        onChange={(value) => onChange(filter.key, value)}
        layout={layout}
      />
    </div>
  );
});
