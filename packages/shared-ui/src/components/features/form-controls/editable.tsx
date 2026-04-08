import { Input } from '../../ui/forms/input';
import { Check, Plus, X } from 'lucide-react';
import { type ReactNode, useState, useEffect } from 'react';

export interface EditableProps {
  /** The wrapped component (e.g., Select) */
  children: ReactNode;
  /** Callback when new value is added */
  onAdd: (value: string) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Disable add functionality */
  disabled?: boolean;
  /** Custom add icon */
  addIcon?: ReactNode;
  /** Custom class for the input */
  inputClassName?: string;
  /** Custom class for the container */
  className?: string;
  /** Default value */
  defaultValue?: string;
}

export const Editable = ({
  children,
  defaultValue,
  onAdd,
  placeholder = 'Enter new value...',
  disabled = false,
  addIcon,
  inputClassName,
  className,
}: EditableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');

  useEffect(() => {
    setInputValue(defaultValue || '');
  }, [defaultValue]);

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
    }
    setInputValue('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(defaultValue || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={className}>
        <Input
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClassName}
          suffixIcon={
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="rounded p-0.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                aria-label="Confirm"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded p-0.5 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/30"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <div className="flex-1">{children}</div>
      {!disabled && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Add new option"
        >
          {addIcon ?? <Plus className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};
