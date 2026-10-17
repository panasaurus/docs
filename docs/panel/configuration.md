---
title: Panel configuration
description: Environment variables, data directories, HTTPS, and monitoring for the Panasaurus panel.
sidebar_label: Panel configuration
---

# Panel configuration

Everything the panel needs lives in one place: the `docker-compose.yml` in your install directory (default `/opt/panasaurus/panel`). The container is disposable — persistent state lives in the `data/` volume directories, so you can recreate the panel container freely as long as the compose file and `data/` survive.

## Environment variables

The `panel:` service in the compose file takes its settings from environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost` | Public URL of the panel. Every emailed link and asset URL is built from it — set it to your real domain. |
| `APP_TIMEZONE` | `UTC` | Timezone for scheduled tasks and displayed times. |
| `APP_SERVICE_AUTHOR` | — | Email shown as the author of settings you export. |
| `LE_EMAIL` | *(unset)* | Uncomment and set to issue a Let's Encrypt certificate on boot (requires port 443). |
| `DB_PASSWORD` | *(generated)* | Must match `MYSQL_PASSWORD` in the `database:` service. |
| `PANASAURUS_ADMIN_EMAIL` | — | Initial admin email, seeded on first boot only. |
| `PANASAURUS_ADMIN_USERNAME` | `admin` | Initial admin username, first boot only. |
| `PANASAURUS_ADMIN_PASSWORD` | — | Initial admin password, first boot only. |

Mail settings (`MAIL_FROM`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`) sit in their own block at the top of the compose file. Until you point them at a real SMTP server, the stack ships a local `mail` service so password resets do not crash — but outbound email will not actually be delivered anywhere.

After editing the compose file, recreate the containers:

```bash
docker compose up -d
```

## Data directories

Everything you care about lives under `data/`:

| Directory | Contents |
|-----------|----------|
| `data/database` | MariaDB data — the panel's entire state |
| `data/var` | Panel application storage: eggs, attachments, theme assets |
| `data/logs` | Application and service logs |
| `data/extensions` | Installed Blueprint extensions |
| `data/nginx` | nginx configuration overrides |
| `data/certs` | Let's Encrypt certificates when `LE_EMAIL` is used |

Back these up like you would any database server. A nightly `tar` of `data/database` plus `data/var` plus a database dump covers most disasters:

```bash
docker compose exec -T database mariadb-dump -u panel -p"YOUR_DB_PASSWORD" panel > panel-$(date +%F).sql
```

## HTTPS

Two supported paths:

**Let's Encrypt built in.** Uncomment `LE_EMAIL` in the compose file, make sure port 443 is reachable, and restart. The container obtains and renews a certificate for the domain in `APP_URL` on boot.

**Reverse proxy in front.** Terminate TLS with your own nginx, Caddy, or Traefik, forward to the panel's HTTP port, and keep `APP_URL` on `https://`. This is the common choice when the proxy already serves other sites.

The panel also serves a public health endpoint for uptime monitors:

```bash
curl https://panel.example.com/api/health
```

## CLI inside the container

The `panasaurus` binary is the Blueprint CLI; the usual artisan commands work too:

```bash
docker compose exec panel panasaurus -list          # installed extensions
docker compose exec panel php artisan panasaurus:info    # version info
docker compose exec panel php artisan panasaurus:status  # service health
docker compose exec panel php artisan bp:meta            # refresh extension metadata
```
