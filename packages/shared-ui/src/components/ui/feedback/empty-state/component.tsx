'use client';

import type * as React from 'react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../actions/button';

/**
 * Empty State Component
 *
 * A comprehensive animated empty state component for displaying when there's no data,
 * featuring beautiful SVG SMIL animations for various scenarios.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="chart"
 *   title="No data available"
 *   description="Start by adding some data to see the chart"
 *   action={{ label: "Add Data", onClick: () => {} }}
 * />
 * ```
 */

export type EmptyStateVariant =
  | 'chart'
  | 'table'
  | 'list'
  | 'search'
  | 'error'
  | 'permission'
  | 'coming-soon'
  | '401'
  | '403'
  | '404'
  | '500'
  | '503';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of empty state to display
   * @default "chart"
   */
  variant?: EmptyStateVariant;
  /**
   * Custom title text
   */
  title?: string;
  /**
   * Custom description text
   */
  description?: string;
  /**
   * Optional action button
   */
  action?: EmptyStateAction;
  /**
   * Size of the component
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';
  /**
   * Whether to show the icon/illustration
   * @default true
   */
  showIcon?: boolean;
}

const sizeConfig = {
  sm: {
    iconSize: 48,
    iconContainer: 'h-16 w-24',
    titleSize: 'text-sm font-medium',
    descSize: 'text-xs',
    gap: 'gap-0',
    buttonSize: 'sm' as const,
  },
  default: {
    iconSize: 64,
    iconContainer: 'h-24 w-32',
    titleSize: 'text-base font-medium',
    descSize: 'text-sm',
    gap: 'gap-0',
    buttonSize: 'default' as const,
  },
  lg: {
    iconSize: 80,
    iconContainer: 'h-32 w-40',
    titleSize: 'text-lg font-semibold',
    descSize: 'text-base',
    gap: 'gap-0',
    buttonSize: 'lg' as const,
  },
  xl: {
    iconSize: 96,
    iconContainer: 'h-40 w-48',
    titleSize: 'text-xl font-semibold',
    descSize: 'text-lg',
    gap: 'gap-2',
    buttonSize: 'lg' as const,
  },
};

const defaultContent: Record<EmptyStateVariant, { title: string; description: string }> = {
  chart: {
    title: 'No data to display',
    description: 'There is no data available for this chart',
  },
  table: {
    title: 'No records found',
    description: 'There are no records matching your criteria',
  },
  list: {
    title: 'Nothing here yet',
    description: 'Start by adding your first item',
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search or filters',
  },
  error: {
    title: 'Something went wrong',
    description: 'An error occurred while loading the data',
  },
  permission: {
    title: 'Access restricted',
    description: 'You do not have permission to view this content',
  },
  'coming-soon': {
    title: 'Coming soon',
    description: 'This feature is under development',
  },
  '401': {
    title: 'Unauthorized',
    description: 'You need to sign in to access this page',
  },
  '403': {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource',
  },
  '404': {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
  },
  '500': {
    title: 'Server Error',
    description: 'Something went wrong on our end. Please try again later',
  },
  '503': {
    title: 'Service Unavailable',
    description: 'The service is temporarily unavailable for maintenance',
  },
};

export function EmptyState({
  className,
  variant = 'chart',
  title,
  description,
  action,
  size = 'default',
  showIcon = true,
  ...props
}: EmptyStateProps) {
  const config = sizeConfig[size];
  const content = defaultContent[variant];

  const displayTitle = title ?? content.title;
  const displayDescription = description ?? content.description;

  const IllustrationComponent = {
    chart: ChartIllustration,
    table: TableIllustration,
    list: ListIllustration,
    search: SearchIllustration,
    error: ErrorIllustration,
    permission: PermissionIllustration,
    'coming-soon': ComingSoonIllustration,
    '401': UnauthorizedIllustration,
    '403': ForbiddenIllustration,
    '404': NotFoundIllustration,
    '500': ServerErrorIllustration,
    '503': MaintenanceIllustration,
  }[variant];

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', config.gap, className)}
      {...props}
    >
      {showIcon && (
        <div className={cn('flex items-center justify-center', config.iconContainer)}>
          <IllustrationComponent size={config.iconSize} />
        </div>
      )}

      <div className={cn('flex flex-col items-center', config.gap)}>
        <h3 className={cn('text-foreground', config.titleSize)}>{displayTitle}</h3>
        <p className={cn('max-w-sm text-muted-foreground', config.descSize)}>
          {displayDescription}
        </p>
      </div>

      {action && (
        <Button
          variant={action.variant ?? 'default'}
          size={config.buttonSize}
          onClick={action.onClick}
          className="mt-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface IllustrationProps {
  size: number;
}

/**
 * Chart Illustration - Animated flat line with data points
 */
function ChartIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 96 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--muted-foreground)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[16, 32, 48].map((y) => (
        <line
          key={y}
          x1="8"
          y1={y}
          x2="88"
          y2={y}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.5"
        />
      ))}

      {/* Animated wave line */}
      <g>
        <path
          d="M8,36 Q24,32 48,36 T88,32"
          fill="none"
          stroke="url(#chart-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M8,36 Q24,32 48,36 T88,32;
                    M8,32 Q24,38 48,32 T88,38;
                    M8,36 Q24,32 48,36 T88,32"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Data points with synchronized animation */}
      {[
        { cx: 24, cyValues: '32;38;32' },
        { cx: 48, cyValues: '36;32;36' },
        { cx: 72, cyValues: '36;32;36' },
      ].map((point, i) => (
        <g key={i}>
          {/* Pulse ring */}
          <circle cx={point.cx} cy={32} r="4" fill="none" stroke="var(--primary)">
            <animate attributeName="cy" values={point.cyValues} dur="4s" repeatCount="indefinite" />
            <animate
              attributeName="r"
              values="4;10;4"
              dur="2.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Main dot */}
          <circle cx={point.cx} cy={32} r="5" fill="var(--primary)" opacity="0.7">
            <animate attributeName="cy" values={point.cyValues} dur="4s" repeatCount="indefinite" />
            <animate
              attributeName="r"
              values="5;6;5"
              dur="2.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}

/**
 * Table Illustration - Animated skeleton rows
 */
function TableIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 96 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--muted)" stopOpacity="0.3">
            <animate attributeName="offset" values="-1;2" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="var(--muted-foreground)" stopOpacity="0.2">
            <animate attributeName="offset" values="-0.5;2.5" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="var(--muted)" stopOpacity="0.3">
            <animate attributeName="offset" values="0;3" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      {/* Header row */}
      <rect x="8" y="8" width="80" height="10" rx="2" fill="var(--muted)" opacity="0.5" />

      {/* Table rows with staggered animation */}
      {[24, 38, 52].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="80" height="8" rx="2" fill="url(#shimmer-gradient)" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              keyTimes="0;0.2;0.8;1"
              dur="3s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </rect>
          {/* Cell dividers */}
          <line
            x1="36"
            y1={y}
            x2="36"
            y2={y + 8}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="64"
            y1={y}
            x2="64"
            y2={y + 8}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>
      ))}

      {/* Border frame */}
      <rect
        x="8"
        y="8"
        width="80"
        height="52"
        rx="4"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * List Illustration - Animated list items
 */
function ListIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 96 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      {/* List items with bullet points */}
      {[12, 28, 44].map((y, i) => (
        <g key={i}>
          {/* Bullet point */}
          <circle cx="16" cy={y + 4} r="3" fill="var(--muted-foreground)" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.6;0.6;0"
              keyTimes="0;0.15;0.85;1"
              dur="2.5s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="0;3;3;0"
              keyTimes="0;0.15;0.85;1"
              dur="2.5s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>

          {/* Text line (varying widths) */}
          <rect
            x="26"
            y={y}
            width={[56, 48, 40][i]}
            height="8"
            rx="2"
            fill="var(--muted)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0.5;0"
              keyTimes="0;0.15;0.85;1"
              dur="2.5s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x"
              values="16;26;26;16"
              keyTimes="0;0.15;0.85;1"
              dur="2.5s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}
    </svg>
  );
}

/**
 * Search Illustration - Magnifying glass with scanning effect
 */
function SearchIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="scan-line" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lens-clip">
          <circle cx="26" cy="26" r="14" />
        </clipPath>
      </defs>

      {/* Magnifying glass body */}
      <circle
        cx="26"
        cy="26"
        r="14"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="3"
        opacity="0.5"
      />

      {/* Scanning line inside lens */}
      <g clipPath="url(#lens-clip)">
        <rect x="12" y="12" width="28" height="4" fill="url(#scan-line)">
          <animate attributeName="y" values="12;38;12" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Handle */}
      <line
        x1="36"
        y1="36"
        x2="50"
        y2="50"
        stroke="var(--muted-foreground)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Pulse effect */}
      <circle
        cx="26"
        cy="26"
        r="14"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0"
      >
        <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Question marks floating */}
      <text x="42" y="16" fontSize="10" fill="var(--muted-foreground)" opacity="0">
        ?
        <animate
          attributeName="opacity"
          values="0;0.5;0"
          dur="3s"
          begin="0s"
          repeatCount="indefinite"
        />
        <animate attributeName="y" values="16;10;16" dur="3s" begin="0s" repeatCount="indefinite" />
      </text>
    </svg>
  );
}

/**
 * Error Illustration - Warning triangle with pulse
 */
function ErrorIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="error-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--destructive)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--destructive)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Warning triangle */}
      <path
        d="M32 8 L56 52 L8 52 Z"
        fill="none"
        stroke="url(#error-gradient)"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <animate attributeName="stroke-width" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* Exclamation mark */}
      <g>
        <line
          x1="32"
          y1="24"
          x2="32"
          y2="36"
          stroke="var(--destructive)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </line>
        <circle cx="32" cy="44" r="2" fill="var(--destructive)">
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Pulse rings */}
      <path
        d="M32 8 L56 52 L8 52 Z"
        fill="none"
        stroke="var(--destructive)"
        strokeWidth="1"
        opacity="0"
      >
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.15;1"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;-4.8,-2.4;0,0"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
      </path>
    </svg>
  );
}

/**
 * Permission Illustration - Lock with shield
 */
function PermissionIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="shield-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Shield background */}
      <path
        d="M32 4 L52 14 L52 32 Q52 50 32 60 Q12 50 12 32 L12 14 Z"
        fill="url(#shield-gradient)"
        stroke="var(--muted-foreground)"
        strokeWidth="2"
        opacity="0.5"
      >
        <animate attributeName="opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Lock body */}
      <rect
        x="22"
        y="28"
        width="20"
        height="16"
        rx="3"
        fill="var(--muted-foreground)"
        opacity="0.6"
      />

      {/* Lock shackle */}
      <path
        d="M26 28 L26 22 Q26 16 32 16 Q38 16 38 22 L38 28"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Keyhole */}
      <circle cx="32" cy="34" r="2.5" fill="var(--background)">
        <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="31" y="35" width="2" height="4" rx="1" fill="var(--background)" />

      {/* Pulse effect on shield */}
      <path
        d="M32 4 L52 14 L52 32 Q52 50 32 60 Q12 50 12 32 L12 14 Z"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1"
        opacity="0"
      >
        <animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.08;1"
          dur="2.5s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;-2.56,-2.56;0,0"
          dur="2.5s"
          repeatCount="indefinite"
          additive="sum"
        />
      </path>
    </svg>
  );
}

/**
 * Coming Soon Illustration - Rocket with stars
 */
function ComingSoonIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="rocket-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="exhaust-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rocket body */}
      <g>
        <path
          d="M32 8 Q40 16 40 28 L40 40 L32 48 L24 40 L24 28 Q24 16 32 8 Z"
          fill="url(#rocket-gradient)"
          stroke="var(--primary)"
          strokeWidth="1.5"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-3;0,0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Rocket window */}
        <circle
          cx="32"
          cy="24"
          r="4"
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-3;0,0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Fins */}
        <path d="M24 32 L18 42 L24 40 Z" fill="var(--primary)" opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-3;0,0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M40 32 L46 42 L40 40 Z" fill="var(--primary)" opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-3;0,0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Exhaust flames */}
      <g>
        <ellipse cx="32" cy="52" rx="4" ry="6" fill="url(#exhaust-gradient)">
          <animate attributeName="ry" values="6;10;6" dur="0.3s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.8;0.4;0.8"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* Twinkling stars */}
      {[
        { x: 12, y: 12, delay: '0s' },
        { x: 52, y: 20, delay: '0.5s' },
        { x: 8, y: 40, delay: '1s' },
        { x: 56, y: 48, delay: '1.5s' },
        { x: 16, y: 56, delay: '0.7s' },
      ].map((star, i) => (
        <g key={i}>
          {/* Star shape */}
          <path
            d={`M${star.x} ${star.y - 3} L${star.x + 1} ${star.y - 1} L${star.x + 3} ${star.y} L${star.x + 1} ${star.y + 1} L${star.x} ${star.y + 3} L${star.x - 1} ${star.y + 1} L${star.x - 3} ${star.y} L${star.x - 1} ${star.y - 1} Z`}
            fill="var(--primary)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="2s"
              begin={star.delay}
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.5;1;0.5"
              dur="2s"
              begin={star.delay}
              repeatCount="indefinite"
              additive="sum"
            />
          </path>
        </g>
      ))}
    </svg>
  );
}

/**
 * Unauthorized (401) Illustration - Key with lock
 */
function UnauthorizedIllustration({ size }: IllustrationProps) {
  const scale = size / 40;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="key-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Key body */}
      <g>
        {/* Key head (circle) */}
        <circle cx="22" cy="20" r="10" fill="none" stroke="url(#key-gradient)" strokeWidth="3">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Key hole in head */}
        <circle cx="22" cy="20" r="4" fill="var(--muted)" opacity="0.5" />

        {/* Key shaft */}
        <rect x="30" y="18" width="24" height="4" rx="2" fill="url(#key-gradient)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </rect>

        {/* Key teeth */}
        <rect x="44" y="22" width="4" height="6" rx="1" fill="url(#key-gradient)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="50" y="22" width="4" height="8" rx="1" fill="url(#key-gradient)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Pulse effect */}
      <circle
        cx="22"
        cy="20"
        r="10"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1"
        opacity="0"
      >
        <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/**
 * Forbidden (403) Illustration - Shield with X
 */
function ForbiddenIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="forbidden-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--destructive)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--destructive)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Shield */}
      <path
        d="M32 4 L52 12 L52 28 Q52 48 32 58 Q12 48 12 28 L12 12 Z"
        fill="url(#forbidden-gradient)"
        stroke="var(--destructive)"
        strokeWidth="2"
        opacity="0.7"
      >
        <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite" />
      </path>

      {/* X mark */}
      <g>
        <line
          x1="24"
          y1="22"
          x2="40"
          y2="38"
          stroke="var(--destructive)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line
          x1="40"
          y1="22"
          x2="24"
          y2="38"
          stroke="var(--destructive)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Pulse effect */}
      <path
        d="M32 4 L52 12 L52 28 Q52 48 32 58 Q12 48 12 28 L12 12 Z"
        fill="none"
        stroke="var(--destructive)"
        strokeWidth="1"
        opacity="0"
      >
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.1;1"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;-3.2,-3.2;0,0"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
      </path>
    </svg>
  );
}

/**
 * Not Found (404) Illustration - Magnifying glass with question mark
 */
function NotFoundIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="notfound-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Magnifying glass */}
      <circle cx="26" cy="26" r="16" fill="none" stroke="url(#notfound-gradient)" strokeWidth="3">
        <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Handle */}
      <line
        x1="38"
        y1="38"
        x2="54"
        y2="54"
        stroke="var(--muted-foreground)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Question mark inside */}
      <g>
        <path
          d="M22 20 Q22 14 26 14 Q32 14 32 20 Q32 24 26 26"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="26" cy="33" r="2" fill="var(--primary)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Floating particles */}
      {[
        { x: 8, y: 10, delay: '0s' },
        { x: 50, y: 8, delay: '0.5s' },
        { x: 56, y: 30, delay: '1s' },
      ].map((particle, i) => (
        <circle
          key={i}
          cx={particle.x}
          cy={particle.y}
          r="2"
          fill="var(--muted-foreground)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.5;0"
            dur="2.5s"
            begin={particle.delay}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${particle.y};${particle.y - 5};${particle.y}`}
            dur="2.5s"
            begin={particle.delay}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

/**
 * Server Error (500) Illustration - Server with warning
 */
function ServerErrorIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="server-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Server rack */}
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="4"
        fill="url(#server-gradient)"
        stroke="var(--muted-foreground)"
        strokeWidth="1.5"
      />

      {/* Server slots */}
      {[16, 30, 44].map((y, i) => (
        <g key={i}>
          <rect x="16" y={y} width="32" height="8" rx="2" fill="var(--muted)" opacity="0.5" />
          {/* LED lights */}
          <circle
            cx="22"
            cy={y + 4}
            r="2"
            fill={i === 1 ? 'var(--destructive)' : 'var(--muted-foreground)'}
            opacity={i === 1 ? 0.8 : 0.3}
          >
            {i === 1 && (
              <animate
                attributeName="opacity"
                values="0.8;0.3;0.8"
                dur="0.8s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <rect
            x="30"
            y={y + 2}
            width="14"
            height="4"
            rx="1"
            fill="var(--muted-foreground)"
            opacity="0.2"
          />
        </g>
      ))}

      {/* Warning overlay */}
      <g transform="translate(38, 2)">
        <path d="M12 0 L24 20 L0 20 Z" fill="var(--destructive)" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1s" repeatCount="indefinite" />
        </path>
        <text x="12" y="15" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">
          !
        </text>
      </g>

      {/* Pulse ring around server */}
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="4"
        fill="none"
        stroke="var(--destructive)"
        strokeWidth="1"
        opacity="0"
      >
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.05;1"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;-1,-1.4;0,0"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
      </rect>
    </svg>
  );
}

/**
 * Maintenance (503) Illustration - Wrench and gear
 */
function MaintenanceIllustration({ size }: IllustrationProps) {
  const scale = size / 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <defs>
        <linearGradient id="gear-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Large gear */}
      <g transform="translate(36, 36)">
        <path
          d="M0,-16 L4,-14 L6,-18 L10,-16 L8,-12 L12,-8 L16,-10 L18,-6 L14,-4 L16,0 L14,4 L18,6 L16,10 L12,8 L8,12 L10,16 L6,18 L4,14 L0,16 L-4,14 L-6,18 L-10,16 L-8,12 L-12,8 L-16,10 L-18,6 L-14,4 L-16,0 L-14,-4 L-18,-6 L-16,-10 L-12,-8 L-8,-12 L-10,-16 L-6,-18 L-4,-14 Z"
          fill="url(#gear-gradient)"
          stroke="var(--muted-foreground)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0;360"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        <circle
          cx="0"
          cy="0"
          r="6"
          fill="var(--background)"
          stroke="var(--muted-foreground)"
          strokeWidth="1"
        />
      </g>

      {/* Wrench */}
      <g transform="translate(8, 8)">
        {/* Wrench head */}
        <path
          d="M6,0 L14,0 L16,4 L14,8 L12,8 L12,6 L8,6 L8,8 L6,8 L4,4 Z"
          fill="var(--primary)"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Wrench shaft */}
        <rect x="8" y="8" width="4" height="20" rx="1" fill="var(--primary)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Wrench bottom head */}
        <path d="M6,28 L14,28 L16,32 L14,36 L6,36 L4,32 Z" fill="var(--primary)" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Sparkles */}
      {[
        { x: 50, y: 10, delay: '0s' },
        { x: 58, y: 50, delay: '1s' },
        { x: 4, y: 52, delay: '0.5s' },
      ].map((spark, i) => (
        <g key={i}>
          <line
            x1={spark.x - 3}
            y1={spark.y}
            x2={spark.x + 3}
            y2={spark.y}
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="1.5s"
              begin={spark.delay}
              repeatCount="indefinite"
            />
          </line>
          <line
            x1={spark.x}
            y1={spark.y - 3}
            x2={spark.x}
            y2={spark.y + 3}
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="1.5s"
              begin={spark.delay}
              repeatCount="indefinite"
            />
          </line>
        </g>
      ))}
    </svg>
  );
}

export default EmptyState;
