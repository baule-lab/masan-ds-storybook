import { useMemo, useRef, useState, lazy } from 'react';
import { Button } from '../../ui/actions/button';
import { Badge } from '../../ui/display/badge';
import { Card, CardContent } from '../../ui/display/card';
import { Filter, RotateCcw, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useStickyObserver } from './hooks/use-sticky-observer';
import { useTemplateManager } from './hooks/use-template-manager';
import { countSelectedAdvancedFilters } from './utils/filter-value';
import type { FilterPanelPropsV2, AdvancedFilterGroupV2 } from './types';
import { getGridClasses } from './utils/grid';
import { FilterField } from './components/filter-field';
import { TemplateChip } from './components/template-chip';
import { defaultFilterPanelLocaleV2, FilterPanelLocaleContextV2 } from './i18n';

const SaveTemplateDialog = lazy(() =>
  import('./components/save-template-dialog').then((mod) => ({ default: mod.SaveTemplateDialog }))
);
const DeleteTemplateDialog = lazy(() =>
  import('./components/delete-template-dialog').then((mod) => ({
    default: mod.DeleteTemplateDialog,
  }))
);
const RenameTemplateDialog = lazy(() =>
  import('./components/rename-template-dialog').then((mod) => ({
    default: mod.RenameTemplateDialog,
  }))
);

export function FilterPanelV2({
  filters,
  advancedFilters = [],
  advancedFilterGroups,
  values,
  defaultValues = {},
  onChange,
  onReset,
  advancedFiltersLabel = 'Advanced Filters',
  advancedFiltersButton,
  resetLabel,
  className,
  contentClassName,
  renderAfterFilters,
  primaryFiltersColumns,
  advancedFiltersColumns,
  disable,
  children,
  stickyOffsetTop = 'top-16',
  stickyBg = 'bg-white',
  stickyClassName = '-mx-4',
  isSticky = true,
  module,
  onApplyTemplate,
  onActiveTemplateChange,
  locale,
}: FilterPanelPropsV2) {
  const resolvedLocale = { ...defaultFilterPanelLocaleV2, ...locale };
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedRef = useRef<HTMLDivElement>(null);
  const { sentinelRef, isStuck: rawIsStuck } = useStickyObserver();
  const isStuck = isSticky && rawIsStuck;

  // ── Template management ─────────────────────────────────────────────
  const templateManager = useTemplateManager({
    module,
    values,
    defaultValues,
    onApplyTemplate,
    onActiveTemplateChange,
    locale: resolvedLocale,
  });

  // Compute effective groups (prioritize advancedFilterGroups)
  const effectiveGroups: AdvancedFilterGroupV2[] = useMemo(() => {
    if (advancedFilterGroups && advancedFilterGroups.length > 0) {
      return advancedFilterGroups;
    }
    if (advancedFilters && advancedFilters.length > 0) {
      // Wrap flat list in single group with empty title
      return [{ title: '', filters: advancedFilters }];
    }
    return [];
  }, [advancedFilterGroups, advancedFilters]);

  // Flat list of all advanced filters for calculations
  const allAdvancedFilters = useMemo(
    () => effectiveGroups.flatMap((g) => g.filters),
    [effectiveGroups]
  );

  // Check if there are any advanced filters
  const hasAdvancedFilters = effectiveGroups.length > 0 && allAdvancedFilters.length > 0;
  // Count selected advanced filters that differ from default values
  const selectedAdvancedCount = useMemo(
    () =>
      countSelectedAdvancedFilters({
        allAdvancedFilters,
        values,
        defaultValues,
      }),
    [allAdvancedFilters, values, defaultValues]
  );

  const handleReset = () => {
    setShowAdvanced(false);
    onReset?.(templateManager.activeTemplate?.filters);
  };

  return (
    <FilterPanelLocaleContextV2.Provider value={resolvedLocale}>
      {isSticky && <div ref={sentinelRef} className="mb-0 h-0" />}
      <Card
        className={cn(
          isSticky && `sticky ${stickyOffsetTop} z-30`,
          'transition-[border-radius,margin] duration-200',
          isStuck && 'rounded-none',
          isStuck && stickyBg,
          isStuck && stickyClassName,
          className
        )}
      >
        <CardContent className="flex flex-col gap-4">
          {templateManager.enabled && (
            <div className="flex flex-col gap-1">
              <p className="font-medium text-muted-foreground text-sm">
                {resolvedLocale.savedTemplatesLabel}
              </p>
              <TemplateChip
                templates={templateManager.templates}
                activeTemplateId={templateManager.activeTemplateId}
                onSelect={templateManager.handleSelect}
                onSaveClick={templateManager.openSaveDialog}
                onUpdateClick={templateManager.handleUpdate}
                onDeleteRequest={templateManager.handleRequestDelete}
                onRenameRequest={templateManager.handleRequestRename}
                hasChangeFilter={templateManager.hasChangeFilter}
              />
            </div>
          )}
          {/* Main Filters */}
          <div className={cn('item-start flex justify-between', contentClassName)}>
            {/* Template chip — inline before filters */}
            <div
              className={cn(
                primaryFiltersColumns
                  ? getGridClasses(primaryFiltersColumns, 'flex flex-wrap items-center')
                  : 'flex flex-wrap items-center',
                'gap-4'
              )}
            >
              {filters.map((filter) => (
                <FilterField
                  key={filter.key}
                  filter={filter}
                  values={values}
                  onChange={onChange}
                  layout="row"
                />
              ))}

              {/* Custom content after main filters */}
              {renderAfterFilters}
            </div>
            {/* Template, Advanced Filters Toggle & Reset */}
            {(hasAdvancedFilters || onReset) && (
              <div className="flex items-start justify-end gap-2">
                {onReset && (
                  <Button
                    disabled={disable}
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {resetLabel}
                  </Button>
                )}
                {hasAdvancedFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="relative gap-2"
                    data-advanced-filter-toggle
                  >
                    <Filter className="h-4 w-4" />
                    {advancedFiltersButton}
                    {selectedAdvancedCount > 0 && (
                      <Badge
                        variant="primary"
                        className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                      >
                        {selectedAdvancedCount}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters Content - Absolute Positioned with Animation */}
          {showAdvanced && hasAdvancedFilters && (
            <div
              ref={advancedRef}
              className="fade-in-0 slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-2 animate-in rounded-lg border border-border bg-card shadow-lg duration-200"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between rounded-t-lg border-border border-b bg-muted/50 px-4 py-3">
                <h3 className="font-semibold text-sm">{advancedFiltersLabel}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Groups */}
              <div className="space-y-6 p-4">
                {effectiveGroups.map((group, groupIndex) => (
                  <div key={group.title || `group-${groupIndex}`}>
                    {/* Group Title */}
                    {group.title && (
                      <h4 className="mb-3 font-bold text-primary text-sm">{group.title}</h4>
                    )}
                    {/* Group Filters Grid */}
                    <div
                      className={cn(
                        getGridClasses(advancedFiltersColumns, 'grid grid-cols-1 md:grid-cols-2'),
                        'gap-4'
                      )}
                    >
                      {group.filters.map((filter) => (
                        <FilterField
                          key={filter.key}
                          filter={filter}
                          values={values}
                          onChange={onChange}
                          layout="column"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional content (e.g. always-visible required fields) */}
          {children}
        </CardContent>
      </Card>

      {/* ── Template dialogs ─────────────────────────────────────── */}
      {templateManager.enabled && (
        <>
          <SaveTemplateDialog
            open={templateManager.saveDialogOpen}
            onClose={templateManager.closeSaveDialog}
            onSave={templateManager.handleSave}
          />
          <DeleteTemplateDialog
            open={templateManager.deleteDialogOpen}
            templateName={templateManager.templateToDelete?.name ?? ''}
            onClose={templateManager.handleCancelDelete}
            onConfirm={templateManager.handleConfirmDelete}
          />
          <RenameTemplateDialog
            open={templateManager.renameDialogOpen}
            initialName={templateManager.templateToRename?.name ?? ''}
            onClose={templateManager.handleCancelRename}
            onRename={templateManager.handleConfirmRename}
          />
        </>
      )}
    </FilterPanelLocaleContextV2.Provider>
  );
}
