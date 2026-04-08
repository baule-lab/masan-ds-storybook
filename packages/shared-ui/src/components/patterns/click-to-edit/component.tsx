import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { Check, Pencil, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  type ClickToEditVariants,
  clickToEditVariants,
  sizeActionBtn,
  sizeIcon,
  sizeLayout,
  statusMessageColors,
} from './click-to-edit-variants';

export interface ClickToEditProps extends ClickToEditVariants {
  /** Content displayed in view mode */
  children: ReactNode;
  /** Render function for edit mode — receives confirm/cancel callbacks */
  renderEditor: (props: { onConfirm: () => void; onCancel: () => void }) => ReactNode;
  /** Status feedback variant */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** Optional message displayed below the component */
  statusMessage?: string;
  /** Disable editing */
  disabled?: boolean;
  /** Controlled editing state */
  isEditing?: boolean;
  /** Initial editing state (uncontrolled) */
  defaultEditing?: boolean;
  /** Called when entering edit mode */
  onEditStart?: () => void;
  /** Called when user confirms edit */
  onConfirm?: () => void;
  /** Called when user cancels edit */
  onCancel?: () => void;
  /** Show pencil icon on hover (default: true) */
  showEditIcon?: boolean;
  /** Show confirm/cancel action buttons in edit mode (default: true) */
  showActions?: boolean;
  /** Click anywhere on display to enter edit mode (default: true) */
  editOnClick?: boolean;
  /** Additional class for the outer container */
  className?: string;
}

export function ClickToEdit({
  children,
  renderEditor,
  status = 'default',
  statusMessage,
  disabled = false,
  isEditing: controlledIsEditing,
  defaultEditing = false,
  onEditStart,
  onConfirm,
  onCancel,
  size: sizeProp = 'default',
  showEditIcon = true,
  showActions = true,
  editOnClick = true,
  className,
}: ClickToEditProps) {
  const size = sizeProp ?? 'default';
  const isControlled = controlledIsEditing !== undefined;
  const [internalEditing, setInternalEditing] = useState(defaultEditing);
  const editing = isControlled ? controlledIsEditing : internalEditing;
  const containerRef = useRef<HTMLDivElement>(null);

  const startEditing = useCallback(() => {
    if (disabled) return;
    if (!isControlled) setInternalEditing(true);
    onEditStart?.();
  }, [disabled, isControlled, onEditStart]);

  const handleConfirm = useCallback(() => {
    if (!isControlled) setInternalEditing(false);
    onConfirm?.();
  }, [isControlled, onConfirm]);

  const handleCancel = useCallback(() => {
    if (!isControlled) setInternalEditing(false);
    onCancel?.();
  }, [isControlled, onCancel]);

  /** Close on Escape key when in edit mode */
  useEffect(() => {
    if (!editing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [editing, handleCancel]);

  return (
    <div className="inline-flex w-full flex-col">
      <div
        ref={containerRef}
        className={cn(
          clickToEditVariants({ status, size }),
          disabled && 'pointer-events-none opacity-50',
          className
        )}
      >
        {editing ? (
          /* ── Edit Mode: editor renders directly, no extra padding ── */
          <div className="flex items-center gap-1">
            <div className="min-w-0 flex-1">
              {renderEditor({ onConfirm: handleConfirm, onCancel: handleCancel })}
            </div>
            {showActions && (
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={cn(
                    'inline-flex items-center justify-center rounded text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30',
                    sizeActionBtn[size]
                  )}
                  aria-label="Confirm"
                >
                  <Check className={sizeIcon[size]} />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={cn(
                    'inline-flex items-center justify-center rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30',
                    sizeActionBtn[size]
                  )}
                  aria-label="Cancel"
                >
                  <X className={sizeIcon[size]} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Display Mode: clean, borderless, hover reveals edit icon ── */
          <div
            className={cn(
              'flex items-center rounded-md transition-colors',
              sizeLayout[size],
              !disabled && editOnClick && 'cursor-pointer hover:bg-accent/50'
            )}
            onClick={editOnClick ? startEditing : undefined}
            onKeyDown={
              editOnClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      startEditing();
                    }
                  }
                : undefined
            }
            role="button"
            tabIndex={editOnClick && !disabled ? 0 : undefined}
          >
            <div className="min-w-0 flex-1">{children}</div>
            {showEditIcon && !disabled && (
              <span
                className={cn(
                  'inline-flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/cte:text-foreground',
                  sizeActionBtn[size]
                )}
                aria-hidden="true"
              >
                <Pencil className={sizeIcon[size]} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Status Message ── */}
      {statusMessage && (
        <p
          className={cn(
            'mt-1',
            size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs',
            statusMessageColors[status ?? 'default']
          )}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
