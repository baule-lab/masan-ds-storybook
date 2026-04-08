import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/overlays/dialog';
import { Button } from '../../ui/actions/button';
import { LoaderCircle, X, Check, AlertTriangle, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { cn } from '../../../lib/utils';

type Props = {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  showCancel?: boolean;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  confirmIcon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  hideFooter?: boolean;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;

  /**
   * @description The size of the dialog. Can be a string for custom sizes.
   * @example 'sm', 'md', 'lg', 'xl', 'fullscreen', '90%', '800px', '60vw'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' | (string & {});
  extraFooter?: React.ReactNode;
};

export function BaseDialog({
  id,
  className,
  title,
  description,
  content,
  children,
  onClose,
  onConfirm,
  showCancel,
  cancelText,
  confirmText,
  confirmIcon,
  variant,
  hideFooter,
  open = true,
  disabled = false,
  loading,
  size = 'lg',
  extraFooter,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      if (disabled || loading) return;
      if (onConfirm) {
        setIsLoading(true);
        await onConfirm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCustomSize = !['sm', 'md', 'lg', 'xl'].includes(size);

  const getSizeClasses = () => {
    if (size === 'fullscreen' || isCustomSize) {
      // For fullscreen, we'll use inline styles to override defaults
      return '';
    }

    const widthMap = {
      sm: 'sm:!max-w-sm',
      md: 'sm:!max-w-md',
      lg: 'sm:!max-w-lg',
      xl: 'sm:!max-w-xl',
    };
    return widthMap[size as keyof typeof widthMap];
  };

  const getSizeStyles = (): React.CSSProperties => {
    if (size === 'fullscreen') {
      return {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
      };
    }

    if (isCustomSize) {
      return {
        width: size,
        maxWidth: size,
        maxHeight: '90vh',
      };
    }

    return {};
  };

  const getConfirmIcon = () => {
    if (isLoading) {
      return <LoaderCircle className="size-4 animate-spin" />;
    }

    if (confirmIcon) return confirmIcon;

    switch (variant) {
      case 'success':
        return <Check className="size-4" />;
      case 'destructive':
        return <Trash2 className="size-4" />;
      case 'warning':
        return <AlertTriangle className="size-4" />;
      default:
        return <Check className="size-4" />;
    }
  };

  const getButtonVariant = () => {
    if (variant === 'destructive') return 'destructive';
    if (variant === 'success') return 'default';
    if (variant === 'warning') return 'default';
    return 'default';
  };

  const getButtonClassName = () => {
    if (variant === 'success') {
      return 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-500';
    }
    if (variant === 'warning') {
      return 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md transition-all dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-500';
    }
    return '';
  };

  return (
    <Dialog key={id} open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(getSizeClasses(), className ?? '')} style={getSizeStyles()}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {content} {children}
        {!hideFooter && (
          <DialogFooter>
            {extraFooter}

            {showCancel !== false && (
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="size-4" />
                {cancelText ?? 'Cancel'}
              </Button>
            )}
            {onConfirm && (
              <Button
                type="button"
                variant={getButtonVariant()}
                className={getButtonClassName()}
                onClick={handleConfirm}
                disabled={disabled || loading || isLoading}
              >
                {isLoading || loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  getConfirmIcon()
                )}
                {confirmText ?? 'Confirm'}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
