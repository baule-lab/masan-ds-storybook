import { Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '../../ui/feedback/empty-state';

interface AsyncWrapperProps {
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyText?: string;
  loadingText?: string;
  errorText?: string;
  hideEmpty?: boolean;
  hideError?: boolean;
  children: ReactNode;
}

export const DefaultLoadingComponent = ({ loadingText }: { loadingText?: string }) => (
  <div className="flex items-center justify-center gap-2 py-6 text-sm">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="text-muted-foreground">{loadingText ?? 'Loading...'} </span>
  </div>
);

export const DefaultEmptyComponent = ({ emptyText }: { emptyText?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-6">
    <Inbox className="h-8 w-8 text-muted-foreground" />
    <span className="text-muted-foreground">{emptyText ?? 'No results.'}</span>
  </div>
);

export const DefaultErrorComponent = ({ errorText }: { errorText?: string }) => (
  <EmptyState variant="error" description={errorText} />
);

export function AsyncWrapper({
  loading = false,
  empty = false,
  error = false,
  loadingComponent,
  emptyComponent,
  errorComponent,
  emptyText,
  loadingText,
  errorText,
  hideEmpty = false,
  hideError = false,
  children,
}: AsyncWrapperProps) {
  // 1. Loading - highest priority
  if (loading) {
    return loadingComponent ?? <DefaultLoadingComponent loadingText={loadingText} />;
  }

  // 2. Error - second priority (after loading complete)
  if (error) {
    if (hideError) return null;
    return errorComponent ?? <DefaultErrorComponent errorText={errorText} />;
  }

  // 3. Empty - third priority
  if (empty) {
    if (hideEmpty) return null;
    return emptyComponent ?? <DefaultEmptyComponent emptyText={emptyText} />;
  }

  // 4. Children - default
  return children;
}
