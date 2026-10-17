---
id: daemon-sftp
title: SFTP & shell
description: The daemon's built-in SSH server — extensions, login format, hardening limits, and the .wings remote shell.
sidebar_position: 5
slug: /daemon-sftp
---

# SFTP & shell

The daemon runs its own SSH server — no OpenSSH configuration, no chroot gymnastics. It speaks real SFTP over real SSH (Ed25519 host keys by default) and doubles as a remote management shell.

## Connecting

SFTP listens on `127.0.0.1:2022` by default (expose it via `system.sftp.host` + firewall if you want it public):

```bash
sftp -P 2022 myuser.0f1a2b3c-4d5e-6f70-8a9b-0c1d2e3f4a5b@node1.example.com
```

**Login format: `username.server-uuid`** — the same convention Pterodactyl clients already know. The part after the dot selects the server the session is scoped to; users can only see the server(s) they have file access to, enforced from the panel's permissions.

In a GUI client (FileZilla, WinSCP, Cyberduck):

| Field | Value |
|---|---|
| Host | node FQDN |
| Port | `2022` |
| User | `username.server-uuid` |
| Password | Your panel account password (or key auth if enabled) |

## Protocol extensions

The SFTP server implements the extensions modern clients negotiate — several of which upstream Wings lacks:

- `check-file` — verify a file's integrity without transferring it
- `copy-file` — server-side copy, no round-trip for big files
- `space-available` — the client shows real free space, not a guess
- `limits@openssh.com` — packet/reply limits negotiated correctly
- `statvfs@openssh.com` — filesystem statistics
- `hardlink@openssh.com` — hardlink operations
- `fsync@openssh.com` — durable writes before rename operations
- `lsetstat@openssh.com` — symlink attribute changes
- `users-groups-by-id@openssh.com` — user/group name mapping by id
- `posix-rename@openssh.com` — atomic renames

Plus: egg `file_denylist` patterns are enforced on SFTP paths exactly as they are in the web file manager — no more bypassing a denylist by uploading over SFTP.

## Hardening

All knobs live under `system.sftp` (full context in the [configuration reference](/docs/daemon-configuration#sftp)):

```yml
system:
  sftp:
    enabled: true
    key_algorithm: ssh-ed25519     # persisted under system.data
    disable_password_auth: false   # true = keys only

    limits:
      authentication_password_attempts: 3
      authentication_pubkey_attempts: 20
      authentication_cooldown: 60      # sliding window after failures
      max_connections_per_user: 10
      max_channels_per_connection: 10
      max_handles_per_channel: 32
      max_handles_total: 1024
```

The cooldown is a sliding window: three failed password attempts in a minute locks further attempts until 60 seconds after the *last* failure. Brute-force tools find this deeply unsatisfying.

Host keys are generated on first boot and **persist** across restarts — your users' `known_hosts` entries survive daemon upgrades.

## The `.wings` remote shell

With `system.sftp.shell.enabled` (default), SSH'ing into the daemon's SFTP port with a *user* login (no `.server-uuid` suffix) drops you into a limited management shell instead of a file session:

```text
$ ssh -p 2022 myuser@node1.example.com
Panasaurus Wings — remote shell
Type '.wings help' to list commands.

node1:~$ .wings help
.wings list                     list servers you have access to
.wings power <server> <action>  start | stop | restart | kill
.wings status <server>          runtime state + resource usage
.wings console <server>         attach to the live console (read/write per permissions)
.wings help                     this list
```

The shell is intentionally tiny: power actions, status, console. Anything beyond that belongs in the panel or the API. Console access respects the same permissions as the websocket — read-only users read, command users can type.

## Auditing

Off by default, on when you need it:

```yml
system:
  sftp:
    activity:
      log_logins: false       # successful sftp logins → server activity
      log_file_reads: false   # file reads → server activity
```

File-read logging is verbose by nature — enable it for incident response, not for daily operation. Activity entries surface in the panel's server activity log alongside everything else.

## Quick checks

```bash
# is it listening?
ss -tlnp | grep 2022

# host key fingerprint (put it in monitoring or your docs)
ssh-keyscan -p 2022 node1.example.com 2>/dev/null | ssh-keygen -lf -

# smoke test
sftp -P 2022 admin.<server-uuid>@127.0.0.1
```
