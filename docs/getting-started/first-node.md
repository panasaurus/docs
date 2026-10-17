---
id: first-node
title: Your first node
description: Wire the daemon to the panel, create allocations, and launch your first server.
sidebar_position: 4
slug: /first-node
---

# Your first node

A **node** is one machine running the daemon. This page walks the full loop: node exists in the panel, daemon is running, ports are allocated, and a game server is live.

If you used `bash install.sh --both`, steps 1–2 are already done — the installer prints a checklist instead.

## 1. Add the node in the panel

**Admin → Nodes → Add node**. The fields that matter:

| Field | What to put |
|---|---|
| Name | Anything (`node1`) |
| FQDN | The hostname the panel uses to reach the daemon — must resolve from the panel |
| Scheme | `HTTPS` (the daemon serves TLS natively, even with ACME self-signed staging certs) |
| Communicate over SSL | Enabled |
| Behind proxy | Only if you front the daemon with your own reverse proxy |
| Daemon Port | `8080` (default) |
| SFTP Port | `2022` (default) |

Save, then note the node's **numeric ID** and create an **application API key** (*Admin → Application API*) with read access to nodes. Those two values are what the daemon's `configure` command uses to fetch its configuration — the panel's node configuration tab also shows the exact deploy command with both filled in.

:::caution The address must match exactly
The daemon validates JWT audience claims against its own configured address. If the panel expects `node1.example.com:8080`, the daemon config's `api.host` must be `node1.example.com` and `jwt_audience` must include the port. Mismatch = `403` on every request. The installer and `configure` command set this up for you; you only meet this problem when hand-editing configs.
:::

## 2. Install the daemon

Already covered in [Daemon installation](/docs/daemon-install) — automated or manual. When the daemon starts and the panel's node page shows a green dot, the handshake worked.

## 3. Allocate ports

Every server needs at least one port. On the node's page: **Allocations → Create**. Enter the IP the server should bind to (usually the public IPv4, or `0.0.0.0` to let the daemon assign on boot) and a port or port range:

```text
IP          Alias                 Port
203.0.113.10  node1.example.com   25565-25575
```

The alias is what users see and connect to. Ranges are expanded into individual allocations. Repeat per IP — the daemon supports IPv4 and IPv6 allocations on the same node (`docker.network.interfaces.v4/v6` in the daemon config controls this too).

## 4. Load an egg and create a server

1. Grab an egg from the [egg marketplace](https://eggs.panasaurus.com) and import it under **Admin → Nests** (or use one of the nests bundled with the panel).
2. Make sure the egg's Docker image points at a Panasaurus image — e.g. `ghcr.io/panasaurus/images:java_21` for modern Minecraft. Images shipped by the panel's default nests already do.
3. **Admin → Servers → Create**: pick the node, the egg, an allocation, set memory/CPU/disk limits, and create.

The daemon pulls the image, runs the egg's install script in a container, then boots the server. Watch it live in the server console — or from the node side:

```bash
journalctl -u panasaurus-wings -f
docker ps
```

## 5. Sanity checks

| Check | Command / place |
|---|---|
| Node green | Panel → Admin → Nodes |
| API reachable | `curl -sk https://node1.example.com:8080/openapi.json` |
| SFTP reachable | `sftp -P 2022 user.server-uuid@node1.example.com` |
| Server boots | Server console in the panel |
| Health of the machine | `GET /api/stats` on the daemon, or the node overview graph |

## Common first-node problems

**Node stays red.** The panel can't reach the daemon: wrong FQDN, firewall on 8080, or TLS audience mismatch. `journalctl -u panasaurus-wings` on the node shows the daemon side; the panel's logs show the other.

**Install container fails immediately.** The egg's install image can't be pulled. Check `docker pull ghcr.io/panasaurus/images:installer_debian` manually on the node.

**Server starts then stops.** Usually out-of-memory (check the server's limits vs. the host's free RAM) or a bad startup command in the egg. The daemon logs the container exit code either way.

**Port conflicts.** Allocations must be free on the host — the daemon binds them directly. If something else on the machine owns 25565, pick another range.

Stuck? The [Discord](https://discord.gg/tszvW9zKN7) has a support channel with people who have made every one of these mistakes already.
