---
title: Automated installer
description: install.sh reference — flags, environment variables, and what the Panasaurus installer changes on your system.
sidebar_label: The installer
---

# Automated installer

`install.sh` is the one command that turns a bare apt-based server into a running Panasaurus panel, a Wings node, or both. It detects your distribution, installs Docker if needed, downloads verified release artifacts, generates secrets, and configures systemd services — then tells you exactly where everything landed.

```bash
curl -fsSL https://panasaurus.com/install.sh | bash
```

Run it with no flags and it shows an interactive menu:

```text
  1) Install the Panel
  2) Install Wings
  3) Install both
  4) Exit
```

:::note Requirements
Root access (the script re-executes itself with `sudo`), an apt-based distribution with systemd — Ubuntu 22.04+ and Debian 12 are the tested targets — and an internet connection. Docker is installed automatically if missing.
:::

## Modes

| Flag | What it does |
|------|--------------|
| `--panel` | Install the panel into `/opt/panasaurus/panel` |
| `--wings` | Install Wings (the node daemon) |
| `--both` | Install both on this machine |

## Panel options

| Flag | Default | Description |
|------|---------|-------------|
| `--panel-url URL` | `http://<primary-ip>:<port>` | Public URL of the panel, written to `APP_URL` |
| `--port PORT` | `80` | Host port the panel listens on |
| `--admin-email EMAIL` | `admin@panasaurus.local` | Initial admin account email |
| `--install-dir DIR` | `/opt/panasaurus/panel` | Where the compose stack lives |
| `--version TAG` | `latest` | Release tag to download |

The initial admin username can be set with the `PANASAURUS_ADMIN_USERNAME` environment variable (default `admin`).

## Wings options

| Flag | Default | Description |
|------|---------|-------------|
| `--panel-url URL` | *(prompted)* | Panel URL used when generating the config |
| `--node-url URL` | *(prompted)* | Node connection URL — must match the panel's node address, **including the port** |
| `--token KEY` | *(prompted)* | Panel application API key |
| `--node ID` | `1` | Numeric node ID from the panel |
| `--daemon-port PORT` | `8080` | Local Wings API port |
| `--sftp-port PORT` | `2022` | Wings SFTP port |
| `--version TAG` | `latest` | Release tag to download |

:::warning Node URLs and TLS
The node URL must match the connection address configured for the node in the panel, including scheme and port. If the URL is `https://`, the panel must be able to reach Wings over valid TLS — either native TLS on the daemon (see [Wings TLS](/docs/wings/tls)) or a TLS reverse proxy.
:::

## Common flags

| Flag | Description |
|------|-------------|
| `--yes`, `-y` | Accept all defaults, never prompt |
| `--no-firewall` | Do not touch ufw or firewalld |
| `--help`, `-h` | Print the banner and usage |

## What the installer does

**Panel mode** downloads `panel.tar.gz` and its `CHECKSUM` file from the [panel releases](https://github.com/panasaurus/panel/releases), verifies the archive with `sha256sum -c`, extracts it into `/opt/panasaurus/panel`, generates database and admin credentials, substitutes them into `docker-compose.yml`, pulls the images, starts the stack, and polls `GET /api/health` until the panel reports healthy. It finishes by printing the panel URL, admin email, and a one-time admin password.

**Wings mode** detects your architecture (`amd64` or `arm64`), installs build dependencies, downloads the matching `wings-linux-<arch>.tar.gz` release, and installs the binary to `/usr/local/bin/panasaurus-wings`. If the archive contains a prebuilt ELF executable it is used directly; otherwise the Rust source is compiled with `cargo build --locked --release` (rustup is installed automatically if needed). It then generates `/etc/panasaurus/config.yml` via the daemon's own `--configure` command — the API token is passed through an environment variable, never a process argument — creates data storage under `/var/lib/panasaurus`, asks the daemon to emit its own systemd unit, and waits for the API to answer on port 8080.

**Both modes** open the required ports in ufw or firewalld unless `--no-firewall` is passed: 80 and 443 (plus `--port`) for the panel, 8080 and 2022 for Wings.

## Files and paths

| Path | Purpose |
|------|---------|
| `/opt/panasaurus/panel` | Panel compose stack, data, and logs |
| `/usr/local/bin/panasaurus-wings` | Wings binary |
| `/etc/panasaurus/config.yml` | Wings configuration (mode `0600`) |
| `/var/lib/panasaurus` | Server data storage |
| `/etc/systemd/system/panasaurus-wings.service` | Generated systemd unit |

## Non-interactive installs

Pass `--yes` and every flag explicitly and the installer never prompts — useful for provisioning scripts and cloud-init:

```bash
PANASAURUS_ADMIN_EMAIL=me@example.com bash install.sh --panel --yes \
  --panel-url https://panel.example.com

bash install.sh --wings --yes \
  --panel-url https://panel.example.com \
  --node-url https://node.example.com:8081 \
  --token "$API_KEY" --node 1
```

Secrets are printed once at the end of the run — capture them from your provisioning log if you rely on them.

## Updating

Re-running the installer is safe. Panel mode preserves an existing `docker-compose.yml` and its secrets, then pulls newer images and restarts the stack. Wings mode leaves an existing `/etc/panasaurus/config.yml` untouched; pass `--version v1.2.0` to pin a specific release when upgrading the binary.
