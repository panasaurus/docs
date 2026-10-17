---
id: extensions
title: Extensions
description: Blueprint is pre-installed — install community extensions in seconds, no patching required.
sidebar_position: 2
slug: /extensions
---

# Extensions

Panasaurus ships with the **Blueprint extension framework** pre-installed — no patching, no manual file merging. Extensions written for Blueprint (and therefore stock Pterodactyl) install and run out of the box. The `Pterodactyl` PHP namespace and the `blueprint` CLI name are preserved alongside the Panasaurus ones, so the existing extension ecosystem works unmodified.

## Installing an extension

From the admin area: **Admin → Panasaurus → Marketplace** finds extensions and shows one-click install instructions.

From the shell, drop a `.blueprint` file into the panel container and run the CLI:

```bash
# inside the panel container
panasaurus -install my-extension    # install/update from a .blueprint file
panasaurus -list                    # what's installed
panasaurus -query my-extension      # details about one extension
panasaurus -remove my-extension     # uninstall
panasaurus -rerun-install           # refresh symlinks + caches (fixes 404 assets)
```

From the host, no shell inside the container needed:

```bash
cd /opt/panasaurus/panel
docker compose cp ./my-extension.blueprint panel:/app/
docker compose exec panel panasaurus -install my-extension
```

## How it works

```text
my-extension.blueprint         ← zip archive with a conf.yml + assets
        │  panasaurus -install <file>
        ▼
.blueprint/extensions/<id>/    ← installed extension lives here
        │  symlinked into
        ├── public/extensions/<id>        (public files)
        ├── public/assets/extensions/<id> (styles/images)
        ├── resources/views/blueprint/admin/wrappers/... (admin UI)
        └── resources/scripts/blueprint/...              (client UI, rebuilt)
```

Installing rebuilds the frontend assets automatically — the panel runs Vite, not the old webpack pipeline, so extension assets compile with the same toolchain as the core UI.

## CLI reference

The CLI lives inside the container as both `panasaurus` and `blueprint`:

| Command | Description |
|---|---|
| `panasaurus -install <name>` | Install/update an extension from a `.blueprint` file in the panel root |
| `panasaurus -remove <name>` | Remove an installed extension |
| `panasaurus -query <name>` | Show information about an installed extension |
| `panasaurus -list` | List installed extensions |
| `panasaurus -init` | Scaffold a new extension project (developer mode) |
| `panasaurus -build` | Build an extension from source |

## Extension surface in Panasaurus

### Admin (Blade)

- `/admin/extensions` — extension manager (list, configure, update)
- `/admin/extensions/marketplace` — built-in marketplace with the live Blueprint directory
- Admin sidebar **Extensions** section
- `blueprint.admin.wrappers` — extension blade wrappers render into every admin page

### Client (React 19)

Extension components mount around the panel's UI through placeholder files in `resources/scripts/blueprint/components/`:

| Placeholder | Renders |
|---|---|
| `Dashboard/Global/BeforeSection,AfterSection` | Around the entire dashboard |
| `Dashboard/Serverlist/BeforeContent,AfterContent` | Around the server list |
| `Navigation/NavigationBar/Before,AfterNavigation` | Around the dashboard sidebar nav |
| `Navigation/SubNavigation/AdditionalAccountItems` | Extra account nav items |
| `Server/Terminal/Before,AfterContent,AdditionalPowerButtons,CommandRow` | Console page |
| `Server/Backups,Databases,Files,Network,Settings,Startup,Users/Before,After` | Around each server page |
| `Account/API,Overview,SSH/Before,After` | Account pages |

Routes are registered through `resources/scripts/blueprint/extends/routers/routes.ts` (account + server routes, with per-route permissions and admin-only flags).

### Backend (PHP)

- `app/BlueprintFramework/Libraries/ExtensionLibrary/` — `dbGet`/`dbSet`, template helpers, console APIs
- Console commands, models, and services under `app/BlueprintFramework/`
- Scheduled tasks (`bp:version:cache`, `bp:meta`, extension schedules) run through the panel's scheduler

## Building your own

Start with `panasaurus -init` inside the container — it scaffolds a working extension you can iterate on. The upstream guides at [blueprint.zip/guides](https://blueprint.zip/guides) cover the extension format in depth, and [`docs/EXTENSIONS.md`](https://github.com/panasaurus/panel/blob/main/docs/EXTENSIONS.md) in the panel repository documents the Panasaurus-specific surface in full.

Publish what you build: the [marketplace page](/docs/marketplace) explains where extensions and eggs are listed.
