---
id: panel-updating
title: Updating
description: Upgrade the panel in two commands; migrations run automatically.
sidebar_position: 5
slug: /panel-updating
---

# Updating

Releases are published as Docker images and GitHub tags. The image is the release — upgrading is pulling the new one and recreating the container.

## Standard upgrade

```bash
cd /opt/panasaurus/panel      # or wherever your compose stack lives
docker compose pull panel
docker compose up -d
```

Migrations run automatically on every container start, and the entrypoint re-caches config, routes, and views. Downtime is the seconds between container stop and health-green; the queue worker and scheduler restart with the panel under supervisor.

Check where you ended up:

```bash
docker compose exec panel php artisan panasaurus:info
curl -fsS http://localhost:80/api/health | jq .status
```

## Update channels

| Channel | Image tag | When to use |
|---|---|---|
| Stable | `ghcr.io/panasaurus/panel:latest` | Default. Tagged releases only. |
| Pinned | `ghcr.io/panasaurus/panel:v1.0.0` | Reproducible deploys; upgrade by editing the tag. |
| Development | built from `main` in CI | Only if you want tomorrow's bugs today. |

Pin the version in production compose files and bump deliberately — `latest` is convenient, pinned is boring in the good way.

## Before a major version jump

Migrations are one-way. Before upgrading across a major version:

1. **Back up the database** (see below).
2. Read the release notes on the [releases page](https://github.com/panasaurus/panel/releases) — breaking changes are called out there.
3. Upgrade a staging copy first if the panel matters to your business.

## Backups

Database dump straight from the container:

```bash
docker compose exec database sh -c \
  'exec mariadb-dump -u panasaurus -p"$MYSQL_PASSWORD" panasaurus' > backup.sql
```

Volumes worth backing up beyond the database: `data/database`, `data/var` (server files metadata, certificates), and `data/extensions` if you've installed Blueprint extensions. Everything else is reproducible from the image.

## Rolling back

```bash
docker compose down
# edit docker-compose.yml: set the previous image tag
docker compose up -d
```

Roll back the database by restoring the dump you took before the upgrade. Migrations applied by the newer version won't be undone by the older code.
