import { createContext, useContext } from 'react';

export interface FilterPanelLocaleV2 {
  // ── Template section ────────────────────────────────────────────────
  /** Label above the template chips row. Default: "Saved Templates" */
  savedTemplatesLabel: string;

  // ── Template chip ───────────────────────────────────────────────────
  /** Shown when no templates have been saved yet. Default: "No saved templates" */
  emptyTemplatesTitle: string;
  /** Sub-text shown in the empty state. Default: "Save your current filters to create one." */
  emptyTemplatesSubtitle: string;
  /** Name shown in the chip when no template is active. Default: "Default" */
  defaultTemplateName: string;
  /** Save button label in the chip row. Default: "Save" */
  saveButtonLabel: string;
  /** "Save as new" option in the save popover. Default: "Save as New..." */
  saveAsNewLabel: string;
  /**
   * "Update existing" option in the save popover.
   * Receives the active template name.
   * Default: (name) => `Update "${name}"`
   */
  updateTemplateLabel: (name: string) => string;

  // ── Save-template dialog ─────────────────────────────────────────────
  /** Dialog heading. Default: "Save Template" */
  saveDialogTitle: string;
  /** Dialog description. Default: "Give your current filter configuration a name so you can reuse it later." */
  saveDialogDescription: string;
  /** Label for the template-name input. Default: "Template name" */
  templateNameLabel: string;
  /** Placeholder for the template-name input. Default: "e.g. Monthly sales report" */
  templateNamePlaceholder: string;
  /** Save button inside the dialog. Default: "Save" */
  saveLabel: string;

  // ── Delete-template dialog ───────────────────────────────────────────
  /** Dialog heading. Default: "Delete Template" */
  deleteDialogTitle: string;
  /**
   * Body text for the delete confirmation dialog.
   * Receives the template name to delete.
   * Default: (name) => `Are you sure you want to delete "${name}"? This action cannot be undone.`
   */
  deleteDialogDescription: (name: string) => string;
  /** Delete button label. Default: "Delete" */
  deleteLabel: string;

  // ── Shared ───────────────────────────────────────────────────────────
  /** Cancel button shared across dialogs. Default: "Cancel" */
  cancelLabel: string;

  // ── Toast messages ───────────────────────────────────────────────────
  /**
   * Toast shown after successfully updating a template.
   * Receives the template name.
   * Default: (name) => `Template "${name}" updated`
   */
  templateUpdatedToast: (name: string) => string;

  // ── Rename-template dialog ───────────────────────────────────────────
  /** Dialog heading. Default: "Rename Template" */
  renameDialogTitle: string;
  /** Rename confirm button label. Default: "Rename" */
  renameLabel: string;
  /**
   * Toast shown after successfully renaming a template.
   * Receives the new template name.
   * Default: (name) => `Template "${name}" renamed`
   */
  templateRenamedToast: (name: string) => string;
}

export const defaultFilterPanelLocaleV2: FilterPanelLocaleV2 = {
  savedTemplatesLabel: 'Saved Templates',

  emptyTemplatesTitle: 'No saved templates',
  emptyTemplatesSubtitle: 'Save your current filters to create one.',
  defaultTemplateName: 'Default',
  saveButtonLabel: 'Save',
  saveAsNewLabel: 'Save as New...',
  updateTemplateLabel: (name) => `Update "${name}"`,

  saveDialogTitle: 'Save Template',
  saveDialogDescription: 'Give your current filter configuration a name so you can reuse it later.',
  templateNameLabel: 'Template name',
  templateNamePlaceholder: 'e.g. Monthly sales report',
  saveLabel: 'Save',

  deleteDialogTitle: 'Delete Template',
  deleteDialogDescription: (name) =>
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,
  deleteLabel: 'Delete',

  cancelLabel: 'Cancel',

  templateUpdatedToast: (name) => `Template "${name}" updated`,

  renameDialogTitle: 'Rename Template',
  renameLabel: 'Rename',
  templateRenamedToast: (name) => `Template "${name}" renamed`,
};

export const FilterPanelLocaleContextV2 = createContext<FilterPanelLocaleV2>(
  defaultFilterPanelLocaleV2
);

export function useFilterPanelLocaleV2(): FilterPanelLocaleV2 {
  return useContext(FilterPanelLocaleContextV2);
}
