---
id: panel-https
title: HTTPS
description: Two supported ways to serve the panel over TLS — reverse proxy or the built-in nginx.
sidebar_position: 4
slug: /panel-https
---

# HTTPS

Plain HTTP is fine for a lab. For anything reachable from the internet, terminate TLS. Two supported approaches; pick one, not both.

## Reverse proxy (recommended)

Run nginx, Caddy, or Traefik in front of the panel and keep the compose stack on its internal port. The proxy owns certificates and renewal; the panel just serves.

**1. Point the panel at the proxy.** In the compose file, set:

```yaml
environment:
  APP_URL: "https://panel.example.com"
  TRUSTED_PROXIES: "172.16.0.0/12"   # your docker/proxy subnet
```

`TRUSTED_PROXIES` matters: without it the panel logs the proxy's IP for every request instead of the client's, and session cookies can misbehave on scheme mismatches.

**2. Proxy to the panel's host port.** With the default `PANEL_PORT=80`, a minimal Caddy setup is:

```caddy
panel.example.com {
    reverse_proxy 127.0.0.1:80
}
```

nginx equivalent:

```nginx
server {
    listen 443 ssl http2;
    server_name panel.example.com;

    ssl_certificate     /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # websocket console
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Websockets carry the live console — don't strip the upgrade headers, or the console page will hang on "connecting".

**3. Restart and verify.** `docker compose up -d` after the env change, then `curl -fsS https://panel.example.com/api/health`.

## Built-in nginx

The panel image ships its own nginx. To serve TLS from inside the container:

1. **Mount certificates** into `./data/certs` (fullchain + key) — the compose file already maps the directory.
2. **Create the site config**: copy the commented `listen 443 ssl` block from [`.github/docker/default.conf`](https://github.com/panasaurus/panel/blob/main/.github/docker/default.conf) into `./data/nginx/panasaurus.conf`, filling in your domain and cert paths. The container picks up `data/nginx/*.conf` on boot.
3. **Open 443** on the host (`PANEL_PORT` stays for HTTP; add a 443 mapping in the compose ports section).
4. Restart: `docker compose up -d`.

Certificate renewal means replacing the files and restarting the panel container — if that sounds tedious, that's because it is. The reverse-proxy path automates renewal for free.

## The daemon is separate

Game-node TLS is **not** handled by the panel's proxy. The daemon provisions its own certificates — including fully automatic ACME — and its audience rules are stricter than the panel's. That's documented in [Daemon TLS & ACME](/docs/daemon-tls).

## Checklist

- [ ] `APP_URL` uses `https://`
- [ ] `TRUSTED_PROXIES` set (reverse proxy path)
- [ ] Websocket upgrade headers pass through
- [ ] `/api/health` green over the public URL
- [ ] Console connects in the browser (websocket check)
- [ ] Daemon nodes are reachable at their own TLS endpoints
