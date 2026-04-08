import { ConfirmDialog } from './confirm-dialog';
import { BaseDialog } from './base-dialog';
import { BaseDrawer } from './base-drawer';
import { useModals } from '../../../context/modal-provider/useModals';

export function GlobalModal() {
  const { modals, closeModal } = useModals();

  return (
    <>
      {Object.entries(modals).map(([id, config]) => {
        const handleClose = () => {
          config.onClose?.();
          closeModal(id);
        };

        const handleConfirm = async () => {
          if (config.onConfirm) {
            await config.onConfirm();
          }
          closeModal(id);
        };

        if (config.type === 'confirm') {
          return (
            <ConfirmDialog
              key={id}
              id={id}
              open={true}
              onClose={handleClose}
              onConfirm={handleConfirm}
              title={config.title}
              description={config.description}
              content={config.content}
              confirmText={config.confirmText}
              cancelText={config.cancelText}
              variant={config.variant}
              className={config.className}
              showCancel={config.showCancel}
            />
          );
        }

        if (config.type === 'custom') {
          const Component = config.component;
          return (
            <Component
              key={id}
              {...config.componentProps}
              onClose={handleClose}
              onConfirm={config.onConfirm ? handleConfirm : undefined}
            />
          );
        }

        // inner-content type
        const isDrawer = config.style === 'drawer';
        const direction = config.direction ?? 'right';

        if (config.type === 'inner-content') {
          if (isDrawer) {
            return (
              <BaseDrawer
                key={id}
                id={id}
                className={config.className}
                title={config.title}
                description={config.description}
                content={config.content}
                onClose={handleClose}
                onConfirm={config.onConfirm ? handleConfirm : undefined}
                showCancel={config.showCancel}
                cancelText={config.cancelText}
                confirmText={config.confirmText}
                variant={config.variant}
                open={true}
                direction={direction}
              />
            );
          }

          return (
            <BaseDialog
              key={id}
              id={id}
              className={config.className}
              title={config.title}
              description={config.description}
              content={config.content}
              onClose={handleClose}
              onConfirm={config.onConfirm ? handleConfirm : undefined}
              showCancel={config.showCancel}
              cancelText={config.cancelText}
              confirmText={config.confirmText}
              variant={config.variant}
              open={true}
            />
          );
        }

        return null;
      })}
    </>
  );
}
