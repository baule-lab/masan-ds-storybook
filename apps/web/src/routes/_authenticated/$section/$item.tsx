import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/$section/$item')({
  component: PlaceholderSectionPage,
});

function humanizeSegment(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function PlaceholderSectionPage() {
  const { section, item } = Route.useParams();
  const sectionLabel = humanizeSegment(section);
  const itemLabel = humanizeSegment(item);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.2em]">
          {sectionLabel}
        </p>
        <h1 className="mt-2 font-bold text-2xl tracking-tight">{itemLabel}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This placeholder page keeps the new sidebar navigation interactive while the screen
          content is being implemented.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <p className="font-medium text-sm">Selected navigation item</p>
        <p className="mt-2 text-muted-foreground text-sm">
          Route: /{section}/{item}
        </p>
      </div>
    </div>
  );
}
