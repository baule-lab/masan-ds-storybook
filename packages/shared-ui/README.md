# @workspace/shared-ui

Shared UI components package for the Loyalty Bos workspace.

## Overview

This package contains reusable UI components built with:
- **React** - UI library
- **Radix UI** - Headless UI primitives
- **Tailwind CSS** - Styling
- **class-variance-authority** - Component variants

## Components

All UI components are based on shadcn/ui and organized by responsibility so they can scale with the product.

### Top‑level categories

The package is structured into several high‑level folders:

- **`brand`**: Visual identity building blocks that rarely change and are shared across every surface.
  - **Examples**: logos, wordmarks, brand icons, brand gradients/illustrations, brand color tokens, brand‑specific backgrounds/frames.
  - **When to put something here**: the component directly expresses brand identity and is not specific to a single feature or flow.

- **`features`**: Feature‑level compositions that are unique to a domain or product area.
  - **Examples**: loyalty points header, referral banner, rewards redemption card, account limits panel, experiment/AB‑test specific UIs.
  - **When to put something here**: the component exists to support one feature or product surface and is not intended as a generic pattern.

- **`patterns`**: Reusable UX patterns composed from lower‑level UI primitives.
  - **Examples**: filter bar, search + results layout, master–detail layout, form steps/stepper, empty‑state blocks, confirmation flows.
  - **When to put something here**: multiple features can reuse the same interaction or layout pattern with different copy/data.

- **`ui`**: Low‑level, generic building blocks (largely shadcn/ui‑style primitives).
  - **Sub‑folders**: `ui/navigation`, `ui/actions`, `ui/data-display`, `ui/forms`, etc.
  - **When to put something here**: the component is generic, composable, and should not know about business logic.

### `ui/navigation`

Navigation components that help users move around the product.

- **Belongs here**
  - Application shell pieces: sidebar, top bar, app header, breadcrumbs.
  - In‑page navigation: tabs, section nav, step indicators used to move between sections.
  - Menus that primarily change the current view or route.
- **Does not belong here**
  - CTA buttons that trigger actions (see `ui/actions`).
  - Feature‑specific nav (e.g. a loyalty tier selector tightly coupled to business logic) → consider `features`.

### `ui/actions`

Action components that trigger operations or workflows.

- **Belongs here**
  - Buttons, icon buttons, split buttons.
  - Toggles, switches, and action chips.
  - Floating action controls, primary/secondary CTAs, destructive actions.
- **Does not belong here**
  - Simple links used for navigation → `ui/navigation` (or standard `<a>`).
  - Complex flows combining multiple actions and views → `patterns` or `features`.

### Other common `ui` areas

These are suggestions to keep things consistent as the library grows:

- **`ui/forms`**: Inputs, textareas, selects, checkboxes, radios, date pickers, form field wrappers, validation messages.
- **`ui/data-display`**: Badge, avatar, card, table, tooltip, skeleton, empty states that are fully generic.
- **`ui/feedback`**: Alert, toast, dialog/alert dialog, banners, progress, loading indicators.

If a component is:

- **Purely visual and global** → `brand`
- **Business/feature specific** → `features`
- **Reusable UX flow/layout** → `patterns`
- **Generic primitive** → `ui/*`

## Utilities

- `cn` - Utility for merging Tailwind classes
- `sleep` - Promise-based delay utility
- `getPageNumbers` - Pagination helper

## Usage

### Importing Components

```typescript
// Import from main package
import { Button, Input, Card } from "@workspace/shared-ui";

// Import utilities
import { cn } from "@/lib/utils";
```

### Example

```typescript
import { Button } from "@workspace/shared-ui";

export function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

## Development

```bash
# Build the package
pnpm build

# The package uses TypeScript with declaration files
```

## Dependencies

All dependencies are managed through the workspace catalog in `pnpm-workspace.yaml`.
