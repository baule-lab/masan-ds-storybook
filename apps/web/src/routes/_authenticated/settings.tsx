import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings.</p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <p className="text-muted-foreground text-sm">Settings content goes here.</p>
      </div>
    </div>
  );
}
