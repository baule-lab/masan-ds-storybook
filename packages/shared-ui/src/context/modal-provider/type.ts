import type React from 'react';

type CustomModalConfig = {
  modalId: string;
  type: 'custom'; // full custom modal
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  // Modal component to be rendered
  component: React.ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
};

export type ModalConfig =
  | CustomModalConfig
  | {
      modalId: string;
      type: 'confirm' | 'inner-content';
      style?: 'dialog' | 'drawer';
      direction?: 'top' | 'bottom' | 'left' | 'right';
      title?: React.ReactNode;
      description?: React.ReactNode;
      content?: React.ReactNode;
      variant?: 'default' | 'destructive' | 'success' | 'warning';
      onClose?: () => void;
      onConfirm?: () => void | Promise<void>;
      cancelText?: React.ReactNode;
      confirmText?: React.ReactNode;
      showCancel?: boolean;
      className?: string;
      hideFooter?: boolean;
      disabled?: boolean;
      loading?: boolean;
    };

export interface ModalContextType {
  modals: Record<string, ModalConfig>;
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
}
