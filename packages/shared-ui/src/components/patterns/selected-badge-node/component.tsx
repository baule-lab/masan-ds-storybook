import type * as React from 'react';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils';
import { Badge } from '../../ui/display/badge';
import { LongText } from '../long-text';
import { XCircle } from 'lucide-react';

/**
 * Props for the `SelectedBadgeNode` component.
 * Represents a single selected item rendered as a badge with optional icon and remove action.
 */
export interface SelectedBadgeNodeProps {
  /** Text label displayed inside the badge. */
  label: string;
  /** Maximum width for the label text before it truncates with tooltip. */
  badgeLabelMaxWidth: string;
  /** Additional class names applied to the underlying `Badge` element. */
  badgeClassName?: string;
  /** Inline styles applied to the underlying `Badge` element. */
  badgeStyle?: CSSProperties;
  /** Optional leading icon component rendered before the label. */
  IconComponent?: React.ComponentType<{ className?: string }>;
  /** Whether the leading icon should be shown when `IconComponent` is provided. */
  showIcon?: boolean;
  /** Additional class names applied to the leading icon. */
  iconClassName?: string;
  /** Inline styles applied to the leading icon. */
  iconStyle?: CSSProperties;
  /** Callback invoked when the badge's remove action is triggered. */
  onRemove: () => void;
  /**
   * Accessible label for the remove button.
   * Defaults to "Remove {label} from selection" when not provided.
   */
  removeAriaLabel?: string;
  /** When true, renders a more compact visual style for small layouts. */
  compactMode?: boolean;
  /**
   * Controls visibility of the trailing remove (X) icon.
   * When false, the remove control is hidden entirely.
   * Defaults to true.
   */
  showRemoveIcon?: boolean;
}

export const SelectedBadgeNode: React.FC<SelectedBadgeNodeProps> = ({
  label,
  badgeLabelMaxWidth,
  badgeClassName,
  badgeStyle,
  IconComponent,
  showIcon = true,
  iconClassName,
  iconStyle,
  onRemove,
  removeAriaLabel,
  compactMode,
  showRemoveIcon = true,
}) => {
  return (
    <Badge className={cn('[&>svg]:pointer-events-auto', badgeClassName)} style={badgeStyle}>
      {IconComponent && showIcon && (
        <IconComponent className={iconClassName} {...(iconStyle ? { style: iconStyle } : {})} />
      )}
      <LongText maxWidth={badgeLabelMaxWidth} className="text-xs leading-normal">
        {label}
      </LongText>
      {showRemoveIcon && (
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              onRemove();
            }
          }}
          aria-label={removeAriaLabel ?? `Remove ${label} from selection`}
          className={cn(
            'relative -m-0.5 ml-2 h-4 w-4 cursor-pointer rounded-sm p-0.5 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/50 dark:focus:ring-black/50 dark:hover:bg-black/20',
            compactMode && 'ml-1'
          )}
        >
          <XCircle className={cn('absolute top-0 right-0 h-3 w-3', compactMode && 'h-2.5 w-2')} />
        </div>
      )}
    </Badge>
  );
};
