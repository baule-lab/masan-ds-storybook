'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * ML Chart Loading Animation
 *
 * A sophisticated loading animation designed for ML/AI data processing scenarios
 * where loading times can be longer. Features animated chart bars with a neural
 * network-inspired pulse effect and processing status messages.
 *
 * @example
 * ```tsx
 * <MLChartLoading
 *   message="Analyzing data patterns..."
 *   variant="bars"
 *   showProgress
 * />
 * ```
 */

export interface MLChartLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The loading message to display
   * @default "Processing ML data..."
   */
  message?: string;
  /**
   * Array of status messages that rotate during loading
   */
  statusMessages?: string[];
  /**
   * Animation variant
   * @default "bars"
   */
  variant?: 'bars' | 'wave' | 'pulse' | 'neural';
  /**
   * Whether to show a progress indicator
   * @default false
   */
  showProgress?: boolean;
  /**
   * Size of the loading animation
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Custom height for the chart area
   */
  chartHeight?: string;
  /**
   * Whether to show the legend skeleton
   * @default true
   */
  showLegend?: boolean;
  /**
   * Whether to show the title skeleton
   * @default true
   */
  showTitle?: boolean;
  /**
   * Color scheme for the animation
   * @default "primary"
   */
  colorScheme?: 'primary' | 'chart' | 'gradient';
}

const defaultStatusMessages = [
  'Initializing ML model...',
  'Loading training data...',
  'Processing features...',
  'Running predictions...',
  'Optimizing results...',
  'Generating visualizations...',
];

const sizeConfig = {
  sm: {
    height: 'h-[180px]',
    barWidth: 'w-4',
    gap: 'gap-2',
    textSize: 'text-xs',
  },
  default: {
    height: 'h-[280px]',
    barWidth: 'w-6',
    gap: 'gap-3',
    textSize: 'text-sm',
  },
  lg: {
    height: 'h-[380px]',
    barWidth: 'w-8',
    gap: 'gap-4',
    textSize: 'text-base',
  },
};

export function MLChartLoading({
  className,
  message,
  statusMessages = defaultStatusMessages,
  variant = 'bars',
  showProgress = false,
  size = 'default',
  chartHeight,
  showLegend = true,
  showTitle = true,
  colorScheme = 'primary',
  ...props
}: MLChartLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  // Rotate through status messages
  React.useEffect(() => {
    if (!statusMessages.length) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [statusMessages.length]);

  // Animate progress
  React.useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 0;
        return prev + Math.random() * 15;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [showProgress]);

  const config = sizeConfig[size];
  const heightClass = chartHeight || config.height;

  const getColorClass = (index: number): string => {
    if (colorScheme === 'chart') {
      const chartColors = [
        'bg-chart-1',
        'bg-chart-2',
        'bg-chart-3',
        'bg-chart-4',
        'bg-chart-5',
        'bg-chart-6',
        'bg-chart-7',
        'bg-chart-8',
      ];
      return chartColors[index % chartColors.length] ?? 'bg-primary';
    }
    if (colorScheme === 'gradient') {
      return 'bg-gradient-to-t from-primary/40 to-primary';
    }
    return 'bg-primary';
  };

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Title Skeleton */}
      {showTitle && (
        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted/60" />
        </div>
      )}

      {/* Chart Area */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-border bg-card',
          heightClass
        )}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ml-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ml-grid)" />
          </svg>
        </div>

        {/* Animation Content */}
        <div className="relative flex h-full flex-col items-center justify-center p-6">
          {variant === 'bars' && <BarsAnimation config={config} getColorClass={getColorClass} />}
          {variant === 'wave' && <WaveAnimation colorScheme={colorScheme} />}
          {variant === 'pulse' && <PulseAnimation />}
          {variant === 'neural' && <NeuralAnimation />}

          {/* Status Message */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <p
              className={cn(
                'text-center text-muted-foreground transition-opacity duration-500',
                config.textSize
              )}
            >
              {message || statusMessages[currentMessageIndex]}
            </p>

            {/* Progress Bar */}
            {showProgress && (
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 size-2 animate-pulse rounded-full bg-primary/20" />
        <div className="absolute top-3 right-3 size-2 animate-pulse rounded-full bg-primary/20 [animation-delay:500ms]" />
        <div className="absolute bottom-3 left-3 size-2 animate-pulse rounded-full bg-primary/20 [animation-delay:1000ms]" />
        <div className="absolute right-3 bottom-3 size-2 animate-pulse rounded-full bg-primary/20 [animation-delay:1500ms]" />
      </div>

      {/* Legend Skeleton */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 border-border border-t pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="size-3 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Bars Animation - Animated bar chart with staggered heights
 */
function BarsAnimation({
  config,
  getColorClass,
}: {
  config: (typeof sizeConfig)['default'];
  getColorClass: (index: number) => string;
}) {
  const bars = 8;
  return (
    <div className={cn('flex items-end justify-center', config.gap, 'h-32')}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            config.barWidth,
            'rounded-t-md transition-all duration-1000 ease-in-out',
            getColorClass(i)
          )}
          style={{
            height: '20%',
            animation: 'ml-bar-bounce 1.5s ease-in-out infinite',
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
      <style>{`
        @keyframes ml-bar-bounce {
          0%, 100% {
            height: 20%;
            opacity: 0.4;
          }
          50% {
            height: ${70 + Math.random() * 30}%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Wave Animation - Smooth flowing sine wave pattern
 * Uses SVG SMIL animation for buttery smooth performance
 */
function WaveAnimation({ colorScheme }: { colorScheme: string }) {
  // Generate smooth sine wave path
  const generateWavePath = (amplitude: number, yOffset: number, phaseOffset = 0) => {
    const wavelength = 120; // pixels per wave cycle
    const width = 800; // double width for seamless loop
    const points: string[] = [];

    for (let x = -wavelength; x <= width + wavelength; x += 4) {
      const y = yOffset + amplitude * Math.sin(((x + phaseOffset) / wavelength) * 2 * Math.PI);
      points.push(`${x},${y.toFixed(2)}`);
    }

    return `M${points.join(' L')}`;
  };

  const wave1Path = generateWavePath(18, 50, 0);
  const wave2Path = generateWavePath(14, 50, 60);

  return (
    <div className="relative h-32 w-full overflow-hidden">
      <svg
        viewBox="0 0 400 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Primary wave */}
        <g>
          <path
            d={wave1Path}
            fill="none"
            stroke={colorScheme === 'gradient' ? 'url(#wave-gradient-1)' : 'var(--primary)'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-120 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Secondary wave - moves in OPPOSITE direction */}
        <g>
          <path
            d={wave2Path}
            fill="none"
            stroke={colorScheme === 'gradient' ? 'url(#wave-gradient-2)' : 'var(--primary)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-120 0"
              to="0 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

/**
 * Pulse Animation - Radiating circles from center
 */
function PulseAnimation() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      {/* Pulsing rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-primary"
          style={{
            width: '100%',
            height: '100%',
            animation: 'ml-pulse-ring 2s ease-out infinite',
            animationDelay: `${i * 400}ms`,
          }}
        />
      ))}
      {/* Center icon */}
      <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary/10">
        <svg
          className="size-6 animate-pulse text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <style>{`
        @keyframes ml-pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Neural Animation - Clean and minimal design
 * Compact nodes with subtle animations
 */
function NeuralAnimation() {
  // Simplified network: 3 input -> 3 hidden -> 2 output
  // Well-spaced positions within viewBox with padding
  const nodes = [
    // Input layer - x=25
    { x: 25, y: 20, layer: 0 },
    { x: 25, y: 50, layer: 0 },
    { x: 25, y: 80, layer: 0 },
    // Hidden layer - x=100 (center)
    { x: 100, y: 25, layer: 1 },
    { x: 100, y: 50, layer: 1 },
    { x: 100, y: 75, layer: 1 },
    // Output layer - x=175
    { x: 175, y: 37, layer: 2 },
    { x: 175, y: 63, layer: 2 },
  ];

  const connections: Array<[number, number]> = [
    // Input to hidden (selective for cleaner look)
    [0, 3],
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [2, 5],
    // Hidden to output
    [3, 6],
    [3, 7],
    [4, 6],
    [4, 7],
    [5, 6],
    [5, 7],
  ];

  return (
    <div className="flex w-full items-center justify-center">
      <svg
        viewBox="0 0 200 100"
        className="h-auto w-full max-w-[280px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Simple gradient for nodes */}
          <radialGradient id="node-grad" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.7" />
          </radialGradient>

          {/* Subtle glow for nodes */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map(([from, to], i) => {
          const fromNode = nodes[from];
          const toNode = nodes[to];
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`conn-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="var(--primary)"
              strokeWidth="1"
              opacity="0.2"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.35;0.15"
                dur="3s"
                begin={`${i * 0.15}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Nodes - all same size, synced animations */}
        {nodes.map((node, i) => {
          const nodeSize = 6; // All nodes same size

          return (
            <g key={`node-${i}`}>
              {/* Pulse ring - all synced at 0s */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeSize}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="0.5"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values={`${nodeSize};${nodeSize + 8};${nodeSize}`}
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.35;0;0.35"
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Main node - subtle breathing */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeSize}
                fill="url(#node-grad)"
                filter="url(#node-glow)"
              >
                <animate
                  attributeName="r"
                  values={`${nodeSize};${nodeSize + 0.8};${nodeSize}`}
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Highlight dot - centered */}
              <circle cx={node.x} cy={node.y} r="1.2" fill="var(--background)" opacity="0.4" />
            </g>
          );
        })}

        {/* Data flow particles - paths match node positions */}
        {[0, 1, 2].map((particleIdx) => {
          // Node positions: Input(25), Hidden(100), Output(175)
          // Top: 20 → 25 → 37
          // Middle: 50 → 50 → 37 (connects to top output)
          // Bottom: 80 → 75 → 63
          const paths = [
            // Top path: input(25,20) → hidden(100,25) → output(175,37)
            'M25,20 L100,25 L175,37',
            // Middle path: input(25,50) → hidden(100,50) → output(175,63)
            'M25,50 L100,50 L175,63',
            // Bottom path: input(25,80) → hidden(100,75) → output(175,63)
            'M25,80 L100,75 L175,63',
          ];

          const path = paths[particleIdx] || paths[0];
          const delay = particleIdx * 0.7;
          const duration = 2;

          return (
            <circle
              key={`particle-${particleIdx}`}
              r="2.5"
              fill="var(--primary)"
              filter="url(#particle-glow)"
              opacity="0"
            >
              <animateMotion
                path={path}
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.05;0.9;1"
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

export default MLChartLoading;
