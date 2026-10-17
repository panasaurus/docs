#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Panasaurus installer — Panel + Wings
#
# Usage:
#   curl -fsSL https://panasaurus.com/install.sh | bash
#
# Examples:
#   bash install.sh --panel
#   bash install.sh --wings \
#     --panel-url https://panel.example.com \
#     --node-url https://node.example.com:8081 \
#     --token YOUR_APPLICATION_API_KEY \
#     --node 1
#   bash install.sh --both
#   bash install.sh --wings --version v1.2.0
#
# Panel releases:
#   panasaurus/panel: panel.tar.gz, CHECKSUM
#
# Wings releases:
#   panasaurus/wings: wings-linux-amd64.tar.gz
#                     wings-linux-arm64.tar.gz
# ---------------------------------------------------------------------------

set -Eeuo pipefail
umask 077

# --- release configuration --------------------------------------------------

RELEASE_VERSION="latest"

PANEL_REPO="panasaurus/panel"
WINGS_REPO="panasaurus/wings"

PANEL_ASSET="panel.tar.gz"
PANEL_CHECKSUM_ASSET="CHECKSUM"

WINGS_AMD64_ASSET="wings-linux-amd64.tar.gz"
WINGS_ARM64_ASSET="wings-linux-arm64.tar.gz"

# --- defaults ---------------------------------------------------------------

DO_PANEL=0
DO_WINGS=0
ASSUME_YES=0
NO_FIREWALL=0

PANEL_URL=""
NODE_URL=""

PANEL_PORT="${PANEL_PORT:-80}"
ADMIN_EMAIL="${PANASAURUS_ADMIN_EMAIL:-admin@panasaurus.local}"
ADMIN_USERNAME="${PANASAURUS_ADMIN_USERNAME:-admin}"
INSTALL_DIR="${PANASAURUS_INSTALL_DIR:-/opt/panasaurus/panel}"

WINGS_TOKEN=""
WINGS_NODE=""
WINGS_CONFIG="/etc/panasaurus/config.yml"
WINGS_LIB="/var/lib/panasaurus"

DAEMON_API_PORT="${DAEMON_API_PORT:-8080}"
DAEMON_SFTP_PORT="${DAEMON_SFTP_PORT:-2022}"

DOCKER_COMPOSE=""
PRIMARY_IP=""

# --- UI ---------------------------------------------------------------------

if [ -t 1 ]; then
  C_RESET=$'\033[0m'
  C_GREEN=$'\033[0;32m'
  C_YELLOW=$'\033[1;33m'
  C_RED=$'\033[0;31m'
  C_BLUE=$'\033[0;34m'
  C_BOLD=$'\033[1m'
else
  C_RESET=""
  C_GREEN=""
  C_YELLOW=""
  C_RED=""
  C_BLUE=""
  C_BOLD=""
fi

info()  { printf '%s\n' "${C_BLUE}==> ${C_RESET}$1"; }
ok()    { printf '%s\n' "${C_GREEN}==> ${C_RESET}$1"; }
warn()  { printf '%s\n' "${C_YELLOW}WARNING:${C_RESET} $1"; }
error() { printf '%s\n' "${C_RED}ERROR:${C_RESET} $1" >&2; }
die()   { error "$1"; exit "${2:-1}"; }

banner() {
  cat <<EOF
${C_GREEN}   ___              _                        _
  | _ \__ _ _  _ __| |__ _ _  _ ___ __ ___ _(_)___
  |  _/ _\` | || / _\` / _\` | || (_-</ _|/ _ \ '_(_-<
  |_| \__,_|\_,_\__,_\__, |\_,_/__\__|\__,_|_|/__/
                      |___/${C_RESET}        the dino-strong platform

  https://github.com/panasaurus
  https://eggs.panasaurus.com
  Discord: https://discord.gg/tszvW9zKN7
EOF
}

usage() {
  cat <<'EOF'
Panasaurus installer — panel, Wings, or both.

Usage:
  bash install.sh [options]

Modes:
  --panel               Install the panel
  --wings               Install Wings
  --both                Install both on this machine

Options:
  --panel-url URL       Public panel URL
  --node-url URL        Public node connection URL (Wings)
  --token KEY           Application API key (Wings)
  --node ID             Numeric panel node ID
  --port PORT           Panel host port (default: 80)
  --admin-email EMAIL   Initial admin email
  --install-dir DIR     Panel installation directory
  --version TAG         Release tag (default: latest)
  --daemon-port PORT    Local Wings API port (default: 8080)
  --sftp-port PORT      Wings SFTP port (default: 2022)
  --no-firewall         Do not modify ufw/firewalld
  --yes, -y             Accept defaults
  --help, -h            Show this help

Wings requires a node URL matching the panel's node connection address,
including the port. For a remote API, configure TLS or a TLS reverse proxy.

Examples:
  bash install.sh --panel
  bash install.sh --wings \
    --panel-url https://panel.example.com \
    --node-url https://node.example.com:8081 \
    --token YOUR_API_KEY --node 1
EOF
}

# --- prompts ----------------------------------------------------------------

ask() {
  local prompt="$1" default="${2:-}" answer=""

  if [ "$ASSUME_YES" -eq 1 ] || ! [ -e /dev/tty ]; then
    printf '%s\n' "$default"
    return 0
  fi

  if [ -n "$default" ]; then
    printf '%s [%s]: ' "$prompt" "$default" > /dev/tty
  else
    printf '%s: ' "$prompt" > /dev/tty
  fi

  IFS= read -r answer < /dev/tty || answer=""
  [ -z "$answer" ] && answer="$default"
  printf '%s\n' "$answer"
}

# --- downloads --------------------------------------------------------------

fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL --retry 3 --retry-delay 2 "$1" -o "$2"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$2" "$1"
  else
    die "Install curl or wget and retry."
  fi
}

release_url() {
  local repo="$1" asset="$2"

  if [ "$RELEASE_VERSION" = "latest" ]; then
    printf 'https://github.com/%s/releases/latest/download/%s\n' \
      "$repo" "$asset"
  else
    printf 'https://github.com/%s/releases/download/%s/%s\n' \
      "$repo" "$RELEASE_VERSION" "$asset"
  fi
}

# --- preflight --------------------------------------------------------------

SELF_URL="https://panasaurus.com/install.sh"

require_root() {
  if [ "$(id -u)" -eq 0 ]; then
    return
  fi

  command -v sudo >/dev/null 2>&1 ||
    die "Run as root or install sudo."

  info "Re-running as root via sudo .."

  local script="${BASH_SOURCE[0]:-}"

  if [ "$script" = "bash" ] || [ ! -f "$script" ]; then
    script="$(mktemp /tmp/panasaurus-install.XXXXXX)"
    fetch "$SELF_URL" "$script"
    chmod 0755 "$script"
    exec sudo -E bash "$script" "$@"
  else
    exec sudo -E bash "$script" "$@"
  fi
}

check_distro() {
  command -v apt-get >/dev/null 2>&1 ||
    die "Only apt-based distributions are supported."

  if ! command -v systemctl >/dev/null 2>&1 &&
     ! command -v rc-service >/dev/null 2>&1; then
    die "Neither systemd nor OpenRC was detected."
  fi

  . /etc/os-release
  ok "Distribution: ${PRETTY_NAME:-unknown}"
}

detect_primary_ip() {
  PRIMARY_IP="$(
    ip -4 route get 1.1.1.1 2>/dev/null |
      awk '{for (i=1;i<=NF;i++) if ($i=="src") {print $(i+1); exit}}' ||
      true
  )"

  [ -n "$PRIMARY_IP" ] ||
    PRIMARY_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"

  [ -n "$PRIMARY_IP" ] || PRIMARY_IP="127.0.0.1"
}

# --- Docker -----------------------------------------------------------------

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    info "Installing Docker .."
    fetch https://get.docker.com /tmp/panasaurus-get-docker.sh
    sh /tmp/panasaurus-get-docker.sh
    rm -f /tmp/panasaurus-get-docker.sh

    if command -v systemctl >/dev/null 2>&1; then
      systemctl enable --now docker
    fi
  fi

  if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
  else
    die "Docker Compose is unavailable."
  fi

  ok "Docker: $(docker --version)"
  ok "Compose: ${DOCKER_COMPOSE}"
}

# --- firewall ---------------------------------------------------------------

firewall_open() {
  [ "$NO_FIREWALL" -eq 1 ] && return 0

  local port="$1" proto="${2:-tcp}"

  if command -v ufw >/dev/null 2>&1 &&
     ufw status 2>/dev/null | head -1 | grep -qw active; then
    ufw allow "${port}/${proto}" >/dev/null &&
      ok "ufw: allowed ${port}/${proto}" ||
      warn "Could not open ${port}/${proto} in ufw."
  elif command -v firewall-cmd >/dev/null 2>&1 &&
       firewall-cmd --state >/dev/null 2>&1; then
    firewall-cmd --permanent --add-port="${port}/${proto}" >/dev/null 2>&1 || true
    firewall-cmd --reload >/dev/null 2>&1 || true
    ok "firewalld: allowed ${port}/${proto}"
  fi
}

# ---------------------------------------------------------------------------
# Panel installation
# ---------------------------------------------------------------------------

install_panel() {
  local app_dir="$INSTALL_DIR"
  local compose_file tmp_dir
  local db_password db_root_password admin_password attempts

  info "Installing panel into ${app_dir} .."

  if [ ! -f "${app_dir}/docker-compose.yml" ]; then
    mkdir -p "$app_dir"
    tmp_dir="$(mktemp -d /tmp/panasaurus-panel.XXXXXX)"

    info "Downloading panel release ${RELEASE_VERSION} .."

    if ! fetch "$(release_url "$PANEL_REPO" "$PANEL_ASSET")" \
      "${tmp_dir}/${PANEL_ASSET}"; then
      rm -rf "$tmp_dir"
      die "Failed to download ${PANEL_ASSET}."
    fi

    if ! fetch "$(release_url "$PANEL_REPO" "$PANEL_CHECKSUM_ASSET")" \
      "${tmp_dir}/${PANEL_CHECKSUM_ASSET}"; then
      rm -rf "$tmp_dir"
      die "Failed to download CHECKSUM."
    fi

    if ! (
      cd "$tmp_dir"
      sha256sum -c "$PANEL_CHECKSUM_ASSET"
    ); then
      rm -rf "$tmp_dir"
      die "Panel archive checksum verification failed."
    fi

    tar -tzf "${tmp_dir}/${PANEL_ASSET}" >/dev/null || {
      rm -rf "$tmp_dir"
      die "Panel archive is invalid."
    }

    tar -xzf "${tmp_dir}/${PANEL_ASSET}" \
      -C "$app_dir" --strip-components=1

    rm -rf "$tmp_dir"
  else
    ok "Existing panel installation found; preserving its files."
  fi

  compose_file="${app_dir}/docker-compose.yml"
  [ -f "$compose_file" ] || die "Missing ${compose_file}."

  if [ -z "$PANEL_URL" ]; then
    detect_primary_ip
    PANEL_URL="$(ask "Panel URL" "http://${PRIMARY_IP}:${PANEL_PORT}")"
  fi

  case "$PANEL_URL" in
    http://*|https://*) ;;
    *) PANEL_URL="http://${PANEL_URL}" ;;
  esac
  PANEL_URL="${PANEL_URL%/}"

  if grep -q "CHANGE_ME_PLEASE" "$compose_file"; then
    info "Generating initial configuration .."

    db_password="$(openssl rand -hex 16)"
    db_root_password="$(openssl rand -hex 16)"
    admin_password="$(openssl rand -hex 12)"

    mkdir -p \
      "${app_dir}/data/database" \
      "${app_dir}/data/var" \
      "${app_dir}/data/logs" \
      "${app_dir}/data/extensions" \
      "${app_dir}/data/nginx" \
      "${app_dir}/data/certs"

    sed -i.bak \
      -e "s|CHANGE_ME_PLEASE|${db_password}|g" \
      -e "s|CHANGE_ME_TOO_PLEASE|${db_root_password}|g" \
      "$compose_file"
    rm -f "${compose_file}.bak"

    sed -i.bak \
      -e "s|APP_URL: 'http://localhost'|APP_URL: '${PANEL_URL}'|" \
      -e "s|# PANASAURUS_ADMIN_EMAIL: 'you@example.com'|PANASAURUS_ADMIN_EMAIL: '${ADMIN_EMAIL}'|" \
      -e "s|# PANASAURUS_ADMIN_USERNAME: 'admin'|PANASAURUS_ADMIN_USERNAME: '${ADMIN_USERNAME}'|" \
      -e "s|# PANASAURUS_ADMIN_PASSWORD: 'change-me-please'|PANASAURUS_ADMIN_PASSWORD: '${admin_password}'|" \
      "$compose_file"
    rm -f "${compose_file}.bak"
  else
    admin_password="(unchanged — existing installation)"
    ok "Existing configuration detected."
  fi

  export PANEL_PORT
  cd "$app_dir"

  info "Pulling Docker images .."
  $DOCKER_COMPOSE pull --quiet ||
    warn "One or more images could not be pulled."

  info "Starting panel .."
  $DOCKER_COMPOSE up -d

  info "Waiting for panel health .."
  attempts=0

  until curl -fsS "http://127.0.0.1:${PANEL_PORT}/api/health" >/dev/null 2>&1 ||
        [ "$attempts" -ge 60 ]; do
    attempts=$((attempts + 1))
    sleep 3
  done

  if [ "$attempts" -ge 60 ]; then
    warn "Panel has not reported healthy yet."
    warn "Check: $DOCKER_COMPOSE logs -f panel"
  else
    ok "Panel is healthy."
  fi

  firewall_open 80
  firewall_open 443

  if [ "$PANEL_PORT" != 80 ] && [ "$PANEL_PORT" != 443 ]; then
    firewall_open "$PANEL_PORT"
  fi

  cat <<EOF

${C_GREEN}${C_BOLD}Panasaurus panel setup finished${C_RESET}

URL:      ${PANEL_URL}
Admin:    ${ADMIN_EMAIL}
Password: ${admin_password}

Extensions: $DOCKER_COMPOSE exec panel panasaurus -help

EOF

  [ "$admin_password" = "(unchanged — existing installation)" ] ||
    warn "Save the initial admin password securely."
}

# ---------------------------------------------------------------------------
# Wings installation
# ---------------------------------------------------------------------------

install_wings() {
  local machine asset tmp_dir archive_root
  local bin_path cargo_bin extracted_bin
  local cargo_env cargo_home rustup_home
  local config_dir data_dir service_file unit_tmp
  local attempts

  info "Installing Panasaurus Wings .."

  # 1. Architecture and release archive.
  case "$(uname -m)" in
    x86_64|amd64)
      machine="amd64"
      asset="$WINGS_AMD64_ASSET"
      ;;
    aarch64|arm64)
      machine="arm64"
      asset="$WINGS_ARM64_ASSET"
      ;;
    *)
      die "Unsupported architecture: $(uname -m)."
      ;;
  esac

  ok "Architecture: ${machine}"
  mkdir -p /etc/panasaurus "$WINGS_LIB"

  config_dir="$(dirname "$WINGS_CONFIG")"
  mkdir -p "$config_dir"
  chmod 0750 "$config_dir"

  # 2. Required packages.
  info "Installing Wings build and filesystem dependencies .."

  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y \
    ca-certificates \
    curl \
    tar \
    gzip \
    xz-utils \
    build-essential \
    pkg-config \
    libssl-dev \
    e2fsprogs \
    util-linux \
    findutils \
    coreutils \
    openssl

  # 3. Download the architecture-specific release.
  tmp_dir="$(mktemp -d /tmp/panasaurus-wings.XXXXXX)"
  trap 'rm -rf "${tmp_dir:-}"' RETURN

  info "Downloading Wings release ${RELEASE_VERSION} .."

  if ! fetch "$(release_url "$WINGS_REPO" "$asset")" \
    "${tmp_dir}/${asset}"; then
    die "Failed to download ${asset} from the Wings release."
  fi

  tar -tzf "${tmp_dir}/${asset}" >/dev/null ||
    die "The Wings release archive is not a valid gzip tar archive."

  mkdir -p "${tmp_dir}/unpacked"
  tar -xzf "${tmp_dir}/${asset}" -C "${tmp_dir}/unpacked"

  # 4. Prefer a prebuilt binary if the release contains one.
  #    Otherwise build the Rust source archive with the locked dependencies.
  extracted_bin="$(
    find "${tmp_dir}/unpacked" -type f \
      -name panasaurus-wings -perm /111 -print -quit
  )"

  bin_path="/usr/local/bin/panasaurus-wings"

  if [ -n "$extracted_bin" ] &&
     [ "$(head -c 4 "$extracted_bin" | od -An -tx1 | tr -d ' \n')" = "7f454c46" ]; then
    info "Using the prebuilt Wings executable from the release archive."
    install -m 0755 "$extracted_bin" "$bin_path"
  else
    info "No prebuilt executable found; building the Rust release."

    local cargo_project
    cargo_project="$(
      find "${tmp_dir}/unpacked" -type f \
        -name Cargo.toml -print -quit |
        xargs -r dirname
    )"

    [ -n "$cargo_project" ] ||
      die "Archive contains neither a usable binary nor a Cargo.toml. Check the Wings release packaging."

    if ! command -v cargo >/dev/null 2>&1; then
      info "Installing Rust using rustup .."

      export CARGO_HOME=/root/.cargo
      export RUSTUP_HOME=/root/.rustup
      fetch https://sh.rustup.rs "${tmp_dir}/rustup-init.sh"
      sh "${tmp_dir}/rustup-init.sh" -y --profile minimal

      export PATH="${CARGO_HOME}/bin:${PATH}"
    fi

    cargo_bin="$(command -v cargo)"
    [ -n "$cargo_bin" ] || die "Rust Cargo was not installed."

    info "Building with cargo build --locked --release .."

    (
      cd "$cargo_project"
      "$cargo_bin" build --locked --release
    )

    extracted_bin="${cargo_project}/target/release/panasaurus-wings"

    [ -x "$extracted_bin" ] ||
      die "Rust build succeeded but target/release/panasaurus-wings was not found."

    install -m 0755 "$extracted_bin" "$bin_path"
  fi

  [ "$(head -c 4 "$bin_path" | od -An -tx1 | tr -d ' \n')" = "7f454c46" ] ||
    die "Installed Wings file is not an ELF executable."

  ok "Installed ${bin_path}"
  printf 'SHA-256: %s\n' "$(sha256sum "$bin_path" | awk '{print $1}')"

  # 5. Set up node storage.
  # The node data path must be absolute and accessible to Docker.
  data_dir="${WINGS_LIB}/data"
  mkdir -p "$data_dir"
  chmod 0750 "$WINGS_LIB" "$data_dir"

  # 6. Configure using the documented CLI.
  if [ -f "$WINGS_CONFIG" ]; then
    ok "Existing config found at ${WINGS_CONFIG}; leaving it unchanged."
  else
    if [ -z "$PANEL_URL" ]; then
      PANEL_URL="$(ask "Panel URL" "")"
    fi
    [ -n "$PANEL_URL" ] ||
      die "--panel-url is required for Wings configuration."

    if [ -z "$WINGS_NODE" ]; then
      WINGS_NODE="$(ask "Numeric node ID from the panel" "1")"
    fi

    case "$WINGS_NODE" in
      ''|*[!0-9]*) die "Node ID must be numeric." ;;
    esac

    if [ -z "$NODE_URL" ]; then
      NODE_URL="$(ask "Node connection URL (including port)" "")"
    fi
    [ -n "$NODE_URL" ] ||
      die "--node-url is required. It must match the panel's node connection address, including the port."

    case "$NODE_URL" in
      http://*|https://*) ;;
      *) die "--node-url must start with http:// or https://" ;;
    esac

    if [ -z "$WINGS_TOKEN" ]; then
      WINGS_TOKEN="$(ask "Application API token" "")"
    fi
    [ -n "$WINGS_TOKEN" ] ||
      die "An application API token is required."

    export PANASAURUS_APPLICATION_TOKEN="$WINGS_TOKEN"
    unset WINGS_TOKEN

    info "Generating Wings configuration .."

    # The documented configure command requires the destination config not
    # to exist. The token is passed through the environment, not argv.
    "$bin_path" --configure \
      --panel-url "$PANEL_URL" \
      --node-id "$WINGS_NODE" \
      --token-env PANASAURUS_APPLICATION_TOKEN \
      --node-url "$NODE_URL" \
      --config "$WINGS_CONFIG"

    unset PANASAURUS_APPLICATION_TOKEN

    [ -f "$WINGS_CONFIG" ] ||
      die "Wings configure completed without creating ${WINGS_CONFIG}."

    chmod 0600 "$WINGS_CONFIG"
    ok "Configuration written to ${WINGS_CONFIG}"
  fi

  # 7. Ensure the operator-configured storage path is absolute.
  #    Do not overwrite the system.data path from an existing config.
  if ! grep -Eq '^[[:space:]]*data:' "$WINGS_CONFIG"; then
    warn "Review system.data in ${WINGS_CONFIG}; it must be an absolute path accessible to Docker."
  fi

  # 8. Generate a systemd unit using the daemon's own command.
  if command -v systemctl >/dev/null 2>&1; then
    info "Generating the systemd unit from Wings .."

    unit_tmp="$(mktemp /tmp/panasaurus-wings-unit.XXXXXX)"

    "$bin_path" --systemd-unit --config "$WINGS_CONFIG" > "$unit_tmp" ||
      die "Wings failed to generate a systemd unit."

    grep -q 'ExecStart=' "$unit_tmp" ||
      die "Generated systemd unit does not contain ExecStart."

    service_file="/etc/systemd/system/panasaurus-wings.service"
    install -m 0644 "$unit_tmp" "$service_file"
    rm -f "$unit_tmp"

    systemctl daemon-reload
    systemctl enable panasaurus-wings
    systemctl restart panasaurus-wings

    ok "Installed and enabled the generated systemd unit."
  elif command -v rc-service >/dev/null 2>&1; then
    die "This Wings installer currently requires systemd for automatic service setup. On OpenRC, install the daemon and config manually and create an OpenRC service."
  fi

  # 9. Wait for the daemon API.
  info "Waiting for the Wings API .."

  attempts=0
  until curl -fsSk --noproxy '*' \
          "https://127.0.0.1:${DAEMON_API_PORT}/openapi.json" >/dev/null 2>&1 ||
        curl -fsS --noproxy '*' \
          "http://127.0.0.1:${DAEMON_API_PORT}/openapi.json" >/dev/null 2>&1 ||
        [ "$attempts" -ge 20 ]; do
    attempts=$((attempts + 1))
    sleep 2
  done

  if [ "$attempts" -ge 20 ]; then
    warn "The Wings API did not respond on port ${DAEMON_API_PORT}."
    warn "Inspect: journalctl -u panasaurus-wings -f"
    warn "Check the listener configuration in ${WINGS_CONFIG}."
  else
    ok "Wings API is responding."
  fi

  firewall_open "$DAEMON_API_PORT"
  firewall_open "$DAEMON_SFTP_PORT"

  cat <<EOF

${C_GREEN}${C_BOLD}Panasaurus Wings setup finished${C_RESET}

Binary:  ${bin_path}
Config:  ${WINGS_CONFIG}
Service: panasaurus-wings

Logs:
  journalctl -u panasaurus-wings -f

Config:
  nano ${WINGS_CONFIG}

IMPORTANT:
  Review system.data, listener addresses, TLS, and SFTP settings.
  Restart Wings after changing listener or concurrency settings.

EOF
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

while [ $# -gt 0 ]; do
  case "$1" in
    --panel) DO_PANEL=1 ;;
    --wings) DO_WINGS=1 ;;
    --both) DO_PANEL=1; DO_WINGS=1 ;;
    --yes|-y) ASSUME_YES=1 ;;
    --no-firewall) NO_FIREWALL=1 ;;

    --panel-url)
      [ $# -ge 2 ] || die "--panel-url requires a value."
      PANEL_URL="$2"; shift
      ;;
    --node-url)
      [ $# -ge 2 ] || die "--node-url requires a value."
      NODE_URL="$2"; shift
      ;;
    --token)
      [ $# -ge 2 ] || die "--token requires a value."
      WINGS_TOKEN="$2"; shift
      ;;
    --node)
      [ $# -ge 2 ] || die "--node requires a value."
      WINGS_NODE="$2"; shift
      ;;
    --port)
      [ $# -ge 2 ] || die "--port requires a value."
      PANEL_PORT="$2"; shift
      ;;
    --admin-email)
      [ $# -ge 2 ] || die "--admin-email requires a value."
      ADMIN_EMAIL="$2"; shift
      ;;
    --install-dir)
      [ $# -ge 2 ] || die "--install-dir requires a value."
      INSTALL_DIR="$2"; shift
      ;;
    --version)
      [ $# -ge 2 ] || die "--version requires a value."
      RELEASE_VERSION="$2"; shift
      ;;
    --daemon-port)
      [ $# -ge 2 ] || die "--daemon-port requires a value."
      DAEMON_API_PORT="$2"; shift
      ;;
    --sftp-port)
      [ $# -ge 2 ] || die "--sftp-port requires a value."
      DAEMON_SFTP_PORT="$2"; shift
      ;;
    --help|-h)
      banner
      echo
      usage
      exit 0
      ;;
    *)
      error "Unknown option: $1"
      usage
      exit 2
      ;;
  esac
  shift
done

case "$RELEASE_VERSION" in
  latest|v[0-9]*|[0-9]*) ;;
  *) die "Invalid release version: ${RELEASE_VERSION}" ;;
esac

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  banner
  echo

  require_root "$@"
  check_distro
  detect_primary_ip

  if [ "$DO_PANEL" -eq 0 ] && [ "$DO_WINGS" -eq 0 ]; then
    if [ "$ASSUME_YES" -eq 1 ] || ! [ -e /dev/tty ]; then
      die "Pass --panel, --wings, or --both."
    fi

    printf '%s\n' \
      "  1) Install the Panel" \
      "  2) Install Wings" \
      "  3) Install both" \
      "  4) Exit"

    printf '%s' "Choose [1-4]: " > /dev/tty
    local choice=""
    IFS= read -r choice < /dev/tty || choice=""

    case "$choice" in
      1) DO_PANEL=1 ;;
      2) DO_WINGS=1 ;;
      3) DO_PANEL=1; DO_WINGS=1 ;;
      4) exit 0 ;;
      *) die "Invalid choice." ;;
    esac
  fi

  if [ "$DO_PANEL" -eq 1 ]; then
    ensure_docker
    install_panel
  fi

  if [ "$DO_WINGS" -eq 1 ]; then
    ensure_docker
    install_wings
  fi

  echo
  ok "Installation finished."
  info "Eggs: https://eggs.panasaurus.com"
  info "Support: https://discord.gg/tszvW9zKN7"
}

main "$@"
