import { Cross2Icon } from '@radix-ui/react-icons';
import { type Dispatch, type SetStateAction, forwardRef, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../ui/forms/input';
import { Badge } from '../../ui/display/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/overlays/tooltip';
import { LongText } from '../long-text';

type InputTagsProps = {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  /**
   * Maximum number of tags to display before showing "+N more".
   * If not provided, all tags are shown.
   */
  maxCount?: number;
  /**
   * Maximum width for tag label before truncation
   * @default '120px'
   */
  tagLabelMaxWidth?: string;
  /**
   * Max height for wrapped tags container before enabling vertical scroll
   * @default '160px'
   */
  maxContainerHeight?: string;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'>;

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  (
    {
      value,
      onChange,
      className,
      maxCount,
      tagLabelMaxWidth = '120px',
      maxContainerHeight = '160px',
      placeholder,
      ...props
    },
    ref
  ) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const assignRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const normalizeTag = (tag: string) => tag.trim().replace(/\s+/g, ' ');

    const addTags = (candidateTags: string[]) => {
      if (candidateTags.length === 0) return;
      const existingTags = new Set(value);
      const nextValue = [...value];

      for (const candidate of candidateTags) {
        const normalized = normalizeTag(candidate);
        if (!normalized || existingTags.has(normalized)) continue;
        existingTags.add(normalized);
        nextValue.push(normalized);
      }

      if (nextValue.length !== value.length) {
        onChange(nextValue);
      }
    };

    const addPendingDataPoint = (shouldRefocus = true) => {
      if (!pendingDataPoint) return;
      addTags([pendingDataPoint]);
      setPendingDataPoint('');
      if (shouldRefocus) {
        inputRef.current?.focus();
      }
    };

    const visibleTags = typeof maxCount === 'number' ? value.slice(0, maxCount) : value;
    const hiddenTagCount = typeof maxCount === 'number' ? Math.max(0, value.length - maxCount) : 0;
    const hiddenTags =
      typeof maxCount === 'number' && hiddenTagCount > 0 ? value.slice(maxCount) : [];

    const clearExtraTags = () => {
      if (typeof maxCount !== 'number' || hiddenTagCount === 0) return;
      onChange(value.slice(0, maxCount));
      inputRef.current?.focus();
    };

    const removeTag = (tag: string) => {
      onChange(value.filter((item) => item !== tag));
      inputRef.current?.focus();
    };

    return (
      <TooltipProvider>
        <div
          className={cn(
            'w-full rounded-md border border-input bg-transparent px-2 py-1',
            'text-base shadow-xs transition-[color,box-shadow]',
            'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
            'md:text-sm',
            className
          )}
        >
          <div
            className="flex max-h-full w-full flex-wrap items-center gap-1 overflow-y-auto"
            style={{ maxHeight: maxContainerHeight }}
          >
            {visibleTags.map((item) => (
              <Badge
                key={item}
                className={cn(
                  'h-6 shrink-0 whitespace-nowrap rounded-sm',
                  'bg-primary text-primary-foreground',
                  'flex items-center gap-1 px-2 py-0',
                  'border-primary/20 hover:bg-primary/90',
                  'text-xs'
                )}
              >
                <LongText maxWidth={tagLabelMaxWidth} className="leading-normal">
                  {item}
                </LongText>
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/70 dark:hover:bg-black/20"
                  onClick={() => removeTag(item)}
                >
                  <Cross2Icon className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {hiddenTagCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className={cn(
                      'h-6 shrink-0 whitespace-nowrap rounded-sm',
                      'bg-primary/80 text-primary-foreground',
                      'flex items-center gap-1 px-2 py-0',
                      'border-primary/20 hover:bg-primary/90',
                      'text-xs'
                    )}
                  >
                    +{hiddenTagCount} more
                    <button
                      type="button"
                      aria-label={`Clear ${hiddenTagCount} extra tags`}
                      className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/70 dark:hover:bg-black/20"
                      onClick={clearExtraTags}
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </Badge>
                </TooltipTrigger>

                {hiddenTags.length > 0 && (
                  <TooltipContent sideOffset={4} className="max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {hiddenTags.map((item) => (
                        <Badge
                          key={item}
                          className={cn(
                            'h-6 shrink-0 whitespace-nowrap rounded-sm',
                            'bg-primary/80 text-primary-foreground',
                            'flex items-center gap-1 px-2 py-0',
                            'border-primary/20 hover:bg-primary/90',
                            'text-xs'
                          )}
                        >
                          <LongText maxWidth={tagLabelMaxWidth} className="leading-normal">
                            {item}
                          </LongText>
                          <button
                            type="button"
                            aria-label={`Remove ${item}`}
                            className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-sm hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/70 dark:hover:bg-black/20"
                            onClick={() => removeTag(item)}
                          >
                            <Cross2Icon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            )}

            <Input
              value={pendingDataPoint}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addPendingDataPoint();
                  return;
                }

                if (e.key === 'Backspace' && pendingDataPoint.length === 0 && value.length > 0) {
                  e.preventDefault();
                  onChange(value.slice(0, -1));
                }
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('text');
                if (!/[,\n;]/.test(pastedText)) return;
                e.preventDefault();
                addTags(pastedText.split(/[,\n;]+/g));
              }}
              onBlur={() => addPendingDataPoint(false)}
              placeholder={value.length === 0 ? placeholder : ''}
              className="h-7 min-h-0 min-w-[120px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
              {...props}
              ref={assignRefs}
            />
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

InputTags.displayName = 'InputTags';
