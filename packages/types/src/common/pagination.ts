// Alternative: If your API uses different property names for data
export type ApiPaginationResponseWithDynamicKey<T = unknown, K extends string = 'data'> = {
  [P in K]: T[];
} & {
  offset: number;
  limit: number;
  total_count: number;
  total_pages: number;
};
