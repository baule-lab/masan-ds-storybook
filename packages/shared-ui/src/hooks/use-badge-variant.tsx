import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  Ban,
  Play,
  FileCheck,
  Megaphone,
  TrendingUp,
  HelpCircle,
  AlertCircle,
  TruckElectric,
} from 'lucide-react';
import type { BadgeVariant } from '../components/ui/display/badge';
import type { BadgeAppearance } from '../components/ui/display/badge';

const PLAN_STATUS = {
  PENDING: 'pending',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  WAITING_FOR_APPROVAL: 'waiting_for_approval',
  APPROVED: 'approved',
  RUNNING: 'running',
  REJECTED: 'rejected',
} as const;

const PLAN_TYPES = {
  SOP: 'sop',
  PROMOTION: 'promotion',
  DEMAND: 'demand',
  INNOVATION: 'innovation',
  SUPPLY_PLAN: 'supply',
  NET_REQUIREMENT: 'net_requirement',
} as const;

const SKU_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  REMOVED: 'removed',
} as const;

export function useBadgeVariant() {
  const getVariant = ({
    value,
    appearance = 'light',
    label,
    icon,
  }: {
    value: string;
    appearance?: BadgeAppearance;
    label?: string;
    icon?: () => React.ReactNode;
  }) => {
    const variantMap: Record<
      string,
      {
        variant: BadgeVariant;
        appearance?: BadgeAppearance;
        label?: string;
        icon?: () => React.ReactNode;
      }
    > = {
      [PLAN_STATUS.APPROVED]: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Approved',
      },
      [PLAN_STATUS.RUNNING]: {
        variant: 'info' as const,
        icon: () => icon?.() ?? <Play className="size-3" />,
        appearance,
        label: label ?? 'Running',
      },
      [PLAN_STATUS.WAITING_FOR_APPROVAL]: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'Waiting for approval',
      },
      [PLAN_STATUS.DRAFT]: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <FileText className="size-3" />,
        appearance,
        label: label ?? 'Draft',
      },
      [PLAN_STATUS.SUBMITTED]: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Submitted',
      },
      [PLAN_STATUS.PENDING]: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <FileText className="size-3" />,
        appearance,
        label: label ?? 'Pending',
      },
      [PLAN_STATUS.REJECTED]: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'Rejected',
      },
      // Plan Types
      [PLAN_TYPES.SOP]: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <FileCheck className="size-3" />,
        appearance,
        label: label ?? 'SOP',
      },
      [PLAN_TYPES.PROMOTION]: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <Megaphone className="size-3" />,
        appearance,
        label: label ?? 'Promotion',
      },
      [PLAN_TYPES.INNOVATION]: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <TrendingUp className="size-3" />,
        appearance,
        label: label ?? 'Innovation',
      },
      [PLAN_TYPES.DEMAND]: {
        variant: 'info' as const,
        icon: () => icon?.() ?? <TrendingUp className="size-3" />,
        appearance,
        label: label ?? 'Demand plan',
      },
      [PLAN_TYPES.SUPPLY_PLAN]: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <TruckElectric className="size-3" />,
        appearance,
        label: label ?? 'Supply Plan',
      },
      [PLAN_TYPES.NET_REQUIREMENT]: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <TrendingUp className="size-3" />,
        appearance,
        label: label ?? 'Net requirement',
      },
      // SKU Status
      [SKU_STATUS.ACTIVE]: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Active',
      },
      [SKU_STATUS.INACTIVE]: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'Inactive',
      },
      [SKU_STATUS.REMOVED]: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Ban className="size-3" />,
        appearance,
        label: label ?? 'Removed',
      },

      // WCM Promotion Planning approval statuses
      tp_review: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'TP Review',
      },
      tp_approved: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'TP Approved',
      },
      tp_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'TP Rejected',
      },
      tp_removed: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <Ban className="size-3" />,
        appearance,
        label: label ?? 'TP Removed',
      },
      mkt_review: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'MKT Review',
      },
      mkt_approved: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'MKT Approved',
      },
      mkt_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'MKT Rejected',
      },
      mkt_removed: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <Ban className="size-3" />,
        appearance,
        label: label ?? 'MKT Removed',
      },
      ops_review: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'Ops Review',
      },
      ops_approved: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Ops Approved',
      },
      ops_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'Ops Rejected',
      },
      ops_removed: {
        variant: 'primary' as const,
        icon: () => icon?.() ?? <Ban className="size-3" />,
        appearance,
        label: label ?? 'Ops Removed',
      },
      fin_review: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'Finance Review',
      },
      fin_approved: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Finance Approved',
      },
      fin_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'Finance Rejected',
      },
      ops_fin_approved: {
        variant: 'success' as const,
        icon: () => icon?.() ?? <CheckCircle className="size-3" />,
        appearance,
        label: label ?? 'Ops & Finance Approved',
      },
      ops_fin_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'Ops/Finance Rejected',
      },
      gd_review: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <Clock className="size-3" />,
        appearance,
        label: label ?? 'GD Review',
      },
      gd_rejected: {
        variant: 'destructive' as const,
        icon: () => icon?.() ?? <XCircle className="size-3" />,
        appearance,
        label: label ?? 'GD Rejected',
      },

      ['promotion_planning']: {
        variant: 'warning' as const,
        icon: () => icon?.() ?? <TrendingUp className="size-3" />,
        appearance,
        label: label ?? 'Promotion Planning',
      },

      Innovation: {
        variant: 'warning' as const,
        appearance,
        label: label ?? 'Innovation',
      },

      // Empty or null value
      '': {
        variant: 'info' as const,
        icon: () => icon?.() ?? <AlertCircle className="size-3" />,
        appearance,
        label: label ?? 'Empty',
      },
      // Undefined or unknown value
      undefined: {
        variant: 'info' as const,
        icon: () => icon?.() ?? <HelpCircle className="size-3" />,
        appearance,
        label: label ?? 'Unknown',
      },
    };

    // Handle empty, null, or undefined values
    if (!value || value.trim() === '') {
      return (
        variantMap[''] || {
          variant: 'info' as const,
          icon: () => icon?.() ?? <AlertCircle className="size-3" />,
          appearance,
          label: label ?? 'Empty',
        }
      );
    }

    // Return matched value or default for undefined
    return (
      variantMap[value] || {
        variant: 'info' as const,
        icon: () => icon?.() ?? null,
        appearance,
        label: label ?? value,
      }
    );
  };

  return {
    getVariant,
  };
}
