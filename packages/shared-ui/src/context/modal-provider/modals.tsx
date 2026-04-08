import { useState } from 'react';
import type React from 'react';
import { GlobalModal } from '../../components/patterns/modals/global-modal';
import { ModalContext } from './context';
import type { ModalConfig, ModalContextType } from './type';

// Store state setter for standalone functions (similar to Mantine pattern)
let setModalsState: React.Dispatch<React.SetStateAction<Record<string, ModalConfig>>> | null = null;

type ModalProviderProps = {
  children: React.ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<Record<string, ModalConfig>>({});

  const openModal = (config: ModalConfig) => {
    setModals((prev) => ({
      ...prev,
      [config.modalId]: config,
    }));
  };

  const closeModal = (id: string) => {
    setModals((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const closeAllModals = () => {
    setModals({});
  };

  const updateModal = (id: string, updates: Partial<ModalConfig>) => {
    setModals((prev) => {
      if (!prev[id]) {
        return prev;
      }
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        } as ModalConfig,
      };
    });
  };

  const contextValue: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  };

  // Store setter for standalone functions
  setModalsState = setModals;

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <GlobalModal />
    </ModalContext.Provider>
  );
}

// Standalone functions (can be called from anywhere without hooks)
export function openModal(config: ModalConfig) {
  if (!setModalsState) {
    throw new Error('ModalProvider must be mounted before using openModal');
  }
  setModalsState((prev) => ({
    ...prev,
    [config?.modalId]: config,
  }));
}

export function closeModal(modalId: string) {
  if (!setModalsState) {
    throw new Error('ModalProvider must be mounted before using closeModal');
  }
  setModalsState((prev) => {
    const { [modalId]: _, ...rest } = prev;
    return rest;
  });
}

export function closeAllModals() {
  if (!setModalsState) {
    throw new Error('ModalProvider must be mounted before using closeAllModals');
  }
  setModalsState({});
}

export function updateModal(modalId: string, updates: Partial<ModalConfig>) {
  if (!setModalsState) {
    throw new Error('ModalProvider must be mounted before using updateModal');
  }
  setModalsState((prev) => {
    if (!prev[modalId]) {
      return prev;
    }
    return {
      ...prev,
      [modalId]: {
        ...prev[modalId],
        ...updates,
      } as ModalConfig,
    };
  });
}

// Helper functions for common modal types

/**
 * @description Helper functions for common modal types
 * @example
 * modals.close('my-modal');
 *
 * modals.closeAll();
 *
 * modals.updateProps('my-modal', { title: 'New Title' });
 *
 * modals.confirm({
 *   title: 'Are you sure?',
 *   onConfirm: () => console.log('confirmed'),
 * });
 *
 * modals.open({
 *   title: 'My Modal',
 *   content: <div>Content here</div>,
 * });
 *
 * modals.custom({
 *   component: MyCustomModal,
 *   componentProps: { title: 'Custom Modal' },
 *   onClose: () => console.log('closed'),
 * });
 */
export const modals = {
  close: closeModal,
  closeAll: closeAllModals,
  confirm: (
    config: Omit<
      Extract<ModalConfig, { type: 'confirm' | 'inner-content' }>,
      'type' | 'modalId' | 'style'
    > & { modalId?: string }
  ) => {
    openModal({
      ...config,
      type: 'confirm',
      style: 'dialog',
      modalId: config?.modalId || Date.now().toString(),
    } as ModalConfig);
  },
  open: (
    config: Omit<Extract<ModalConfig, { type: 'inner-content' }>, 'type' | 'modalId'> & {
      modalId?: string;
      style: 'dialog' | 'drawer';
    }
  ) => {
    openModal({
      ...config,
      type: 'inner-content',
      modalId: config?.modalId || Date.now().toString(),
    } as ModalConfig);
  },
  custom: <TProps = Record<string, unknown>>(
    config: Omit<
      Extract<ModalConfig, { type: 'custom' }>,
      'type' | 'modalId' | 'component' | 'componentProps'
    > & {
      modalId?: string;
      component: React.ComponentType<TProps>;
      componentProps?: TProps;
    }
  ) => {
    openModal({
      ...config,
      type: 'custom',
      modalId: config?.modalId || Date.now().toString(),
    } as ModalConfig);
  },
  updateProps: (modalId: string, updates: Partial<ModalConfig>) => {
    updateModal(modalId, updates);
  },
};
