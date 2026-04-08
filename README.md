# @masan-group/fe-boilerplate

Monorepo boilerplate for **frontend projects** at `@masan-group`, with a **shared UI library** and a **shadcn-compatible UI registry** that other repos can consume via CLI.  
The main goals are:

- **Fast project setup** for new frontends.
- **Consistent design system** across apps.
- **Discoverable, installable components** via a central `ui-registry`.

---

### High-level Architecture

- **Monorepo tooling**
  - **Package manager**: `pnpm`
  - **Task runner**: `turbo`
  - **Lint/format**: `@biomejs/biome`
  - **Testing**: `vitest`
  - **Git hooks**: `husky`, `lint-staged`, `commitizen`/`commitlint`

- **Key workspaces**
  - **`apps/storybook`**: Storybook app to browse and test shared UI components.
  - **`packages/shared-ui`**: Shared component library (shadcn-style primitives + patterns).
  - **`packages/ui-registry`**: Registry builder that exposes `shared-ui` components as installable entries consumable by external frontends via `shadcn` CLI.
  - **`packages/utils`, `packages/types`, `packages/typescript-config`**: Shared utilities, types, and TS config.

---

### Getting Started (Monorepo)

- **Install dependencies**

```bash
pnpm install
```

- **Run Storybook (browse shared UI)**

```bash
pnpm dev:storybook
```

- **Build everything**

```bash
pnpm build
```

- **Lint & format**

```bash
pnpm check     # biome check
pnpm format    # biome format
```

---

### `packages/shared-ui` – Shared UI Library

`packages/shared-ui` is the main **design system implementation**:

- **Tech stack**
  - React
  - Radix UI (headless primitives)
  - Tailwind CSS
  - class-variance-authority (CVA)

- **Structure (conceptual)**
  - `brand/` – brand identity components (logos, brand frames, etc.).
  - `features/` – feature-specific compositions.
  - `patterns/` – reusable UX patterns (layouts, flows).
  - `ui/` – low-level, generic components (`ui/navigation`, `ui/actions`, `ui/forms`, etc.).

See `packages/shared-ui/README.md` for detailed categorization rules and usage examples.

---

### `packages/ui-registry` – Central UI Registry

`@masan-group/ui-registry` turns `shared-ui` source files into **registry JSON payloads** that external apps can consume via the `shadcn` CLI.

- **Source → Registry flow**
  - Reads component source from:  
    `packages/shared-ui/src/**`
  - Uses manifests in:  
    `packages/ui-registry/manifests`
  - Generates registry JSON entries in:  
    `packages/ui-registry/public/registry/r/*.json`

- **Primary namespace**
  - Registry namespace: **`@masan-group`**
  - Supports:
    - **Per-component install**: `@masan-group/button`
    - **Bundle install**: `@masan-group/shared-ui-components`

#### Build & Clean Registry (from repo root)

```bash
# Build all registry entries from manifests
pnpm registry:build

# Build unified / bundle registries (e.g. shared-ui-components)
pnpm registry:build:unified

# Clean generated artifacts
pnpm registry:clean
```

These commands delegate into `packages/ui-registry` scripts and will:

- Generate `*.json` registry files under `packages/ui-registry/public/registry/r/`.
- Use `.generated/<namespace>` as a temporary workspace.

See `packages/ui-registry/README.md` for a full folder breakdown and implementation details.

---

### How Other Frontend Repos Consume the Registry

The intention of this boilerplate is that **other frontend repos** can:

1. **Point their `components.json` to this registry**.
2. **Use `npx shadcn@latest`** to view/add components or bundles.

#### Example `components.json` in a Consumer Repo

In the downstream app, configure `components.json` like:

```json
{
  "registries": {
    "@masan-group": {
      "url": "https://api.github.com/repos/masan-group/fe-boilerplate/contents/packages/ui-registry/public/registry/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}",
        "Accept": "application/vnd.github.raw+json"
      },
      "params": {
        "ref": "dev"
      }
    }
  }
}
```

- **`url`**: Uses GitHub Contents API to fetch registry entries from this repo.
- **`{name}`**: Replaced by entries like `button`, `shared-ui-components`, etc.
- **`GITHUB_TOKEN`**: Must be set if the repo is private.

#### Auth for Private Registries

In the consumer environment (local shell, CI, etc.) set:

```bash
export GITHUB_TOKEN=ghp_xxx   # token with read access to this repo
```

#### Installing Components via CLI (Consumer Repo)

From the consumer project directory:

```bash
# View registry entry
npx shadcn@latest view @masan-group/button

# Install a single component
npx shadcn@latest add @masan-group/button

# Install a bundle of shared-ui components
npx shadcn@latest add @masan-group/shared-ui-components
```

This pulls the component source + styles from this monorepo into the consumer app, ensuring **consistent design tokens, UX patterns, and component API**.

---

### Typical Workflow for Design System Changes

- **1. Implement / update components** in `packages/shared-ui`.
- **2. Update manifests** in `packages/ui-registry/manifests` to expose new components or bundles.
- **3. Rebuild registry**:

```bash
pnpm registry:build
pnpm registry:build:unified
```

- **4. Commit & push** changes to this repo.
- **5. Consumers**:
  - Update their `ref`/branch or pin to a version.
  - Re-run `npx shadcn@latest add ...` to pull updates.

This keeps **all frontend repos aligned to a single, versionable design system**.

---

### Scripts (root `package.json`)

- **Quality & tooling**
  - **`pnpm check`** – biome check (lint + some formatting).
  - **`pnpm format`** – biome format.
  - **`pnpm check-types`** – type checking via turbo.
  - **`pnpm test`** – run tests via turbo.

- **Build & dev**
  - **`pnpm dev`** – run dev tasks for apps/packages via turbo.
  - **`pnpm preview`** – run preview tasks via turbo.
  - **`pnpm build`** – build all apps and packages.
  - **`pnpm clean`** – clean turbo cache and `node_modules` folders.
  - **`pnpm registry:build` / `pnpm registry:build:unified` / `pnpm registry:clean`** – UI registry lifecycle.

- **Git workflow**
  - **`pnpm prepare`** – setup husky hooks.
  - **`pnpm commit`** – use `commitizen` to create conventional commits.

---

### When to Use This Boilerplate

- **Starting a new frontend repo** that must:
  - Reuse the **same design system** and component APIs.
  - Install UI via **CLI (`shadcn`) instead of copy-paste**.
  - Stay aligned with centralized **brand + UX patterns**.
- **Iterating on the design system itself**, with:
  - Storybook to validate components.
  - Registry to publish installable entries for all consumer apps.

For deeper details, see the READMEs in `packages/shared-ui` and `packages/ui-registry`.
