---
id: images-index
title: Images
description: The Panasaurus image catalog — 58 multi-arch container images, one GHCR namespace, one CI workflow.
slug: /images
sidebar_position: 1
---

# Images

Every game server runs in a container. Panasaurus Images is the catalog: **58 container images** rebuilt monthly against maintained bases, published multi-arch to a single namespace — `ghcr.io/panasaurus/images` — and distinguished by tag. It's the evolution of Pterodactyl yolks, reworked for the Panasaurus platform.

```bash
docker pull ghcr.io/panasaurus/images:java_21
docker run ghcr.io/panasaurus/images:java_21
```

## Why one namespace

Upstream yolks ship one Docker repository per image (`ghcr.io/pterodactyl/yolks:java_17` style was already a convenience, not the original layout). Panasaurus keeps **one** repository and tags everything under it. That means:

- Eggs reference exactly one image namespace — no guessing which repo holds which runtime.
- Registry retention policies, access tokens, and pull quotas apply in one place.
- `docker pull ghcr.io/panasaurus/images:<tag>` is always the shape of the command.

The full tag list lives on the [tags page](/docs/images-tags).

## What's in the catalog

| Group | Tags |
|---|---|
| Java | HotSpot (Temurin) and OpenJ9 (Semeru), **Java 8 → 26**, plus `java_latest` |
| Node.js | 12 → 24, plus `nodejs_latest` |
| Python | 3.7 → 3.13, plus `python_latest` |
| Go | 1.14 → 1.26, plus `go_latest` |
| .NET | 7, 8, 9, plus `dotnet_latest` |
| Base OS | `alpine` (3.22), `debian` (bookworm) |
| Game servers | `source`, `conan_exiles`, `rust`, `hytale` |
| Egg installers | `installer_alpine`, `installer_debian` |

Every image supports **amd64 + arm64** unless the platform itself doesn't (Source games and Conan are amd64-only because their engines are).

## How they're built

One workflow, every image — upstream shipped seven near-identical GitHub Actions workflows; Panasaurus merges them into a single [`build.yml`](https://github.com/panasaurus/images/blob/main/.github/workflows/build.yml) driven by a single matrix source (`.github/images.json`):

- **Path filtering** — a push touching `java/**` only rebuilds the java group; CI tooling changes rebuild everything.
- **Dependency waves** — images derived from other Panasaurus images (`hytale` builds on `java_25`) build in a second wave, so their base is always fresh.
- **Monthly rebuilds** — the schedule keeps every image patched even when nothing changes.
- **Layer caching** — per-image GHA cache scopes make rebuilds incremental.
- **Manual dispatch** — trigger with a comma-separated image list or a force-all switch.

Every image is linted (hadolint + shellcheck) and the build matrix is verified against the filesystem on every push — the registry and the repo can't drift.

## Optimizations baked in

- Pinned, maintained bases (Alpine 3.22, Debian Bookworm) instead of floating or EOL tags.
- `--no-install-recommends` everywhere, apt/apk caches purged in the same layer — smaller images, fewer attack surfaces.
- Exec-form `ENTRYPOINT` with `--chmod=755` copies — correct signal handling (your servers actually stop when you press stop), no extra layers.
- Full OCI label set (title, description, source, vendor, licenses) for clean registry metadata.
- End-of-life versions warn on boot, so operators migrate before images retire.

## Using and migrating

- [Tags reference](/docs/images-tags) — the complete registry table
- [Migrating from yolks](/docs/images-migration) — old → new map plus a bulk SQL update for your panel database

Eggs pre-tuned for these images live at the [egg marketplace](https://eggs.panasaurus.com).
