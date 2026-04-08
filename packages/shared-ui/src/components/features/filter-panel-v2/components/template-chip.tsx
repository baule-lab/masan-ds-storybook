import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../ui/overlays/popover';
import { Button } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { ChevronDown, Check, Bookmark, Trash2, Save, PlusCircle, Pencil } from 'lucide-react';
import { formatDate } from '../../../../utils/date';
import type { FilterTemplateDBV2 } from '../hooks/use-persistent-filter-template';
import { useFilterPanelLocaleV2 } from '../i18n';

interface TemplateChipPropsV2 {
  templates: FilterTemplateDBV2[];
  activeTemplateId?: string;
  onSelect: (template: FilterTemplateDBV2) => void;
  onSaveClick: () => void;
  onUpdateClick: () => void;
  onDeleteRequest: (template: FilterTemplateDBV2) => void;
  onRenameRequest: (template: FilterTemplateDBV2) => void;
  hasChangeFilter: boolean;
}

function EmptyTemplateContent() {
  const locale = useFilterPanelLocaleV2();
  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-6 text-center text-muted-foreground">
      <Bookmark className="size-6 opacity-40" />
      <p className="text-sm">{locale.emptyTemplatesTitle}</p>
      <p className="text-xs">{locale.emptyTemplatesSubtitle}</p>
    </div>
  );
}

interface TemplateChipOptionItemPropsV2 {
  template: FilterTemplateDBV2;
  isActive: boolean;
  onSelect: (template: FilterTemplateDBV2) => void;
  onDeleteRequest: (template: FilterTemplateDBV2) => void;
  onRenameRequest: (template: FilterTemplateDBV2) => void;
  setDropdownOpen: (open: boolean) => void;
}

function TemplateChipOptionItem({
  template,
  isActive,
  onSelect,
  onDeleteRequest,
  onRenameRequest,
  setDropdownOpen,
}: TemplateChipOptionItemPropsV2) {
  return (
    <div
      className={cn(
        'group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
        isActive
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-popover-foreground hover:bg-accent'
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(template)}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <Check className={cn('size-3.5 shrink-0', isActive ? 'text-primary' : 'invisible')} />
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="truncate">{template.name}</p>
          <p className="text-muted-foreground text-xs">
            {formatDate(template.createdAt, 'dd-MM-yyyy HH:mm:ss')}
          </p>
        </div>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(false);
          onRenameRequest(template);
        }}
      >
        <Pencil className="size-3.5 text-muted-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(false);
          onDeleteRequest(template);
        }}
      >
        <Trash2 className="size-3.5 text-destructive" />
      </Button>
    </div>
  );
}

export function TemplateChip({
  templates,
  activeTemplateId,
  onSelect,
  onSaveClick,
  onUpdateClick,
  onDeleteRequest,
  onRenameRequest,
  hasChangeFilter,
}: TemplateChipPropsV2) {
  const locale = useFilterPanelLocaleV2();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [savePopoverOpen, setSavePopoverOpen] = useState(false);

  const activeTemplate = templates.find((t) => t.id === activeTemplateId);
  const displayName = activeTemplate?.name ?? locale.defaultTemplateName;
  const hasTemplates = templates.length > 0;

  const handleSelect = (template: FilterTemplateDBV2) => {
    onSelect(template);
    setDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* ── Template selector dropdown ───────────────────────────────── */}
      <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors',
                activeTemplate
                  ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                  : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <Bookmark className="size-3.5 shrink-0" />
              <span className="max-w-[160px] truncate">
                {displayName}
                {hasChangeFilter ? <span className="ml-0.5 text-amber-500">*</span> : null}
              </span>
              <ChevronDown
                className={cn(
                  'size-3.5 shrink-0 transition-transform duration-200',
                  dropdownOpen && 'rotate-180'
                )}
              />
            </button>
          }
        />

        <PopoverContent align="start" sideOffset={6} className="w-72 p-0">
          <div className="max-h-[240px] overflow-y-auto">
            {!hasTemplates ? (
              <EmptyTemplateContent />
            ) : (
              <ul className="p-1">
                {templates.map((template) => {
                  const isActive = template.id === activeTemplateId;
                  return (
                    <li key={template.id}>
                      <TemplateChipOptionItem
                        template={template}
                        isActive={isActive}
                        onSelect={handleSelect}
                        onDeleteRequest={onDeleteRequest}
                        onRenameRequest={onRenameRequest}
                        setDropdownOpen={setDropdownOpen}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Save button (only when filters are dirty) ────────────────── */}
      {/* {hasChangeFilter && ( */}
      <Popover open={savePopoverOpen} onOpenChange={setSavePopoverOpen}>
        <PopoverTrigger
          disabled={!hasChangeFilter}
          render={
            <Button size="sm" variant="default" className="h-8 gap-1.5 rounded-full px-3 text-xs">
              <Save className="size-3.5" />
              {locale.saveButtonLabel}
            </Button>
          }
        />
        <PopoverContent align="start" sideOffset={6} className="w-56 p-1.5">
          <div className="flex flex-col gap-0.5">
            {activeTemplate && (
              <button
                type="button"
                onClick={() => {
                  onUpdateClick();
                  setSavePopoverOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
              >
                <Save className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{locale.updateTemplateLabel(activeTemplate.name)}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onSaveClick();
                setSavePopoverOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
            >
              <PlusCircle className="size-3.5 shrink-0 text-muted-foreground" />
              {locale.saveAsNewLabel}
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {/* )} */}
    </div>
  );
}
