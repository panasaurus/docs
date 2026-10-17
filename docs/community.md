---
title: Community and support
description: Where to get help with Panasaurus — the Discord, the GitHub organization, and the eggs marketplace.
sidebar_label: Community
---

# Community and support

## Discord

The [Panasaurus Discord](https://discord.gg/tszvW9zKN7) is the fastest way to reach people who run this stack daily — panel installs, Wings networking oddities, egg requests, and extension development all have a home there. Before posting, grab the relevant logs (`docker compose logs panel`, or `journalctl -u panasaurus-wings -f`) — most questions are answerable in one round trip with them attached.

## GitHub

Everything is open source under the [panasaurus organization](https://github.com/panasaurus):

| Repository | What it is |
|------------|------------|
| [panel](https://github.com/panasaurus/panel) | The Laravel + React control plane with Blueprint built in |
| [wings](https://github.com/panasaurus/wings) | The Rust node daemon |
| [images](https://github.com/panasaurus/images) | The core container images and their CI |
| [docs](https://github.com/panasaurus/docs) | This documentation site |

Bug reports and pull requests are welcome in each repository. For docs fixes, the "Edit this page" link on every page drops you straight into the right file.

## Eggs marketplace

[eggs.panasaurus.com](https://eggs.panasaurus.com) is the curated egg marketplace — tested against current releases and Panasaurus Images. Import instructions are on the [eggs page](/docs/eggs); requests and egg-testing coordination happen on the Discord.

## Reporting security issues

Do not open public issues for security reports. Use the security advisory workflow on the affected repository (each one has a "Security" tab), or reach out on the Discord and ask for a private channel. The panel and Wings both ship `SECURITY.md` files with response expectations.
