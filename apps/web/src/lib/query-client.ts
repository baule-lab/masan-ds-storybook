import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client with sensible defaults for the boilerplate app
 */
export const queryClient = new QueryClient({
  defaultOptions: {},
});
