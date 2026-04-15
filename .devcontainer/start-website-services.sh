#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${TMPDIR:-/tmp}/repomix-devcontainer"

mkdir -p "$LOG_DIR"

is_port_listening() {
  local port="$1"
  ss -ltn "( sport = :$port )" | grep -q LISTEN
}

start_service() {
  local name="$1"
  local port="$2"
  local cwd="$3"
  local log_file="$4"
  shift 4

  if is_port_listening "$port"; then
    echo "$name already listening on port $port"
    return
  fi

  echo "Starting $name on port $port"
  (
    cd "$cwd"
    nohup "$@" >"$log_file" 2>&1 &
  )
}

sudo /usr/local/bin/init-firewall.sh

start_service \
  "website server" \
  8080 \
  "$ROOT_DIR/website/server" \
  "$LOG_DIR/website-server.log" \
  env ENABLE_LOCAL_PATH_MODE=true LOCAL_PATH_ALLOWLIST=/workspace PORT=8080 npm run dev

start_service \
  "website client" \
  5173 \
  "$ROOT_DIR/website/client" \
  "$LOG_DIR/website-client.log" \
  npm run docs:dev -- --host 0.0.0.0 --port 5173
