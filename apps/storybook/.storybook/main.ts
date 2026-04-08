import type { StorybookConfig } from '@storybook/react-vite';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const sharedUiSrcPath = fileURLToPath(new URL('../../../packages/shared-ui/src/', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-onboarding'),
    '@storybook/addon-designs',
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    const existingAliases = config.resolve.alias ?? [];
    const aliasEntries = Array.isArray(existingAliases)
      ? existingAliases
      : Object.entries(existingAliases).map(([find, replacement]) => ({ find, replacement }));

    config.resolve.alias = [
      ...aliasEntries,
      { find: /^@\//, replacement: `${sharedUiSrcPath}/` },
      { find: /^@masan-group\/shared-ui$/, replacement: `${sharedUiSrcPath}/index.ts` },
      {
        find: /^@masan-group\/shared-ui\/ui\/actions\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/ui/actions/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/ui\/forms\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/ui/forms/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/ui\/overlays\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/ui/overlays/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/ui\/feedback\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/ui/feedback/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/ui\/display\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/ui/display/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/patterns\/modals$/,
        replacement: `${sharedUiSrcPath}/components/patterns/modals/index.tsx`,
      },
      {
        find: /^@masan-group\/shared-ui\/patterns\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/patterns/$1/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/components\/(.*)$/,
        replacement: `${sharedUiSrcPath}/components/$1`,
      },
      {
        find: '@masan-group/shared-ui/charts',
        replacement: `${sharedUiSrcPath}/components/features/charts/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/query-builder',
        replacement: `${sharedUiSrcPath}/components/features/query-builder/index.tsx`,
      },
      {
        find: '@masan-group/shared-ui/date-picker',
        replacement: `${sharedUiSrcPath}/components/features/date-picker/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/modals',
        replacement: `${sharedUiSrcPath}/components/patterns/modals/index.tsx`,
      },
      {
        find: '@masan-group/shared-ui/skeletons',
        replacement: `${sharedUiSrcPath}/components/patterns/skeletons/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/timeline',
        replacement: `${sharedUiSrcPath}/components/features/timeline/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/filter-panel',
        replacement: `${sharedUiSrcPath}/components/features/filter-panel/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/click-to-edit',
        replacement: `${sharedUiSrcPath}/components/patterns/click-to-edit/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/selected-badge-node',
        replacement: `${sharedUiSrcPath}/components/patterns/selected-badge-node/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/virtualized-list',
        replacement: `${sharedUiSrcPath}/components/patterns/virtualized-list/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/ml-chart-loading',
        replacement: `${sharedUiSrcPath}/components/features/ml-chart-loading/index.ts`,
      },
      {
        find: '@masan-group/shared-ui/map',
        replacement: `${sharedUiSrcPath}/components/features/map/index.ts`,
      },
      { find: '@masan-group/shared-ui/lib/utils', replacement: `${sharedUiSrcPath}/lib/utils.ts` },
      {
        find: '@masan-group/shared-ui/lib/chart-colors',
        replacement: `${sharedUiSrcPath}/components/features/charts/utils/chart-colors.ts`,
      },
      {
        find: '@masan-group/shared-ui/globals.css',
        replacement: `${sharedUiSrcPath}/styles/globals.css`,
      },
      {
        find: '@masan-group/shared-ui/context',
        replacement: `${sharedUiSrcPath}/context/index.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/context\/(.*)$/,
        replacement: `${sharedUiSrcPath}/context/$1.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/hooks\/(.*)$/,
        replacement: `${sharedUiSrcPath}/hooks/$1.ts`,
      },
      {
        find: /^@masan-group\/shared-ui\/utils\/(.*)$/,
        replacement: `${sharedUiSrcPath}/utils/$1.ts`,
      },
      { find: '@workspace/shared-ui', replacement: '@masan-group/shared-ui' },
      { find: '@workspace/utils', replacement: '@masan-group/utils' },
      { find: '@workspace/types', replacement: '@masan-group/types' },
    ];
    return config;
  },
};

export default config;
