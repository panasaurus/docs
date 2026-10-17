---
id: daemon-install
title: Daemon installation
description: Install panasaurus-wings on a game node — automated, manual binary, or Docker — with systemd, checksums, and directory layout.
sidebar_position: 3
slug: /daemon-install
---

# Daemon installation

The Panasaurus Daemon (`panasaurus-wings`) runs on every machine that hosts game servers. It talks to the panel over HTTPS, drives the local Docker engine, and manages containers, files, backups, and SFTP for the node. One daemon per node.

The installer does this all for you:

```bash
curl -fsSL https://panasaurus.com/install.sh | bash
```

Choose **2) Install the Daemon** and have the panel's **auto-deploy token** ready (created in *Admin → Nodes → Add node*). This page documents what it does, plus the manual paths.

## Requirements

| | |
|---|---|
| OS | Ubuntu 20.04+, Debian 11+ recommended |
| Docker | Engine 24+ — the daemon drives it via the socket |
| RAM | Whatever your servers need, plus ~100 MB for the daemon |
| Kernel | `cgroup v2` recommended; bandwidth limits need `CAP_NET_ADMIN` |

## Before you install: create the node

The daemon needs to know which node it is. In the panel:

1. Log in as an administrator and create an **application API key** (*Admin → Application API → Create*) with read permission on nodes.
2. Open **Admin → Nodes → Add node**. Fill in the FQDN the daemon will be reachable at (e.g. `node1.example.com`), leave HTTPS enabled. Note the **node's numeric ID** from the list.
3. Keep both handy — the daemon's `configure` command fetches the node's full configuration from the panel's application API using the key and node ID.

The node's address must match what the daemon will present — if the panel is configured to reach `node1.example.com:8080`, the daemon's TLS certificate and `jwt_audience` must cover exactly that host and port. See [TLS & ACME](/docs/daemon-tls) for how the daemon self-provisions certificates.

## Automated install

```bash
bash install.sh --wings --panel-url https://panel.example.com --token <APPLICATION_API_KEY> --node 1 --yes
```

The installer will:

1. Install Docker Engine if missing (official upstream script).
2. Create the directory layout below (`/etc/panasaurus`, `/var/lib/panasaurus`).
3. Download the release binary for your architecture from [`panasaurus/daemon` releases](https://github.com/panasaurus/daemon/releases), verify it's a valid executable, and install it to `/usr/local/bin/panasaurus-wings`.
4. Run `panasaurus-wings configure --panel-url ... --token ... --node <id>` to fetch the node configuration into `/etc/panasaurus/wings.yml`.
5. Install and start `panasaurus-wings.service` using the daemon's built-in `service-install` command.
6. Verify the handshake against the panel and report any firewall rules needed.

## Manual install

Some people enjoy suffering. Here is the whole thing:

```bash
# 1. directories
mkdir -p /etc/panasaurus /var/lib/panasaurus/{var,backups,logs,mounts}

# 2. binary (x86_64 glibc build; aarch64 machines use the static musl build)
MACHINE=x86_64   # or: aarch64
curl -fsSL -o /usr/local/bin/panasaurus-wings \
  "https://github.com/panasaurus/daemon/releases/latest/download/panasaurus-wings-${MACHINE}-linux"
chmod +x /usr/local/bin/panasaurus-wings
sha256sum /usr/local/bin/panasaurus-wings   # compare with the release page

# 3. configuration — replace KEY and ID with your application API key and node ID
panasaurus-wings configure \
  --panel-url https://panel.example.com \
  --token KEY \
  --node ID \
  --override

# 4. service
panasaurus-wings service-install --override --init systemd   # writes + enables the unit
systemctl status panasaurus-wings
```

`configure` fetches `GET /api/application/nodes/{id}/configuration` from the panel and writes the result — remote URL, tokens, ports, TLS settings — so what lands in `wings.yml` is exactly what the panel expects. `service-install` is a daemon CLI command that writes the systemd unit (systemd or OpenRC), runs `daemon-reload`, and enables the service. The daemon also speaks an **enrollment flow** (`configure --enroll <code>`) for panel-driven zero-touch pairing, and accepts a raw `--join-data` payload — those are what the panel's deploy command uses.

### Directory layout

| Path | Purpose |
|---|---|
| `/etc/panasaurus/wings.yml` | Node configuration (the file you'll edit) |
| `/etc/panasaurus/` | TLS certificates when the daemon terminates TLS itself |
| `/var/lib/panasaurus/var/` | Server working directories |
| `/var/lib/panasaurus/backups/` | Local backups (tar/zstd/7z depending on config) |
| `/var/lib/panasaurus/logs/` | Daemon + server logs |
| `/var/lib/panasaurus/mounts/` | Temporary mountpoints for virtual mounts |

### Systemd unit

`service-install` writes this — shown here so you know what's on your system:

```ini
[Unit]
Description=Panasaurus Daemon
After=docker.service
Requires=docker.service
PartOf=docker.service

[Service]
User=root
KillMode=process
LimitNOFILE=4096
PIDFile=/run/panasaurus-wings/daemon.pid
ExecStart=/usr/local/bin/panasaurus-wings
Restart=on-failure
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

It runs as root on purpose: the daemon drives the Docker socket, manages container network namespaces for bandwidth limits, and owns the server directories. An OpenRC unit is generated instead on OpenRC systems (`--init openrc`), and `--lxcfs` adds a dedicated lxcfs service for honest per-container CPU/RAM reporting.

## Docker install

If you want the daemon itself containerized:

```bash
docker run -d --name panasaurus-wings \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/panasaurus:/var/lib/panasaurus \
  -v /etc/panasaurus:/etc/panasaurus \
  -p 8080:8080 -p 2022:2022 \
  ghcr.io/panasaurus/daemon:latest --config /etc/panasaurus/wings.yml
```

The container shares the host's Docker socket and data directories — that's the point: it *manages* host containers.

## Verifying

```bash
# the daemon answers on its API port with its OpenAPI document
curl -sk https://127.0.0.1:8080/openapi.json | head -c 200

# logs, the usual first stop
journalctl -u panasaurus-wings -f
```

In the panel, the node's status dot should turn green within a few seconds of daemon startup. From there, [create allocations](/docs/first-node#3-allocate-ports) and launch your first server.

## Upgrading

```bash
panasaurus-wings --version
bash install.sh --wings ...   # re-run; it upgrades in place
```

Or let the panel do it: the daemon exposes a remote upgrade endpoint the panel can call from *Admin → Nodes*, unless disabled with `ignore_panel_wings_upgrades: true`.
