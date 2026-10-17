---
title: Extensions and Blueprint
description: Install and manage Blueprint extensions — the framework is built into Panasaurus, with a marketplace in the admin area.
sidebar_label: Extensions
---

# Extensions and Blueprint

The [Blueprint](https://blueprint.zip) extension framework ships **pre-installed** in Panasaurus. There is nothing to patch, no fork to maintain, and no version drift: extensions written for Blueprint and Pterodactyl install and run out of the box.

## The admin area

Two pages under **Admin → Panasaurus** handle everything visual:

- **Extensions** lists every installed extension with its version, controls, and removal action.
- **Marketplace** is a live view of the Blueprint ecosystem directory, cached in-app, with search and filters. Each listing shows the exact install command, so you can copy it and go.

## The CLI

The `panasaurus` binary inside the container manages extensions directly (it is also available as `blueprint` for muscle memory):

```bash
docker compose exec panel panasaurus -install extension.blueprint   # install a file
docker compose exec panel panasaurus -list                          # list installed extensions
docker compose exec panel panasaurus -remove extension              # remove an extension
docker compose exec panel panasaurus -help                          # everything else
```

A typical workflow from the marketplace page: download or reference the `.blueprint` file, install it, then reload the admin area. The CLI wires up backend routes, admin views, and frontend extension points automatically — the panel's React app exposes the same extension slots Blueprint users already know, so no rebuild is required.

## Writing your own

Panasaurus keeps full compatibility with the Blueprint extension format. Start with the [Blueprint developer guides](https://blueprint.zip/guides); the panel repository also bundles reference material in [`docs/EXTENSIONS.md`](https://github.com/panasaurus/panel/blob/main/docs/EXTENSIONS.md).

A few Panasaurus-specific notes:

- The frontend is React 19 with Vite; extension frontend additions register through the Blueprint routes registry rather than patching compiled bundles.
- The `Pterodactyl\` PHP namespace is preserved on purpose — it is what keeps the existing extension ecosystem working.
- Extensions live under `data/extensions/` on the host, so they survive container recreation and are part of your normal backup routine.

## Troubleshooting

If an extension breaks the panel, remove it from the CLI and restart:

```bash
docker compose exec panel panasaurus -remove broken-extension
docker compose restart panel
```

Because `data/extensions` is a host mount, a broken extension never gets baked into the image — wiping the directory is always a safe escape hatch after a backup.
