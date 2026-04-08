import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../ui/overlays/sheet';
import { Button } from '../../ui/actions/button';
import type React from 'react';
import { cn } from '../../../lib/utils';
import { useState } from 'react';
import { LoaderCircle, XIcon, Maximize2, Minimize2 } from 'lucide-react';

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
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  hideFooter?: boolean;
  open?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  /**
   * @description The size of the drawer. Can be a string for custom sizes.
   * @example 'sm', 'md', 'lg', 'xl', 'fullscreen', '90%', '800px', '60vw'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' | (string & {});
  showFullscreenToggle?: boolean;
  /**
   * Merged onto the main body wrapper (below the header, above the footer).
   * Use to change overflow (e.g. nested column scrolling) while keeping flex-growth.
   */
  contentContainerClassName?: string;
};

export function BaseDrawer({
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
  variant,
  hideFooter,
  open = true,
  direction = 'right',
  disabled = false,
  loading,
  size = 'lg',
  showFullscreenToggle = true,
  contentContainerClassName,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSize, setCurrentSize] = useState(size);
  const [previousSize, setPreviousSize] = useState<Exclude<typeof size, 'fullscreen'>>('md');

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

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentSize === 'fullscreen') {
      setCurrentSize(previousSize);
    } else {
      setPreviousSize(currentSize as Exclude<typeof currentSize, 'fullscreen'>);
      setCurrentSize('fullscreen');
    }
  };

  const isCustomSize = !['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(currentSize);

  const getSizeClasses = () => {
    if (currentSize === 'fullscreen' || isCustomSize) {
      return '';
    }

    const isHorizontal = direction === 'left' || direction === 'right';

    if (isHorizontal) {
      const widthMap = {
        sm: 'sm:!max-w-sm',
        md: 'sm:!max-w-md',
        lg: 'sm:!max-w-lg',
        xl: 'sm:!max-w-xl',
      };
      return widthMap[currentSize as keyof typeof widthMap];
    }

    const heightMap = {
      sm: '!max-h-[50vh]',
      md: '!max-h-[70vh]',
      lg: '!max-h-[80vh]',
      xl: '!max-h-[90vh]',
    };
    return heightMap[currentSize as keyof typeof heightMap];
  };

  const getSizeStyles = (): React.CSSProperties => {
    if (currentSize === 'fullscreen') {
      const isHorizontal = direction === 'left' || direction === 'right';
      if (isHorizontal) {
        return { width: '100%', maxWidth: '100%' };
      }
      return { maxHeight: '100vh', height: '100vh' };
    }

    if (isCustomSize) {
      const isHorizontal = direction === 'left' || direction === 'right';
      if (isHorizontal) {
        return { width: currentSize, maxWidth: currentSize };
      }
      return { height: currentSize, maxHeight: currentSize };
    }

    return {};
  };

  return (
    <Sheet key={id} open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side={direction}
        showCloseButton={false}
        className={cn('flex flex-col gap-0', getSizeClasses(), className)}
        style={getSizeStyles()}
      >
        {title && (
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <div className="flex items-center gap-2">
              {showFullscreenToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFullscreen}
                  disabled={loading}
                  aria-label={currentSize === 'fullscreen' ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {currentSize === 'fullscreen' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </Button>
              )}
              <SheetClose
                render={
                  <Button variant="ghost" size="icon" disabled={loading}>
                    <XIcon size={20} />
                  </Button>
                }
              />
            </div>
          </SheetHeader>
        )}
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-9',
            contentContainerClassName
          )}
        >
          {description && <SheetDescription render={<div />}>{description}</SheetDescription>}
          {content}
          {children}
        </div>
        {!hideFooter && (
          <SheetFooter className="mt-auto flex flex-row items-center justify-end gap-2 border-t bg-background">
            {showCancel !== false && (
              <SheetClose
                render={
                  <Button variant="ghost" disabled={loading}>
                    {cancelText ?? 'Close'}
                  </Button>
                }
              />
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
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
