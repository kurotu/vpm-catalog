#!/bin/bash
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)/.."
DIR="$ROOT/vpm/repos"

function download() {
  local URL=$1
  local CONTENT
  CONTENT=$(curl -s -L -H "User-Agent: VPM Catalog" "$URL")
  local ID
  ID=$(echo "$CONTENT" | jq -r '.id')
  echo "$CONTENT" > "$DIR/$ID.json"
}

mkdir -p "$DIR"
while read -r URL; do
  echo "Downloading $URL"
  download "$URL"
done < "$ROOT/repositories.txt"
