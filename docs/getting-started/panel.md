---
id: panel-install
title: Panel installation
description: Requirements, one-command Docker install, manual install, environment variables, and HTTPS for the Panasaurus panel.
sidebar_position: 2
slug: /panel-install
---

# Panel installation

Panasaurus is designed to be **installed by Docker and run in Docker**. Everything — the panel, database, cache, queue worker, and scheduler — lives in a single compose stack managed by `docker-compose.yml`. There is no supported bare-metal path, and that is deliberate: the compose file pins versions, wires healthchecks, and makes upgrades a two-command affair.

## Requirements

| | |
|---|---|
| OS | Ubuntu 20.04+, Debian 11+ (anything with Docker 24+ works) |
| RAM | 1 GB minimum, 2 GB recommended |
| Docker | Engine 24+ **with the compose plugin** |
| Network | A domain pointed at the host (optional, needed for HTTPS) |

Install Docker first if you don't have it:

```bash
curl -fsSL https://get.docker.com | sh
```

## One-command install

```bash
curl -fsSL https://panasaurus.com/install.sh | bash
```

Choose **1) Install the Panel** when the menu appears. The installer creates the directory, generates strong credentials, boots the stack, applies migrations, seeds the Blueprint framework, and prints your admin login.

Non-interactive form:

```bash
bash install.sh --panel --panel-url https://panel.example.com --yes
```

Useful flags:

| Flag | Default | Purpose |
|---|---|---|
| `--install-dir <dir>` | `/opt/panasaurus/panel` | Where the compose stack lives |
| `--port <port>` | `80` | Host port for the panel |
| `--admin-email <email>` | `admin@panasaurus.local` | First-boot admin email |
| `--panel-url <url>` | asked interactively | Public URL, baked into `APP_URL` |

## Manual install

If you'd rather drive:

```bash
git clone https://github.com/panasaurus/panel.git /opt/panasaurus/panel
cd /opt/panasaurus/panel

# create data directories
mkdir -p data/database data/var data/logs data/extensions data/nginx data/certs

# edit: set APP_URL, PANEL_PORT, database passwords, first-boot admin env
$EDITOR docker-compose.yml

docker compose up -d
```

On first boot the panel container will:

1. Wait for MariaDB to accept connections
2. Run all migrations
3. Seed the Blueprint framework
4. Create your admin account (if `PANASAURUS_ADMIN_PASSWORD` is set)
5. Cache config, routes, and views for production speed

Watch progress:

```bash
docker compose logs -f panel
```

## Environment variables

| Variable | Purpose |
|---|---|
| `APP_URL` | Public URL of the panel (used for links and emails) |
| `APP_TIMEZONE` | Panel timezone (PHP timezone names) |
| `PANEL_PORT` | Host port the panel listens on |
| `PANASAURUS_ADMIN_EMAIL` | First-boot admin email |
| `PANASAURUS_ADMIN_USERNAME` | First-boot admin username (default `admin`) |
| `PANASAURUS_ADMIN_PASSWORD` | First-boot admin password |
| `PANASAURUS_DB_PASSWORD` | MariaDB password (must match `MYSQL_PASSWORD` and `DB_PASSWORD`) |
| `TRUSTED_PROXIES` | Proxy subnet when behind a reverse proxy, so real client IPs are logged |

The full list lives in [`.env.example`](https://github.com/panasaurus/panel/blob/main/.env.example) in the panel repository.

## What's inside the stack

| Container | Image | Job |
|---|---|---|
| `panel` | `ghcr.io/panasaurus/panel` | PHP-FPM 8.4 + nginx + OPcache JIT, tini init, queue worker and scheduler under supervisor |
| `database` | `mariadb:11` | Application database |
| `redis` | `redis:7-alpine` | Cache, sessions, queues |

The panel image exposes `/api/health` — public, monitor-friendly JSON covering database, Redis, and storage checks. Point your uptime monitor at it.

## HTTPS

Two supported approaches:

**Reverse proxy (recommended)** — run nginx, Caddy, or Traefik in front and set `APP_URL` to your `https://` domain. Add `TRUSTED_PROXIES` with your proxy subnet so the panel sees real client IPs. A minimal Caddyfile is two lines:

```caddy
panel.example.com {
    reverse_proxy 127.0.0.1:8080
}
```

**Built-in nginx** — mount certificates into `./data/certs`, copy the commented `listen 443 ssl` block from `.github/docker/default.conf` into `./data/nginx/panasaurus.conf` with your domain and cert paths, and restart the panel container. Full walkthrough: [HTTPS](/docs/panel-https).

## Verifying the install

```bash
curl -fsS http://localhost:80/api/health | jq
```

```json
{
  "status": "ok",
  "database": true,
  "redis": true,
  "storage": true
}
```

Then log in with the credentials the installer printed, and head to **Admin → Panasaurus** for version info and the extension Marketplace.

:::caution First login
Change the generated admin password immediately — the installer's password is strong, but it has now crossed a terminal scrollback.
:::

## Troubleshooting

See the dedicated [troubleshooting page](/docs/panel-troubleshooting) — the short version: boot problems are almost always a `DB_PASSWORD` mismatch or a port already bound, and `docker compose logs panel` tells you which.
