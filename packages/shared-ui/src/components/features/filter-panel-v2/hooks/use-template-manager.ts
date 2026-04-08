import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { usePersistentFilterTemplate } from './use-persistent-filter-template';
import type { FilterTemplateDBV2 } from './use-persistent-filter-template';
import type { FilterValueV2 } from '../types';
import { areFilterValuesEqual } from '../utils/filter-value';
import type { FilterPanelLocaleV2 } from '../i18n';

interface UseTemplateManagerOptionsV2 {
  module: string | undefined;
  values: Record<string, FilterValueV2>;
  defaultValues: Record<string, FilterValueV2>;
  onApplyTemplate?: (filters: Record<string, FilterValueV2>) => void;
  onActiveTemplateChange?: (template: FilterTemplateDBV2 | undefined) => void;
  locale: FilterPanelLocaleV2;
}

export function useTemplateManager({
  module,
  values,
  defaultValues,
  onApplyTemplate,
  onActiveTemplateChange,
  locale,
}: UseTemplateManagerOptionsV2) {
  // Only call useFilterTemplate when module is provided.
  // When module is undefined we pass a stable placeholder — the hook will
  // simply return an empty template list (no records match "").
  const {
    latestTemplate,
    templates,
    saveTemplate: dbSave,
    updateTemplate: dbUpdate,
    deleteTemplate: dbDelete,
    applyTemplate: dbApply,
  } = usePersistentFilterTemplate(module ?? '');

  const enabled = !!module;

  // ── UI state ────────────────────────────────────────────────────────
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<FilterTemplateDBV2 | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [templateToRename, setTemplateToRename] = useState<FilterTemplateDBV2 | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | undefined>(undefined);

  // ── Auto-apply latest template on mount ─────────────────────────────
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!enabled || appliedRef.current) {
      return;
    }

    if (latestTemplate && onApplyTemplate) {
      onApplyTemplate(latestTemplate.filters);
      setActiveTemplateId(latestTemplate.id);
      onActiveTemplateChange?.(latestTemplate);
      appliedRef.current = true;
    }
  }, [enabled, latestTemplate, onApplyTemplate]);

  // ── Dirty check: compare current values against reference ──────────
  const activeTemplate = templates.find((t) => t.id === activeTemplateId);
  const referenceValues = activeTemplate ? activeTemplate.filters : defaultValues;
  const hasChangeFilter = Object.keys(values).some(
    (key) => !areFilterValuesEqual(values[key], referenceValues[key])
  );

  // ── Handlers ────────────────────────────────────────────────────────

  const resetToDefaultValue = () => {
    onApplyTemplate?.(defaultValues);
    setActiveTemplateId(undefined);
    onActiveTemplateChange?.(undefined);
  };

  const handleSave = async (name: string) => {
    if (!enabled) return;
    const id = await dbSave(name, values);
    setActiveTemplateId(id);
    setSaveDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!enabled || !activeTemplate) return;
    await dbUpdate(activeTemplate.id, { filters: values });
    toast.success(locale.templateUpdatedToast(activeTemplate.name));
  };

  const handleSelect = async (template: FilterTemplateDBV2) => {
    if (!enabled) return;

    // Toggle: clicking the already-active template unselects it
    if (activeTemplateId === template.id) {
      resetToDefaultValue();
      return;
    }

    await dbApply(template.id);
    setActiveTemplateId(template.id);
    onApplyTemplate?.(template.filters);
    onActiveTemplateChange?.(template);
  };

  const handleRequestDelete = (template: FilterTemplateDBV2) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    if (templateToDelete.id === activeTemplateId) {
      resetToDefaultValue();
    }
    await dbDelete(templateToDelete.id);
    setTemplateToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setTemplateToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleRequestRename = (template: FilterTemplateDBV2) => {
    setTemplateToRename(template);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = async (name: string) => {
    if (!templateToRename) return;
    await dbUpdate(templateToRename.id, { name });
    toast.success(locale.templateRenamedToast(name));
    setTemplateToRename(null);
    setRenameDialogOpen(false);
  };

  const handleCancelRename = () => {
    setTemplateToRename(null);
    setRenameDialogOpen(false);
  };

  const openSaveDialog = () => {
    setSaveDialogOpen(true);
  };
  const closeSaveDialog = () => {
    setSaveDialogOpen(false);
  };

  return {
    enabled,
    templates,
    latestTemplate,
    activeTemplateId,
    activeTemplate,
    hasChangeFilter,

    // Save dialog
    saveDialogOpen,
    openSaveDialog,
    closeSaveDialog,
    handleSave,

    // Update in place
    handleUpdate,

    // Template selection
    handleSelect,

    // Delete dialog
    deleteDialogOpen,
    templateToDelete,
    handleRequestDelete,
    handleConfirmDelete,
    handleCancelDelete,

    // Rename dialog
    renameDialogOpen,
    templateToRename,
    handleRequestRename,
    handleConfirmRename,
    handleCancelRename,
  };
}
