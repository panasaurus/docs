---
id: images-migration
title: Migrating from yolks
description: Switch servers from pterodactyl/yolks images to ghcr.io/panasaurus/images — per-image map and a bulk SQL update.
sidebar_position: 3
slug: /images-migration
---

# Migrating from yolks

Panasaurus Images are drop-in compatible with eggs written for Pterodactyl yolks — same entrypoints, same environment, same layout. Migration is therefore a find-and-replace on image references. There are two ways to do it: per-server in the admin UI, or in bulk through the database.

## The image map

| Upstream image | Panasaurus image |
|---|---|
| `ghcr.io/pterodactyl/yolks:java_8` | `ghcr.io/panasaurus/images:java_8` |
| `ghcr.io/pterodactyl/yolks:java_8j9` | `ghcr.io/panasaurus/images:java_8j9` |
| `ghcr.io/pterodactyl/yolks:java_11` | `ghcr.io/panasaurus/images:java_11` |
| `ghcr.io/pterodactyl/yolks:java_11j9` | `ghcr.io/panasaurus/images:java_11j9` |
| `ghcr.io/pterodactyl/yolks:java_16` | `ghcr.io/panasaurus/images:java_16` |
| `ghcr.io/pterodactyl/yolks:java_16j9` | `ghcr.io/panasaurus/images:java_16j9` |
| `ghcr.io/pterodactyl/yolks:java_17` | `ghcr.io/panasaurus/images:java_17` |
| `ghcr.io/pterodactyl/yolks:java_17j9` | `ghcr.io/panasaurus/images:java_17j9` |
| `ghcr.io/pterodactyl/yolks:java_18` | `ghcr.io/panasaurus/images:java_18` |
| `ghcr.io/pterodactyl/yolks:java_18j9` | `ghcr.io/panasaurus/images:java_18j9` |
| `ghcr.io/pterodactyl/yolks:java_19` | `ghcr.io/panasaurus/images:java_19` |
| `ghcr.io/pterodactyl/yolks:java_19j9` | `ghcr.io/panasaurus/images:java_19j9` |
| `ghcr.io/pterodactyl/yolks:java_21` | `ghcr.io/panasaurus/images:java_21` |
| `ghcr.io/pterodactyl/yolks:java_22` | `ghcr.io/panasaurus/images:java_22` |
| `ghcr.io/pterodactyl/yolks:java_23` | `ghcr.io/panasaurus/images:java_23` |
| `ghcr.io/pterodactyl/yolks:java_24` | `ghcr.io/panasaurus/images:java_24` |
| `ghcr.io/pterodactyl/yolks:installergames` | `ghcr.io/panasaurus/images:installer_debian` |
| `ghcr.io/pterodactyl/yolks:installer` | `ghcr.io/panasaurus/images:installer_alpine` |
| `ghcr.io/pterodactyl/yolks:alpine` | `ghcr.io/panasaurus/images:alpine` |
| `ghcr.io/pterodactyl/yolks:debian` | `ghcr.io/panasaurus/images:debian` |
| `ghcr.io/pterodactyl/yolks:source` | `ghcr.io/panasaurus/images:source` |
| `ghcr.io/pterodactyl/yolks:conan_exiles` | `ghcr.io/panasaurus/images:conan_exiles` |
| `ghcr.io/pterodactyl/yolks:rust` | `ghcr.io/panasaurus/images:rust` |
| `ghcr.io/pterodactyl/yolks:go_1.14` … `:go_1.20` | `ghcr.io/panasaurus/images:go_1.14` … `:go_1.20` |
| `ghcr.io/pterodactyl/yolks:go_1.21` … `:go_1.23` | `ghcr.io/panasaurus/images:go_1.21` … `:go_1.23` |
| `ghcr.io/pterodactyl/yolks:nodejs_12` … `:nodejs_18` | `ghcr.io/panasaurus/images:nodejs_12` … `:nodejs_18` |
| `ghcr.io/pterodactyl/yolks:python_3.7` … `:python_3.11` | `ghcr.io/panasaurus/images:python_3.7` … `:python_3.11` |
| `ghcr.io/pterodactyl/yolks:dotnet_7` / `:dotnet_8` | `ghcr.io/panasaurus/images:dotnet_7` / `:dotnet_8` |
| `ghcr.io/pterodactyl/yolks:java_25` / `:go_1.25` | not in yolks — Panasaurus additions |

New runtimes that upstream yolks lack (`java_22`–`java_26`, `nodejs_20`/`22`/`24`, `python_3.12`/`3.13`, `go_1.24`–`1.26`, `dotnet_9`, `hytale`) are Panasaurus originals — nothing to migrate, everything to gain.

## Per-server migration

**Admin → Servers → (server) → Docker** — swap the image, restart the server. The daemon pulls the new image on next boot; server data is untouched because it lives in volumes, not layers.

## Bulk migration

For panels with many servers, one transaction against the panel database:

```sql
-- Take a dump first. Seriously.
-- mariadb-dump -u panasaurus -p panasaurus > pre-migration.sql

START TRANSACTION;

UPDATE eggs
  SET docker_images = REPLACE(docker_images,
      'ghcr.io/pterodactyl/yolks:', 'ghcr.io/panasaurus/images:');

-- stock Pterodactyl installations may still carry docker.io references
UPDATE eggs
  SET docker_images = REPLACE(docker_images,
      'ghcr.io/pterodactyl/', 'ghcr.io/panasaurus/images:')
  WHERE docker_images LIKE '%pterodactyl/yolks%';

COMMIT;
```

:::caution
Match your actual schema before running this on production — column and table names vary slightly between panel versions (`eggs.docker_images` here is the Pyrodactyl/Panasaurus layout). The `SELECT` version of each `UPDATE` costs nothing and shows exactly what will change:

```sql
SELECT id, name, docker_images FROM eggs
  WHERE docker_images LIKE '%pterodactyl/yolks%';
```
:::

After the bulk update, restart servers (or wait for the next boot — image references are read at container start) and check one server from each game to be thorough.

## What you gain

Beyond the registry consolidation, the migrated images behave better at the edges:

- **Correct signal handling** — exec-form entrypoints mean `stop` actually stops; no more SIGKILL after 30 seconds because PID 1 ignored SIGTERM.
- **Leaner pulls** — cache purges and `--no-install-recommends` shave layers and bytes off every node's first pull.
- **Honest logs** — EOL runtimes print one clear warning per boot instead of silently drifting.
- **Pinned bases** — monthly rebuilds against maintained Alpine/Debian versions; CVE patches arrive without egg changes.

Questions or a weird egg that doesn't map cleanly? Bring it to the [Discord](https://discord.gg/tszvW9zKN7) — the `#eggs` channel handles exactly this.
