---
title: Wings installation
description: Install the Panasaurus Wings daemon — Rust node daemon for the panel — with the automated installer or by hand.
sidebar_label: Install Wings
---

# Wings installation

Wings is the daemon that actually runs your servers: it talks to the Docker daemon, streams console output, serves files and SFTP, and takes backups. One Wings instance runs per physical node, and it registers with the panel as a node.

## Requirements

- Ubuntu 22.04+ or Debian 12 (apt-based, systemd)
- amd64 or arm64 CPU
- Docker — the installer sets it up if missing, since Wings cannot run servers without it
- An reachable panel with a node created for this machine

## Panel-side preparation

Before installing on the node, collect three values from the panel:

1. **A node.** Create one under **Admin → Nodes**. Set the *Connection Address* to the URL the panel will use to reach this machine — scheme and port included, for example `https://node.example.com:8081`. Note the numeric node ID from the URL after saving.
2. **An application API key.** Generate one under **Admin → Application API**. Wings uses it to pull its own configuration from the panel on first boot.
3. **That is it** — the daemon configures everything else itself.

:::warning The connection URL must match exactly
The connection URL is embedded in the daemon's config as its JWT audience. It has to match the panel's node address byte for byte — including the `https://` and the port. A mismatch shows up as authentication failures between panel and daemon, not as a config error, and it is the single most common Wings support question on the [Discord](https://discord.gg/tszvW9zKN7).
:::

## Option A — the automated installer

```bash
bash install.sh --wings --panel-url https://panel.example.com \
  --node-url https://node.example.com:8081 \
  --token YOUR_APPLICATION_API_KEY --node 1
```

The installer:

1. Detects the architecture and installs build dependencies (curl, libssl-dev, e2fsprogs, and friends)
2. Downloads `wings-linux-amd64.tar.gz` (or `arm64`) from the [Wings releases](https://github.com/panasaurus/wings/releases)
3. Installs the binary to `/usr/local/bin/panasaurus-wings` — using the prebuilt executable from the release when present, otherwise compiling the Rust source with `cargo build --locked --release` (rustup is installed automatically if needed)
4. Prints the binary's SHA-256 so you can pin it in provisioning
5. Generates `/etc/panasaurus/config.yml` with the daemon's own `--configure` command — the API token travels through an environment variable, never a process argument
6. Asks the daemon to emit its own systemd unit, enables it, and starts the service
7. Waits for the API to answer on port 8080 and opens ports 8080 and 2022 in your firewall

When it finishes, check the panel: the node's heart icon should turn green within a minute.

## Option B — manual installation

Download a release, unpack, and install the binary:

```bash
curl -fsSLO https://github.com/panasaurus/wings/releases/latest/download/wings-linux-amd64.tar.gz
tar -xzf wings-linux-amd64.tar.gz
install -m 0755 panasaurus-wings /usr/local/bin/panasaurus-wings
```

Create the configuration. The destination file must **not** exist yet, and the token is read from the environment:

```bash
mkdir -p /etc/panasaurus /var/lib/panasaurus
export PANASAURUS_APPLICATION_TOKEN="YOUR_APPLICATION_API_KEY"
panasaurus-wings --configure \
  --panel-url https://panel.example.com \
  --node-id 1 \
  --token-env PANASAURUS_APPLICATION_TOKEN \
  --node-url https://node.example.com:8081 \
  --config /etc/panasaurus/config.yml
unset PANASAURUS_APPLICATION_TOKEN
chmod 0600 /etc/panasaurus/config.yml
```

Generate and install the systemd unit the same way the installer does — the daemon writes its own unit so the exec line always matches the binary:

```bash
panasaurus-wings --systemd-unit --config /etc/panasaurus/config.yml \
  > /etc/systemd/system/panasaurus-wings.service
systemctl daemon-reload
systemctl enable --now panasaurus-wings
```

:::note OpenRC
The installer only automates systemd. On OpenRC, install the binary and config exactly as above and write your own service file — the unit the daemon generates is a good template for the `command`, `arguments`, and `depend` lines.
:::

## Verifying the installation

```bash
systemctl status panasaurus-wings
journalctl -u panasaurus-wings -f
curl -k https://127.0.0.1:8080/openapi.json | head -c 200
```

A healthy daemon answers `/openapi.json` with its full API document. If the panel still shows the node offline after a couple of minutes, the [configuration reference](/docs/wings/configuration) and the TLS pages cover the usual suspects — `jwt_audience` mismatches first among them.
