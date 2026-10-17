---
id: daemon-index
title: Daemon
description: The server management subsystem for Panasaurus Panel
slug: /daemon
sidebar_position: 1
---

# Daemon

[Install it](/docs/daemon-install) in one command if you're ready.


## Feature map

- [Configuration reference](/docs/daemon-configuration) — every option in `wings.yml`, annotated

## Compatibility notes

- **Panel**: works with the Panasaurus panel 
- **Eggs**: unchanged. Install scripts, file denylists, stop signals, and startup commands behave per the egg spec — denylists are *properly* enforced, an upstream gap.
- **Transfers**: server transfers may work, including transferring backups alongside the server.
