import { type ComponentProps, type MouseEvent, type ReactNode, useState } from 'react';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '../../ui/actions/button';

type ButtonProps = ComponentProps<typeof Button>;

interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick' | 'type'> {
  value: string;
  disabled?: boolean;
  iconSize?: number;
  children?: (props: {
    copied: boolean;
    iconSize: number;
    onClick: ButtonProps['onClick'];
  }) => ReactNode;
  onClick?: ButtonProps['onClick'];
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return;
  }

  throw new Error('Clipboard API is not available.');
}

export function CopyButton({
  value,
  disabled,
  iconSize = 16,
  children,
  onClick,
  ...buttonProps
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    try {
      await copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard', error);
    }
  };

  if (typeof children === 'function') {
    return children({ copied, iconSize, onClick: handleClick as ButtonProps['onClick'] });
  }

  if (!value) return null;

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      variant="ghost"
      size="xs"
      {...buttonProps}
    >
      {copied ? (
        <CopyCheckIcon className="text-green-600 dark:text-green-400" size={iconSize} />
      ) : (
        <CopyIcon size={iconSize} />
      )}
    </Button>
  );
}
