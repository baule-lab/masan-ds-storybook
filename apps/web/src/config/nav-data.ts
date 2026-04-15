import {
  ClipboardList,
  Database,
  LayoutGrid,
  Settings,
  TrendingUp,
} from 'lucide-react';
import type { NavGroup } from '@masan-group/shared-ui/layout';

export const navGroups: NavGroup[] = [
  {
    title: 'Main Menu',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutGrid,
        items: [
          { title: 'Stats report', url: '/dashboard' },
          { title: 'Alerts', url: '/dashboard/alerts' },
        ],
      },
      {
        title: 'Data Governance',
        icon: Database,
        items: [
          { title: 'SKU Management', url: '/data-governance/sku-management' },
          { title: 'Price Management', url: '/data-governance/price-management' },
          {
            title: 'Active Item Code Mapping',
            url: '/data-governance/active-item-code-mapping',
          },
          { title: 'DP Management', url: '/data-governance/dp-management' },
          { title: 'DC Mapping', url: '/data-governance/dc-mapping' },
          { title: 'Data Upload', url: '/data-governance/data-upload' },
        ],
      },
      {
        title: 'Forecasting Engine',
        icon: TrendingUp,
        items: [
          { title: 'Baseline', url: '/forecasting-engine/baseline' },
          { title: 'DP Baseline', url: '/forecasting-engine/dp-baseline' },
          { title: 'Forecast Tracking', url: '/forecasting-engine/forecast-tracking' },
        ],
      },
      {
        title: 'Planning',
        icon: ClipboardList,
        items: [
          { title: 'Planning Overview', url: '/planning/planning-overview' },
          { title: 'Demand vs Supply', url: '/planning/demand-vs-supply' },
          { title: 'Promotion', url: '/planning/promotion' },
          { title: 'Configuration', url: '/planning/configuration' },
        ],
      },
      {
        title: 'Administration',
        icon: Settings,
        items: [
          { title: 'Users', url: '/administration/users' },
          { title: 'Roles', url: '/administration/roles' },
          { title: 'Approval Workflows', url: '/administration/approval-workflows' },
          { title: 'Workflow Mapping', url: '/administration/workflow-mapping' },
        ],
      },
    ],
  },
];
