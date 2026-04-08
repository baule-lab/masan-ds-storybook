export const UOM = {
  CASE: 'case',
  VND: 'vnd',
} as const;

export type UOM = (typeof UOM)[keyof typeof UOM];

export const UOM_MML = {
  PACK: 'pack',
} as const;

export type UOM_MML = (typeof UOM_MML)[keyof typeof UOM_MML];
