---
id: images-tags
title: Tags reference
description: Every image tag in ghcr.io/panasaurus/images, with platforms.
sidebar_position: 2
slug: /images-tags
---

# Tags reference

All images live in one repository — `ghcr.io/panasaurus/images` — distinguished by tag. "amd64 + arm64" means the image publishes a multi-arch manifest; single-platform entries are constrained by the upstream engine, not by us.

## Java

HotSpot (Temurin) and OpenJ9 (Semeru) JDKs, Java 8 through 26.

| tag | platforms | image |
|---|---|---|
| `:java_8` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_8` |
| `:java_8j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_8j9` |
| `:java_11` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_11` |
| `:java_11j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_11j9` |
| `:java_16` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_16` |
| `:java_16j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_16j9` |
| `:java_17` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_17` |
| `:java_17j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_17j9` |
| `:java_18` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_18` |
| `:java_18j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_18j9` |
| `:java_19` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_19` |
| `:java_19j9` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_19j9` |
| `:java_21` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_21` |
| `:java_22` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_22` |
| `:java_23` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_23` |
| `:java_24` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_24` |
| `:java_25` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_25` |
| `:java_26` · `:java_latest` | amd64 + arm64 | `ghcr.io/panasaurus/images:java_26` |

## Node.js

Node.js runtimes with the tools eggs commonly need.

| tag | platforms | image |
|---|---|---|
| `:nodejs_12` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_12` |
| `:nodejs_14` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_14` |
| `:nodejs_15` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_15` |
| `:nodejs_16` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_16` |
| `:nodejs_17` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_17` |
| `:nodejs_18` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_18` |
| `:nodejs_20` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_20` |
| `:nodejs_22` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_22` |
| `:nodejs_24` · `:nodejs_latest` | amd64 + arm64 | `ghcr.io/panasaurus/images:nodejs_24` |

## Python

CPython runtimes plus a build toolchain for source wheels.

| tag | platforms | image |
|---|---|---|
| `:python_3.7` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.7` |
| `:python_3.8` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.8` |
| `:python_3.9` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.9` |
| `:python_3.10` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.10` |
| `:python_3.11` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.11` |
| `:python_3.12` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.12` |
| `:python_3.13` · `:python_latest` | amd64 + arm64 | `ghcr.io/panasaurus/images:python_3.13` |

## Go

Full Go toolchains; generic images able to build and run Go programs.

| tag | platforms | image |
|---|---|---|
| `:go_1.14` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.14` |
| `:go_1.15` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.15` |
| `:go_1.16` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.16` |
| `:go_1.17` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.17` |
| `:go_1.18` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.18` |
| `:go_1.19` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.19` |
| `:go_1.20` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.20` |
| `:go_1.21` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.21` |
| `:go_1.22` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.22` |
| `:go_1.23` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.23` |
| `:go_1.24` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.24` |
| `:go_1.25` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.25` |
| `:go_1.26` · `:go_latest` | amd64 + arm64 | `ghcr.io/panasaurus/images:go_1.26` |

## .NET

Microsoft .NET SDK images for Terraria/TShock and friends.

| tag | platforms | image |
|---|---|---|
| `:dotnet_7` | amd64 + arm64 | `ghcr.io/panasaurus/images:dotnet_7` |
| `:dotnet_8` | amd64 + arm64 | `ghcr.io/panasaurus/images:dotnet_8` |
| `:dotnet_9` · `:dotnet_latest` | amd64 + arm64 | `ghcr.io/panasaurus/images:dotnet_9` |

## Base operating systems

Minimal OS images with the core packages a game server needs.

| tag | platforms | image |
|---|---|---|
| `:alpine` | amd64 + arm64 | `ghcr.io/panasaurus/images:alpine` |
| `:debian` | amd64 + arm64 | `ghcr.io/panasaurus/images:debian` |

## Game servers

Purpose-built images for specific games or engines.

| tag | platforms | image |
|---|---|---|
| `:source` | amd64 | `ghcr.io/panasaurus/images:source` |
| `:conan_exiles` | amd64 | `ghcr.io/panasaurus/images:conan_exiles` |
| `:rust` | amd64 | `ghcr.io/panasaurus/images:rust` |
| `:hytale` | amd64 | `ghcr.io/panasaurus/images:hytale` (built on `java_25`) |

## Egg installers

Not for running servers — used by egg install scripts to pre-install common dependencies.

| tag | platforms | image |
|---|---|---|
| `:installer_alpine` | amd64 + arm64 | `ghcr.io/panasaurus/images:installer_alpine` |
| `:installer_debian` | amd64 | `ghcr.io/panasaurus/images:installer_debian` |

## End-of-life policy

Older runtimes (Go ≤ 1.24, Java 16/18/19, Node ≤ 20, Python ≤ 3.10, .NET 7/9 where applicable) print a boot warning when upstream declares them EOL. Images don't disappear while games depend on them — they just nag, in the log, once per boot, until upstream retires the base. Plan migrations before the nag becomes a removal notice.
