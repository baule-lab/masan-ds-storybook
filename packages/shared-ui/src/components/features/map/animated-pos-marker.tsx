'use client';

import { Flame } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/use-reduced-motion';
import { cn } from '../../../lib/utils';

/**
 * POS health status for color mapping
 * Note: 'healthy' maps to POSStatus 'active' from backend
 */
export type POSStatus = 'healthy' | 'warning' | 'critical';

/**
 * Map backend POSStatus ('active') to marker status ('healthy')
 */
export type BackendPOSStatus = 'active' | 'warning' | 'critical';

export const mapBackendStatus = (status: BackendPOSStatus): POSStatus => {
  if (status === 'active') return 'healthy';
  return status;
};

/**
 * Marker size variants
 */
export type MarkerSize = 'sm' | 'md' | 'lg' | 'xl';
/**
 * Component props
 */
export interface AnimatedPOSMarkerProps {
  /** Health status determining color scheme */
  status: POSStatus;
  /** Marker size variant */
  size?: MarkerSize;
  /** Optional count for cluster markers (displays in center) */
  count?: number;
  /** Optional click handler */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Enable FPS monitoring (dev only) - defaults to false */
  enableFpsMonitor?: boolean;
}

/**
 * Color configuration for each status
 */
const STATUS_COLORS = {
  healthy: {
    inner: 'bg-emerald-500', // #10b981
    outer: 'bg-emerald-400', // #34d399
    glow: 'shadow-emerald-500/50',
    pulse: 'bg-emerald-400', // Removed /30 - opacity controlled by CSS animation
  },
  warning: {
    inner: 'bg-orange-500', // #f59e0b
    outer: 'bg-orange-400', // #fb923c
    glow: 'shadow-orange-500/50',
    pulse: 'bg-orange-400', // Removed /30 - opacity controlled by CSS animation
  },
  critical: {
    inner: 'bg-pink-500', // #ec4899
    outer: 'bg-red-500', // #ef4444
    glow: 'shadow-red-500/50',
    pulse: 'bg-red-400', // Removed /30 - opacity controlled by CSS animation
  },
} as const;

/**
 * Size configuration
 * Based on design spec from plan.md:
 * - sm: Single points (16px inner, 28px glow, 40px pulse)
 * - md: Small clusters <50 (24px inner, 40px glow, 56px pulse)
 * - lg: Med clusters 50-99 (32px inner, 52px glow, 72px pulse)
 * - xl: Large clusters 100+ (40px inner, 64px glow, 88px pulse)
 */
const SIZE_CONFIG = {
  sm: {
    inner: 'size-4', // 16px
    glow: 'size-7', // 28px
    pulse: 'size-10', // 40px
    icon: 'size-2.5', // 10px
    text: 'text-[8px]',
  },
  md: {
    inner: 'size-6', // 24px
    glow: 'size-10', // 40px
    pulse: 'size-14', // 56px
    icon: 'size-3.5', // 14px
    text: 'text-[10px]',
  },
  lg: {
    inner: 'size-8', // 32px
    glow: 'w-[52px] h-[52px]', // 52px (arbitrary value)
    pulse: 'w-[72px] h-[72px]', // 72px (arbitrary value)
    icon: 'size-4', // 16px
    text: 'text-xs',
  },
  xl: {
    inner: 'size-10', // 40px
    glow: 'size-16', // 64px
    pulse: 'w-[88px] h-[88px]', // 88px (arbitrary value)
    icon: 'size-5', // 20px
    text: 'text-sm',
  },
} as const;

interface MarkerContentProps {
  status: POSStatus;
  sizes: (typeof SIZE_CONFIG)[MarkerSize];
  count?: number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
  shouldAnimate: boolean;
  isInViewport: boolean;
}

/**
 * Marker content for interactive variant
 */
function InteractiveMarker({
  status,
  sizes,
  count,
  onClick,
  className,
  shouldAnimate,
  isInViewport,
}: MarkerContentProps) {
  const colors = STATUS_COLORS[status];
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(e as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={cn('relative inline-flex cursor-pointer items-center justify-center', className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={count ? `${status} cluster with ${count} POS machines` : `${status} POS machine`}
      style={{
        // GPU optimization - only apply will-change on hover
        willChange: isHovered ? 'transform, opacity' : 'auto',
        transform: 'translateZ(0)', // Force GPU layer
        backfaceVisibility: 'hidden', // Prevent flicker
      }}
    >
      {/* Outer Pulse Ring (animated only when in viewport) */}
      <div
        className={cn(
          sizes.pulse,
          colors.pulse,
          'absolute rounded-full',
          shouldAnimate && isInViewport ? 'animate-marker-pulse' : 'opacity-0'
        )}
        aria-hidden="true"
      />

      {/* Middle Glow Ring */}
      <div
        className={cn(
          sizes.glow,
          colors.outer,
          'absolute rounded-full opacity-60 blur-sm',
          colors.glow,
          // Enhanced shadow: dark shadow + white ring + glow
          'shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(255,255,255,0.2),0_0_20px_var(--glow-color)]'
        )}
        style={
          {
            '--glow-color': getGlowColor(status),
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      {/* Inner Circle (core marker) */}
      <div
        className={cn(
          sizes.inner,
          colors.inner,
          'relative z-10 flex items-center justify-center rounded-full',
          'shadow-md transition-all duration-150 ease-out',
          'hover:z-20 hover:scale-110',
          'active:scale-95'
        )}
      >
        {/* Icon or Count */}
        {count !== undefined && count > 0 ? (
          <span className={cn('font-bold text-white', sizes.text)}>{count}</span>
        ) : (
          <Flame className={cn(sizes.icon, 'text-white')} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

/**
 * Get CSS color value for glow effect
 */
function getGlowColor(status: POSStatus): string {
  const colors = {
    healthy: 'rgba(16, 185, 129, 0.5)', // emerald-500
    warning: 'rgba(245, 158, 11, 0.5)', // orange-500
    critical: 'rgba(239, 68, 68, 0.5)', // red-500
  };
  return colors[status];
}

/**
 * Marker content for static variant
 */
function StaticMarker({
  status,
  sizes,
  count,
  className,
  shouldAnimate,
  isInViewport,
}: Omit<MarkerContentProps, 'onClick'>) {
  const colors = STATUS_COLORS[status];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{
        transform: 'translateZ(0)', // Force GPU layer
        backfaceVisibility: 'hidden', // Prevent flicker
      }}
    >
      {/* Outer Pulse Ring (animated only when in viewport) */}
      <div
        className={cn(
          sizes.pulse,
          colors.pulse,
          'absolute rounded-full',
          shouldAnimate && isInViewport ? 'animate-marker-pulse' : 'opacity-0'
        )}
        aria-hidden="true"
      />

      {/* Middle Glow Ring */}
      <div
        className={cn(
          sizes.glow,
          colors.outer,
          'absolute rounded-full opacity-60 blur-sm',
          colors.glow,
          // Enhanced shadow: dark shadow + white ring + glow
          'shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_2px_rgba(255,255,255,0.2),0_0_20px_var(--glow-color)]'
        )}
        style={
          {
            '--glow-color': getGlowColor(status),
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      {/* Inner Circle (core marker) */}
      <div
        className={cn(
          sizes.inner,
          colors.inner,
          'relative z-10 flex items-center justify-center rounded-full',
          'shadow-md'
        )}
      >
        {/* Icon or Count */}
        {count !== undefined && count > 0 ? (
          <span className={cn('font-bold text-white', sizes.text)}>{count}</span>
        ) : (
          <Flame className={cn(sizes.icon, 'text-white')} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

/**
 * AnimatedPOSMarker Component
 */
export function AnimatedPOSMarker({
  status,
  size = 'md',
  count,
  onClick,
  className,
  enableFpsMonitor = false,
}: AnimatedPOSMarkerProps) {
  const sizes = SIZE_CONFIG[size];
  const prefersReducedMotion = useReducedMotion();
  const [animationReady, setAnimationReady] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true); // Default true for initial render
  const markerRef = useRef<HTMLDivElement>(null);

  // Lazy animation initialization - prevent initial render jank
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Viewport detection with IntersectionObserver
  useEffect(() => {
    if (!markerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '50px', // Start animating slightly before entering viewport
      }
    );

    observer.observe(markerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // FPS monitoring (dev only)
  useEffect(() => {
    if (!enableFpsMonitor || process.env.NODE_ENV === 'production') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`[AnimatedPOSMarker FPS]: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [enableFpsMonitor]);

  // Determine if animations should run
  const shouldAnimate = !prefersReducedMotion && animationReady;

  if (onClick) {
    return (
      <div ref={markerRef}>
        <InteractiveMarker
          status={status}
          sizes={sizes}
          count={count}
          onClick={onClick}
          className={className}
          shouldAnimate={shouldAnimate}
          isInViewport={isInViewport}
        />
      </div>
    );
  }

  return (
    <div ref={markerRef}>
      <StaticMarker
        status={status}
        sizes={sizes}
        count={count}
        className={className}
        shouldAnimate={shouldAnimate}
        isInViewport={isInViewport}
      />
    </div>
  );
}
