import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/overlays/alert-dialog';
import { Button } from '../../ui/actions/button';
import { cn } from '../../../lib/utils';
import type React from 'react';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

type ConfirmDialogProps = {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  description?: string | React.ReactNode;
  content?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  showCancel?: boolean;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  hideFooter?: boolean;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  /**
   * @deprecated Use onClose instead
   */
  onOpenChange?: (open: boolean) => void;
};

export function ConfirmDialog({
  id,
  className,
  title,
  description,
  content,
  onClose,
  onConfirm,
  showCancel,
  cancelText,
  confirmText,
  variant,
  hideFooter,
  open = true,
  disabled = false,
  loading,
  children,
  onOpenChange,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      if (disabled || loading) return;
      if (onConfirm) {
        setIsLoading(true);
        await onConfirm();
      }
      onClose?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      key={id}
      open={open}
      onOpenChange={(open) => {
        if (onOpenChange) {
          onOpenChange(open);
        } else {
          !open && onClose?.();
        }
      }}
    >
      <AlertDialogContent className={cn(className ?? '')}>
        {title && (
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && (
              <AlertDialogDescription asChild>
                <div>{description}</div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        {content}
        {children}
        {!hideFooter && (
          <AlertDialogFooter>
            {showCancel !== false && (
              <AlertDialogCancel disabled={loading} onClick={onClose}>
                {cancelText ?? 'Cancel'}
              </AlertDialogCancel>
            )}
            {onConfirm && (
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                onClick={handleConfirm}
                disabled={disabled || loading}
              >
                {isLoading && <LoaderCircle className="size-4 animate-spin" />}
                {confirmText ?? 'Confirm'}
              </Button>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
