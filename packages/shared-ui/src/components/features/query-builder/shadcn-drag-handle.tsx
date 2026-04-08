import { forwardRef } from 'react';
import type { DragHandleProps } from 'react-querybuilder';
import { GripVertical } from 'lucide-react';

export type ShadcnDragHandleProps = DragHandleProps & React.HTMLAttributes<HTMLSpanElement>;

export const ShadcnDragHandle = forwardRef<HTMLSpanElement, ShadcnDragHandleProps>(
  ({ className, title, ...props }, ref) => (
    <span ref={ref} className={className} title={title} {...props}>
      <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
    </span>
  )
);

ShadcnDragHandle.displayName = 'ShadcnDragHandle';
