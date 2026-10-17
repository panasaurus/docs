---
id: panel-troubleshooting
title: Troubleshooting
description: The panel problems that actually happen, and how to fix each one.
sidebar_position: 6
slug: /panel-troubleshooting
---

# Troubleshooting

Every entry here is a real failure mode, ordered roughly by how often it's the answer in support.

## Panel loops on "not healthy"

The boot log names the cause:

```bash
docker compose logs panel | tail -50
```

Almost always one of:

- **`DB_PASSWORD` mismatch** — the compose file's `DB_PASSWORD`, `MYSQL_PASSWORD`, and the database volume's stored password disagree. The database keeps its password from the **first** boot; the cleanest fix is `docker compose down -v` (wipes the volume, fresh start) or aligning the env to what the volume has.
- **MariaDB still starting** — first boot can take a minute; the panel retries and starts once the DB accepts connections. If it never goes green, the DB logs (`docker compose logs database`) say why.
- **Port already bound** — something else owns 80/443. Change `PANEL_PORT` in the compose file.

## 401 or 404 on `/api/health`

`/api/health` is public by design. If a proxy returns 401, your auth layer is intercepting it — exclude the route. If it 404s, the proxy is rewriting paths; forward `/` unchanged.

## Console won't connect (websocket)

The live console rides websockets through the same origin. Symptoms: console page hangs on "connecting", power buttons do nothing.

- Reverse proxy missing upgrade headers — `proxy_http_version 1.1;` plus `Upgrade`/`Connection` headers (see [HTTPS](/docs/panel-https)).
- `APP_URL` scheme mismatch — panel served over `https://` but `APP_URL` says `http://`, so the browser blocks the mixed-content websocket.
- Cloudflare proxying: enable Websockets in the network settings.

## Extension assets 404

Extensions serve public files through symlinks created at install time. If assets 404 after a container rebuild or image upgrade:

```bash
docker compose exec panel panasaurus -rerun-install
```

That re-creates symlinks and refreshes caches. If a specific extension still fails, `panasaurus -query <name>` shows what the framework knows about it.

## Emails not sending

Mail settings live in the admin area under **Settings → Mail**. Test with the "Send test email" button there. Behind a proxy, remember the panel connects *out* to your SMTP relay directly — outbound 25/587 must be open, and many VPS providers block port 25 by default.

## Slow page loads

The panel preloads OPcache JIT and serves prebuilt assets; slowness is usually:

- **First boot after upgrade** — caches rebuild once; the second request is fast.
- **Missing gzip** — happens when a reverse proxy recompresses or strips it; enable it at the proxy.
- **Queue backlog** — emails and long jobs run through the queue worker; check `docker compose logs panel | grep queue`.

## Where to look first, in order

1. `docker compose logs panel` — the panel's own story
2. `docker compose logs database redis` — supporting cast
3. `curl -fsS http://localhost:<port>/api/health | jq` — is it alive
4. `docker compose exec panel php artisan panasaurus:status` — service-by-service check
5. [Discord](https://discord.gg/tszvW9zKN7) support channel — bring the logs from steps 1–3
