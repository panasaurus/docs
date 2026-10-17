---
id: quick-start
title: Quick start
description: One command installs the Panasaurus panel, daemon, or both — Docker, credentials, systemd service and all.
sidebar_position: 1
slug: /quick-start
---

# Quick start

The automated installer does everything a fresh server needs: system dependencies, Docker Engine, the compose stack for the panel, the `panasaurus-wings` binary plus systemd unit for the daemon, generated secrets, and a firewall-aware summary at the end.

```bash
curl -fsSL https://docs.panasaurus.com/install.sh | bash
```

Prefer to read before you run? Fetch the script and inspect it, then execute it locally:

```bash
curl -fsSL https://docs.panasaurus.com/install.sh -o install.sh
less install.sh          # it's one file, heavily commented
bash install.sh
```

The same script also lives in the [docs repository](https://github.com/panasaurus/docs/blob/main/static/install.sh) — read it there any time, it's one file, heavily commented.

## What it asks

The installer is a menu, not a wizard with 40 questions:

```text
   ___              _                        _
  | _ \__ _ _  _ __| |__ _ _  _ ___ __ ___ _(_)___
  |  _/ _` | || / _` / _` | || (_-</ _|/ _ \ '_(_-<
  |_| \__,_|\_,_\__,_\__, |\_,_/__\__|\__,_|_|/__/
                      |___/        the dino-strong platform

  1) Install the Panel
  2) Install the Daemon (wings)
  3) Install both (panel + daemon on this machine)
  4) Exit
```

- **Panel** — asks for a public URL (or derives one), generates database and admin credentials, boots the compose stack, waits for the health endpoint to go green, then prints your admin login once.
- **Daemon** — asks for the panel URL, an **application API key**, and the **node ID** from *Admin → Nodes → Add node*, downloads the matching `panasaurus-wings` release for your architecture, writes `/etc/panasaurus/wings.yml`, installs the systemd service, and verifies the panel handshake.
- **Both** — runs the panel flow first, then reuses the panel URL for the daemon so you only ever type it once.

Every prompt has a flag equivalent, so the whole thing is scriptable:

```bash
# panel only, non-interactive
bash install.sh --panel --panel-url https://panel.example.com

# daemon only, non-interactive
bash install.sh --wings --panel-url https://panel.example.com --token <APPLICATION_API_KEY> --node 1

# both, accepting every default
bash install.sh --both --yes
```

Run `bash install.sh --help` for the full flag list (`--port`, `--admin-email`, `--install-dir`, `--no-firewall`, and more).

## What "panel" does under the hood

1. **Checks** — requires root (or sudo), a supported distro (Ubuntu 20.04+, Debian 11+), and either Docker Engine 24+ or permission to install it via the official convenience script.
2. **Fetches the compose stack** into `/opt/panasaurus/panel` from the [`panasaurus/panel`](https://github.com/panasaurus/panel) repository — no build step, pinned images only.
3. **Generates secrets** — MariaDB password, Redis password, and a 24-character admin password from `/dev/urandom`; nothing is hardcoded.
4. **Boots MariaDB 11, Redis 7, and `ghcr.io/panasaurus/panel`** as one compose project with healthchecks and restart policies.
5. **Waits for `GET /api/health`** to return a healthy JSON document, then prints:

```text
  ╔══════════════════════════════════════════════════════╗
  ║              Panasaurus installed successfully       ║
  ╠══════════════════════════════════════════════════════╣
  ║  URL:      https://panel.example.com                 ║
  ║  Admin:    admin@panasaurus.local                    ║
  ║  Password: the-password-shown-once                   ║
  ╠══════════════════════════════════════════════════════╣
  ║  Extensions (Blueprint built in):                    ║
  ║    docker compose exec panel panasaurus -help        ║
  ╚══════════════════════════════════════════════════════╝
```

## What "daemon" does under the hood

1. **Installs Docker Engine** if missing — the daemon drives the Docker API, so a node without Docker is just a computer.
2. **Creates directories** — `/etc/panasaurus`, `/var/lib/panasaurus/{var,backups,logs,mounts}`. The service runs as root (the daemon drives the Docker socket and enforces per-server bandwidth limits in container network namespaces, both of which need elevated capabilities).
3. **Downloads the release binary** matching your machine (`panasaurus-wings-x86_64-linux` or the static `panasaurus-wings-aarch64-linux` build) from [`panasaurus/daemon` releases](https://github.com/panasaurus/daemon/releases), verifies it is a valid ELF executable, prints its SHA-256 for the release page's records, and installs it to `/usr/local/bin/panasaurus-wings`.
4. **Generates the config** — `panasaurus-wings configure --panel-url ... --token ... --node <id>` fetches the node's real configuration from the panel's application API and writes it to `/etc/panasaurus/wings.yml`.
5. **Installs and starts `panasaurus-wings.service`** via the daemon's own `service-install` command, then checks that the panel can reach the daemon on port 8080 and that SFTP is listening on 2022.

## Ports the installer opens

| Component | Port | Purpose |
|---|---|---|
| Panel | 80 / 443 | Web + API traffic |
| Daemon | 8080 (default) | Panel ↔ daemon HTTPS |
| Daemon | 2022 (default) | SFTP |
| Game servers | 25565, 27015, ... | Whatever your allocations define |

If `ufw` is active, the installer opens exactly these ports and nothing else. It never touches an existing firewall beyond adding allows, and `--no-firewall` skips the step entirely on hosts where a cloud security group does the job.

## After the installer

- [Add your first node](/docs/first-node) — or let the "both" flow's printed checklist walk you through it.
- Load eggs from the [marketplace](https://eggs.panasaurus.com) so your new node has something to run.
- Install extensions with `panasaurus -install <extension>` inside the panel container — see [Extensions](/docs/extensions).

:::tip Keep the printed credentials
The admin password is shown **once**. If you lose it, recover access with:

```bash
docker compose -f /opt/panasaurus/panel/docker-compose.yml exec panel \
  php artisan user:update
```
:::

## Uninstalling

The installer leaves a clean uninstall path in the same directory it created:

```bash
# panel
cd /opt/panasaurus/panel && docker compose down -v

# daemon
systemctl disable --now panasaurus-wings
rm -f /etc/systemd/system/panasaurus-wings.service /usr/local/bin/panasaurus-wings
rm -rf /etc/panasaurus /var/lib/panasaurus
```

Server data lives under `/var/lib/panasaurus` (daemon) and `/opt/panasaurus/panel/data` (panel) — delete those only when you mean it.
