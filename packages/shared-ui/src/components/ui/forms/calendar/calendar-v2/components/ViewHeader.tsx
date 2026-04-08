/**
 * Shared navigation header used by YearGridView, MonthGridView, and WeekView.
 * Matches the height and button size of react-day-picker's built-in nav bar
 * so all view modes feel visually identical.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '../../../../actions/button';
import { cn } from '../../../../../../lib/utils';

type ViewHeaderProps = {
  /** Center label — pass a string or a <button> for drill-up */
  title: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  /** When provided the title renders as a clickable button (drill-up). */
  onTitleClick?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

export function ViewHeader({
  title,
  onPrev,
  onNext,
  onTitleClick,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  prevDisabled,
  nextDisabled,
}: ViewHeaderProps) {
  return (
    <div className="relative flex h-7 items-center justify-center">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        disabled={prevDisabled}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'absolute left-0 size-7')}
      >
        <ChevronLeft className="size-4" />
      </button>

      {onTitleClick ? (
        <button
          type="button"
          onClick={onTitleClick}
          className="select-none rounded px-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {title}
        </button>
      ) : (
        <span className="select-none font-medium text-sm">{title}</span>
      )}

      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        disabled={nextDisabled}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'absolute right-0 size-7'
        )}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
