import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/overlays/tooltip';

export type LongTextMode = 'tooltip' | 'wrap' | 'translate';

type LongTextProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /**
   * Display mode for overflowing text.
   * @default 'tooltip'
   */
  mode?: LongTextMode;
  /**
   * Scroll speed in pixels per second (translate mode only).
   * @default 50
   */
  speed?: number;
  /**
   * Backward-compat alias for mode="wrap".
   * @default false
   */
  wrap?: boolean;

  /**
   * @deprecated Width is now driven by the parent container. This prop has no effect.
   */
  maxWidth?: string;
};

export function LongText({
  children,
  className = '',
  contentClassName = '',
  mode: modeProp = 'tooltip',
  speed = 50,
  wrap = false,
}: LongTextProps) {
  const effectiveMode: LongTextMode = wrap ? 'wrap' : modeProp;

  // Tooltip mode — invisible absolute probe for stable, resize-aware overflow detection.
  // The probe always stays in the DOM so the ResizeObserver never loses its target.
  const measureRef = useRef<HTMLSpanElement>(null);
  const [isOverflown, setIsOverflown] = useState(false);

  // Translate mode
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);

  useEffect(() => {
    if (effectiveMode !== 'tooltip') return;
    const el = measureRef.current;
    if (!el) return;

    const check = () => setIsOverflown(el.scrollWidth > el.offsetWidth);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [effectiveMode]);

  useEffect(() => {
    if (effectiveMode !== 'translate') return;
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const compute = () => {
      const overflow = text.scrollWidth - container.offsetWidth;
      if (overflow > 0) {
        setTranslateX(-(overflow + 20));
        setAnimationDuration(overflow / speed);
      } else {
        setTranslateX(0);
        setAnimationDuration(0);
      }
    };
    compute();

    const observer = new ResizeObserver(compute);
    observer.observe(container);
    return () => observer.disconnect();
  }, [effectiveMode, speed, children]);

  // ── Wrap mode ──────────────────────────────────────────────────────────────
  if (effectiveMode === 'wrap') {
    return (
      <div className={cn('wrap-break-word w-full whitespace-normal', className)}>{children}</div>
    );
  }

  // ── Translate mode ─────────────────────────────────────────────────────────
  if (effectiveMode === 'translate') {
    const isTruncated = translateX !== 0;
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: hover triggers scroll animation only
      <div
        ref={containerRef}
        className={cn('relative w-full overflow-hidden whitespace-nowrap', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          ref={textRef}
          className={cn(
            'inline-block transition-transform ease-linear',
            !isHovered && 'w-full truncate'
          )}
          style={{
            transform: isHovered && isTruncated ? `translateX(${translateX}px)` : 'translateX(0)',
            transitionDuration: isHovered && isTruncated ? `${animationDuration}s` : '0.3s',
          }}
        >
          {children}
        </span>
      </div>
    );
  }

  // ── Tooltip mode (default) ─────────────────────────────────────────────────
  //
  // An invisible absolute probe (inset-0, whitespace-nowrap) always fills the
  // container width and reports the true text scrollWidth, giving ResizeObserver
  // a stable DOM node that is never conditionally unmounted.
  return (
    <div className={cn('relative w-full min-w-0', className)}>
      <span
        ref={measureRef}
        className="pointer-events-none absolute inset-0 select-none overflow-hidden whitespace-nowrap"
        style={{ visibility: 'hidden' }}
        aria-hidden="true"
      >
        {children}
      </span>

      {/* Desktop — Tooltip */}
      <div className="hidden sm:block">
        {isOverflown ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="truncate">{children}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p className={contentClassName}>{children}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="truncate">{children}</div>
        )}
      </div>

      {/* Mobile — Popover on tap */}
      <div className="sm:hidden">
        {isOverflown ? (
          <Popover>
            <PopoverTrigger>
              <div className="truncate">{children}</div>
            </PopoverTrigger>
            <PopoverContent className={cn('w-fit', contentClassName)}>
              <p>{children}</p>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="truncate">{children}</div>
        )}
      </div>
    </div>
  );
}
