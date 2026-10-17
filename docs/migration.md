---
title: Migrating to Panasaurus
description: Moving from Pterodactyl or Pyrodactyl to Panasaurus — panel swap, Wings swap, and bulk-updating egg image references.
sidebar_label: Migration
---

# Migrating to Panasaurus

Panasaurus reads the same databases, the same data directories, and the same egg format as Pterodactyl and Pyrodactyl. Migration is therefore less "move everything" and more "swap the moving parts" — with a couple of deliberate, reversible steps.

## Panel swap (Docker installs)

For Docker-based panels the migration is an image swap:

```diff
 services:
   panel:
-    image: ghcr.io/pyrodactyl-oss/pyrodactyl:latest
+    image: ghcr.io/panasaurus/panel:latest
```

Keep the database, cache, and volume definitions exactly as they are — the panel's first boot applies its own migrations on top of your existing schema and seeds the Blueprint framework. Before you start:

1. Back up `data/database` and take a SQL dump (see [panel configuration](/docs/panel/configuration#data-directories)).
2. Swap the image and `docker compose up -d`.
3. Log in as your existing admin account — nothing is reset.

:::note Coming from bare-metal Pterodactyl?
There is no native installer path for Panasaurus — the panel only ships as a container. Migrate your database and `var/` contents into the Docker stack's `data/` directories, then start the container; the migration guide in the panel repository covers the file layout mapping.
:::

## Wings swap

Install Panasaurus Wings next to your existing daemon following [Wings installation](/docs/wings/installation) — it installs its own binary (`panasaurus-wings`), config (`/etc/panasaurus/config.yml`), and service, so nothing about the old daemon is overwritten. Two settings to check against your old config:

- **Data path.** The installer defaults to `/var/lib/panasaurus`. If your servers live under the Pterodactyl layout (`/var/lib/pterodactyl/volumes`), point `system.data` at the existing path instead of moving terabytes, or set the panel node's data path accordingly.
- **Connection URL.** The new daemon's JWT audience must match the node's connection address in the panel exactly, including the port.

Once the new daemon is green in the panel, stop and disable the old service. Servers reconnect with their state intact — the on-disk format is the same.

## Egg image references

Eggs that reference Pterodactyl's yolks keep working, but every maintained base now lives under `ghcr.io/panasaurus/images`. To rewrite references in bulk on an existing panel, the images repository ships a [migration guide](https://github.com/panasaurus/images/blob/main/docs/MIGRATION.md) with the full old-to-new tag mapping and a SQL statement that updates every egg in one transaction. Run it against the panel's database, restart the panel container, and all eggs pull from the new namespace on their next build.

## Rolling back

Nothing in a migration is one-way. The panel image tag is a one-line revert; the Wings binary and service are separate files from the old daemon's; and the SQL image-reference update has a matching reverse statement in the migration guide. Take a backup before each step and the rollback path is always open.
