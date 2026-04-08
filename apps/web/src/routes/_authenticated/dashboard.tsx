import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Total Users', 'Revenue', 'Active Sessions', 'Conversion'].map((label) => (
          <div key={label} className="rounded-xl border bg-card p-6 shadow-xs">
            <p className="font-medium text-muted-foreground text-sm">{label}</p>
            <p className="mt-2 font-bold text-3xl">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
