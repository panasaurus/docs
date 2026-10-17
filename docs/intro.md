---
title: What is Panasaurus?
description: Panasaurus is a game server management platform — a Docker-native panel with Blueprint built in, a Rust Wings daemon, and container images on ghcr.io.
sidebar_label: Introduction
---

# What is Panasaurus?

Panasaurus is a game server management platform built on the proven Pterodactyl and Pyrodactyl lineage, rebuilt with a modern stack and shipped as three parts that are designed to run together — but drop into almost any existing setup:

| Component | What it is | Where it lives |
|-----------|------------|----------------|
| **Panel** | Laravel 12 + React 19 control plane with the Blueprint extension framework pre-installed. Runs entirely in Docker — installed via Docker, extended via Docker. | [github.com/panasaurus/panel](https://github.com/panasaurus/panel) |
| **Wings** | The node daemon, rewritten in Rust. Drop-in compatible with the Wings v1.13.3 HTTP API the panel speaks, with native TLS, multi-driver backups, and per-server bandwidth limits. | [github.com/panasaurus/wings](https://github.com/panasaurus/wings) |
| **Images** | The core container images (the yolks) — Java, Node.js, Python, Go, Rust, games, and installers, published multi-arch to a single GHCR repository. | `ghcr.io/panasaurus/images` |

Everything is glued together by one installer: `install.sh` sets up the panel, Wings, or both on a fresh apt-based server with a single command.

## Why Panasaurus

- **Blueprint built in.** The extension framework ships pre-installed — no patching, no version drift. Community extensions for Blueprint and Pterodactyl work out of the box, and the admin area has a built-in marketplace with search and one-click install instructions.
- **Docker all the way down.** The panel is a multi-stage container image with healthchecks and tuned PHP-FPM. Wings manages server containers over the Docker socket. Your host stays clean; your stack stays reproducible.
- **A daemon that keeps up.** Wings in Rust means faster cold starts, lower idle memory, and an OpenAPI document for every endpoint at `/openapi.json` instead of guessing from the panel source.
- **One image namespace.** Every core image lives in `ghcr.io/panasaurus/images` under a single tag scheme, so eggs, retention policies, and access control stay simple.

## Quick start

On a fresh Ubuntu 22.04+ or Debian 12 machine, as root:

```bash
curl -fsSL https://panasaurus.com/install.sh | bash
```

You will be asked whether to install the panel, Wings, or both. The installer handles Docker, generates credentials, writes the systemd unit, and waits for health checks. Prefer explicit flags?

```bash
bash install.sh --panel
bash install.sh --wings --panel-url https://panel.example.com \
  --node-url https://node.example.com:8081 --token YOUR_API_KEY --node 1
```

The full flag reference is on the [installer page](/docs/installer). Panel setup continues in [Panel installation](/docs/panel/installation), node setup in [Wings installation](/docs/wings/installation).

## Eggs and community

Ready-made eggs for popular games are published at the [eggs marketplace](https://eggs.panasaurus.com) — download an `.egg` file, import it from **Admin → Nests**, and deploy. If something breaks or you want to request an egg, join the [Panasaurus Discord](https://discord.gg/tszvW9zKN7); the installer and these docs point there too.

## Credits

Panasaurus stands on the shoulders of giants:

- [Pterodactyl](https://pterodactyl.io) — the original panel, by Dane Everitt and contributors
- [Pyrodactyl](https://pyrodactyl.dev) — the modernized fork the panel builds on
- [Blueprint](https://blueprint.zip) — the extension framework, by prpl.wtf and contributors
- [Calagopus Wings](https://calagopus.com) — the Rust daemon rewrite Wings builds on
