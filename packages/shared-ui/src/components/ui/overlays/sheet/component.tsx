'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';

import { XIcon } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../actions/button';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetPrimitive.Trigger.Props>(
  function SheetTrigger(props, ref) {
    return <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
  }
);

const SheetClose = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Close>,
  SheetPrimitive.Close.Props
>(function SheetClose(props, ref) {
  return <SheetPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />;
});

const SheetPortal = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Portal>,
  SheetPrimitive.Portal.Props
>(function SheetPortal(props, ref) {
  return <SheetPrimitive.Portal ref={ref} data-slot="sheet-portal" {...props} />;
});

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Backdrop>,
  SheetPrimitive.Backdrop.Props
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Backdrop
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      {...props}
    />
  );
});

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Popup>,
  SheetPrimitive.Popup.Props & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    showCloseButton?: boolean;
  }
>(function SheetContent(
  { className, children, side = 'right', showCloseButton = true, ...props },
  ref
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        ref={ref}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-background bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=bottom]:inset-x-0 data-[side=top]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:h-auto data-[side=left]:h-full data-[side=right]:h-full data-[side=top]:h-auto data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:border-t data-[side=left]:border-r data-[side=top]:border-b data-[side=right]:border-l data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button variant="ghost" className="absolute top-3 right-3" size="icon-sm">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
});

const SheetHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function SheetHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sheet-header"
        className={cn('flex flex-col gap-0.5 p-4', className)}
        {...props}
      />
    );
  }
);

const SheetFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sheet-footer"
        className={cn('mt-auto flex flex-col gap-2 p-4', className)}
        {...props}
      />
    );
  }
);

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  SheetPrimitive.Title.Props
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn('font-medium text-base text-foreground', className)}
      {...props}
    />
  );
});

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  SheetPrimitive.Description.Props
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
});

Sheet.displayName = 'Sheet';
SheetTrigger.displayName = 'SheetTrigger';
SheetClose.displayName = 'SheetClose';
SheetPortal.displayName = 'SheetPortal';
SheetOverlay.displayName = 'SheetOverlay';
SheetContent.displayName = 'SheetContent';
SheetHeader.displayName = 'SheetHeader';
SheetFooter.displayName = 'SheetFooter';
SheetTitle.displayName = 'SheetTitle';
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
