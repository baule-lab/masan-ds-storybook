export interface CallbackOptions<TData = unknown, TError = unknown> {
  cbSuccess?: (data?: TData) => void;
  cbError?: (err: TError) => void;
  cbSettled?: () => void;
  enabled?: boolean;
  staleTime?: number;
}
