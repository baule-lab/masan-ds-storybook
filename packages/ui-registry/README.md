# @masan-group/ui-registry

Shadcn-compatible registry builder for `@masan-group` components.

This package reads source files from `packages/shared-ui/src/**` using manifests
in `packages/ui-registry/manifests` and builds installable registry payloads.

## Primary Registry (Single Namespace)

Primary consumer namespace is `@masan-group`, backed by:

- `packages/ui-registry/public/registry/r/{name}.json`

This supports both:

- individual install: `@masan-group/button`
- bundle install: `@masan-group/shared-ui-components`

## How to Use

### Command line (from repo root)

**Build registries**

```bash
pnpm registry:build          # build all registries from manifests
pnpm registry:build:unified  # build unified/bundle registries (e.g. shared-ui-components)
```

**Clean generated artifacts**

```bash
pnpm registry:clean
```

### Folder structure

High-level structure of the registry package:

```text
packages/
  shared-ui/
    src/                         # source components, hooks, utils...

  ui-registry/
    manifests/
      registry.registry.json     # root registry manifest
      ...                        # per-entity manifests (e.g. button, table, hooks)

    public/
      registry/
        r/
          button.json
          table.json
          shared-ui-components.json
          ...                    # one JSON per registry entry

    scripts/
      build-registries.mjs       # build command implementation
      clean-registries.mjs       # cleanup for generated artifacts

    .generated/
      <namespace>/
        ...                      # temporary workspace for build output
```

## Build Commands

From repository root:

```bash
pnpm registry:build
pnpm registry:build:unified
pnpm registry:clean
```

Generated artifacts:

- `packages/ui-registry/public/registry/r/*.json`

Temporary generated build workspace:

- `packages/ui-registry/.generated/<namespace>/...`

## Consumer `components.json` Example

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
        "ref": "main"
      }
    }
  }
}
```

## Auth

Set token for private repo read access:

```bash
GITHUB_TOKEN=ghp_xxx
```

## Install Examples

```bash
npx shadcn@latest view @masan-group/button
npx shadcn@latest add @masan-group/button
npx shadcn@latest add @masan-group/shared-ui-components
```
