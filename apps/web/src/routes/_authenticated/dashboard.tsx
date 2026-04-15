import { createFileRoute } from '@tanstack/react-router';
import { MRPScheduler } from '@/components/mrp-scheduler';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return <MRPScheduler />;
}
