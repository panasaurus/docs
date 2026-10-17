---
id: panel-index
title: Panel
description: The Panasaurus panel — Blueprint built in, extensions, marketplace, HTTPS, updates, and troubleshooting.
slug: /panel
sidebar_position: 1
---

# Panel

Panasaurus Panel is the web application your users live in: servers, consoles, files, backups, and a full admin area. Under the hood it's Laravel 12 on PHP 8.4 with a React 19 + Vite 7 frontend, OPcache JIT preloading, and the **Blueprint extension framework pre-installed**.

If you haven't installed it yet, start with [Panel installation](/docs/panel-install).

## What's built in

| Area | Details |
|------|---------|
| Blueprint framework | Full backend, CLI, admin pages, and React extension points — extensions made for Blueprint/Pterodactyl work out of the box |
| Marketplace | Live directory of the Blueprint ecosystem, cached in-app with search and filters |
| Command menu | Fast navigation on server pages |
| Health endpoint | `GET /api/health` — public, monitor-friendly JSON status (database, redis, storage) |
| Panasaurus CLI | `php artisan panasaurus:info` and `php artisan panasaurus:status` |
| Docker everywhere | Multi-stage image, healthchecks, tini, tuned PHP-FPM + nginx + supervisor, queue worker, scheduler |
| Performance | OPcache JIT + preloading, gzip, aggressive static caching, code-split assets |

## Pages in this section

- **[Extensions](/docs/extensions)** — install and manage Blueprint extensions, CLI reference, extension surface
- **[Marketplace](/docs/marketplace)** — the built-in extension marketplace and the [egg marketplace](https://eggs.panasaurus.com)
- **[HTTPS](/docs/panel-https)** — reverse proxy and built-in nginx setups
- **[Updating](/docs/panel-updating)** — upgrade procedure and release channels
- **[Troubleshooting](/docs/panel-troubleshooting)** — the hits

## Daily driver commands

```bash
# inside the panel container
panasaurus -install <extension>    # install a .blueprint file
panasaurus -list                   # list installed extensions
panasaurus -remove <extension>     # remove an extension

# from the host
docker compose -f /opt/panasaurus/panel/docker-compose.yml exec panel panasaurus -help
php artisan panasaurus:status      # service health check
php artisan bp:meta                # refresh extension metadata cache
```

Questions that outlive this page? The [Discord](https://discord.gg/tszvW9zKN7) is the fastest route to a human.
