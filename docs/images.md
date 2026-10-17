---
title: Panasaurus Images
description: Core container images for the Panasaurus platform — every image in one GHCR repository, rebuilt monthly, multi-arch.
sidebar_label: Container images
---

# Panasaurus Images

Panasaurus Images is the evolution of Pterodactyl's yolks: the core container images eggs run on, rebuilt monthly against maintained bases and published to a **single** registry namespace — `ghcr.io/panasaurus/images`. Eggs reference one image namespace, retention policies apply uniformly, and every image builds for `linux/amd64` and `linux/arm64` unless noted otherwise.

```bash
docker pull ghcr.io/panasaurus/images:java_21
```

## What is available

All images live in one GHCR repository and are distinguished by tag:

| Group | Examples |
|-------|----------|
| Java (Temurin + OpenJ9) | `java_8` … `java_26`, `*_j9` variants, `java_latest` |
| Node.js | `nodejs_12` … `nodejs_24`, `nodejs_latest` |
| Python | `python_3.7` … `python_3.13`, `python_latest` |
| Go | `go_1.14` … current, `go_latest` |
| Rust / .NET | `rust`, `dotnet_7`, `dotnet_8`, `dotnet_9` |
| Base OS | `alpine`, `debian` |
| Games | `rust`, `source`, `hytale`, `conan_exiles` |
| Installers | `installer_*` variants used by egg install scripts |

The full, always-current table lives in the [images repository](https://github.com/panasaurus/images). New language releases are added as they ship — when Java 26 came out of preview it appeared as `java_26` without any panel change.

## How it is built

One merged CI pipeline builds everything: a lint stage (hadolint, shellcheck) gates every Dockerfile and entrypoint, a paths filter builds only what changed, and dependent images build in a second wave — so `hytale` always waits for a fresh `java_25` instead of silently reusing an old base. The image matrix is machine-readable (`.github/images.json`) with a consistency checker in CI, so a Dockerfile and its entry in the matrix cannot drift apart.

Eggs stay out of the build path entirely: they reference whatever tag suits them, and the panel's bundled eggs already point at `ghcr.io/panasaurus/images`.

## Switching an existing setup

Existing Pterodactyl or Pelican nodes can pull the same images by name — the tags are drop-in equivalents of the old `ghcr.io/pterodactyl/yolks:*` naming. To migrate in bulk, see [Migrating to Panasaurus](/docs/migration), which includes the SQL one-liner for rewriting egg image references on an existing panel, plus a mapping table of old tag to new tag.
