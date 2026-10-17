---
id: marketplace
title: Marketplace & eggs
description: The built-in extension marketplace and the Panasaurus egg marketplace at eggs.panasaurus.com.
sidebar_position: 3
slug: /marketplace
---

# Marketplace & eggs

Two marketplaces, two kinds of packages:

| | Extensions | Eggs |
|---|---|---|
| **What** | Panel plugins (UI, features, integrations) | Game server recipes (install script, startup command, image) |
| **Where** | Admin → Panasaurus → Marketplace (built in) | [eggs.panasaurus.com](https://eggs.panasaurus.com) |
| **Format** | `.blueprint` files | JSON egg definitions + Docker image |
| **Install** | `panasaurus -install` or admin UI | Admin → Nests → import |

## Extension marketplace

The marketplace page in the admin area reads the **live Blueprint ecosystem directory** and serves it with search, filters, and caching. Nothing is bundled or stale: what the Blueprint community publishes is what you see, refreshed on a schedule (`php artisan bp:meta` refreshes manually if you're impatient).

Every listing links to the extension's source and shows the install command. If an extension ships a `.blueprint` release, you can go from discovery to installed in under a minute — see [Extensions](/docs/extensions).

## Egg marketplace

[Eggs.panasaurus.com](https://eggs.panasaurus.com) is the curated home for eggs matched to Panasaurus Images. Every egg there:

- **Targets `ghcr.io/panasaurus/images` tags** — the Docker image line is already correct, no registry swapping, no `ghcr.io/pterodactyl/yolks` leftovers
- **Declares its image variant** — `java_21` for modern Minecraft, `go_1.26` for Go servers, `installer_debian` for heavy install scripts
- **Is tested against the Panasaurus daemon** — install scripts, file denylists, and stop signals behave the way the daemon implements them

### Importing an egg

1. Download the egg JSON from [eggs.panasaurus.com](https://eggs.panasaurus.com).
2. In the panel: **Admin → Nests → (choose nest) → Import egg**, upload the JSON.
3. Create a server with the egg; the panel pulls the referenced image on install.

### Upstream eggs

Eggs written for stock Pterodactyl work — the wings and panel implement the same egg schema. If you import an upstream egg that references `ghcr.io/pterodactyl/yolks:*` images, either update the image line or run the bulk migration described in [Migrating from yolks](/docs/images-migration). The panel repo's default nests already point at Panasaurus Images.

### Publishing an egg

Eggs are JSON with a bit of shell inside — if you can start a server by hand, you can write an egg. The community channel on the [Discord](https://discord.gg/tszvW9zKN7) is the front door for submissions; marketplace review is mostly about correct install scripts and sane limits.
