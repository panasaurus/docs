---
id: daemon-index
title: Daemon
description: The Panasaurus daemon — a Rust rewrite of Wings with the full v1.13.3 API contract, native ACME TLS, and real SFTP.
slug: /daemon
sidebar_position: 1
---

# Daemon

The Panasaurus Daemon (binary: `panasaurus-wings`) is a **Rust rewrite of Pterodactyl Wings**. One daemon runs per node; it drives the local Docker engine and manages containers, files, backups, SFTP, and the console for every server on that machine.

The rewrite goal is blunt: **100% API compatible with Wings v1.13.3** — every one of the 38 HTTP routes the panel and your tooling know how to call behaves identically — while adding performance, stability, and features upstream doesn't have.

[Install it](/docs/daemon-install) in one command if you're ready.

## What it is

| | |
|---|---|
| Language | Rust (stable toolchain, cross-compiled releases) |
| Binary | `panasaurus-wings` |
| Config | `/etc/panasaurus/wings.yml` (YAML) |
| API | Full Pterodactyl Wings v1.13.3 HTTP contract + new endpoints |
| Transport | Native TLS with **ACME (TLS-ALPN)** automatic certificates |
| SFTP | Built-in SSH server (Ed25519), extensions up to and including modern drafts |
| Backups | Six drivers: wings, s3, ddup-bak, restic, btrfs, zfs (+ pbs) |
| Registry | `ghcr.io/panasaurus/daemon` (Docker) · `panasaurus/daemon` releases (binaries) |

## Why rewrite the daemon

Upstream Wings is a Go program written against an older Go ecosystem: process management by hand, a custom SFTP layer, backup logic frozen at `tar.gz`, and disk quotas that are really just "check the size every N minutes". The Rust rewrite keeps the panel-facing contract identical and rebuilds the internals:

- **Real disk quotas** — optional `btrfs_subvolume`, `zfs_dataset`, `xfs_quota`, or (experimental) `fuse_quota` limiters enforce limits at the filesystem level instead of estimating them.
- **Inotify-aware disk checks** — usage updates incrementally from filesystem events, with periodic full rescans to stay honest.
- **Per-server bandwidth limits** — enforced in the container network namespace with `tbf + fq_codel` over netlink; works with Docker and Podman.
- **File history** — zstd-compressed per-file revision chains, so the file manager can show what changed.
- **Parallel everything** — file search, copy, delete, compress, and decompress operations are configurable thread pools.
- **Memory discipline** — jemalloc tuned per page size, streaming I/O for archives and transfers.

## Feature map

- [Configuration reference](/docs/daemon-configuration) — every option in `wings.yml`, annotated
- [TLS & ACME](/docs/daemon-tls) — automatic certificates, audience rules, port layout
- [API & features](/docs/daemon-features) — new endpoints, file manager upgrades, backup drivers
- [SFTP & shell](/docs/daemon-sftp) — the SSH server, extensions, and the `.wings` remote shell

## Compatibility notes

- **Panel**: works with the Panasaurus panel and stock Pterodactyl panels — the HTTP contract is the same. Panasaurus-only features light up when paired with the Panasaurus panel.
- **Eggs**: unchanged. Install scripts, file denylists, stop signals, and startup commands behave per the egg spec — denylists are *properly* enforced, an upstream gap.
- **Transfers**: server transfers work, including transferring backups alongside the server.

## Releases

Binaries ship from [GitHub releases](https://github.com/panasaurus/daemon/releases) for `x86_64` (glibc) and `aarch64` (static musl), with SHA-256 checksums and SBOMs. Docker images publish multi-arch to `ghcr.io/panasaurus/daemon`. The panel can trigger remote upgrades from the admin area unless `ignore_panel_wings_upgrades: true` is set.
