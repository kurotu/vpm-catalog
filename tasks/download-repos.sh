#!/bin/bash
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)/.."
DIR="$ROOT/vpm/repos"

function fixJson() {
  local TEMP
  TEMP="$(mktemp)"
  cat - > "$TEMP"
  npx any-json --input-format=hjson "$TEMP"
  rm "$TEMP"
}

function urlToFileName() {
  # replace '://', '.', '/' with '_'
  sed -e 's/:\/\/\|[\.\/]/_/g'
}

function download() {
  local URL=$1
  local CONTENT

  CONTENT=$(curl -s -L -H "User-Agent: VPM Catalog" "$URL")
  # remove bom from content
  CONTENT=$(echo "$CONTENT" | sed '1s/^\xEF\xBB\xBF//')
  # remove trailing commas
  set +e
  if ! echo "$CONTENT" | jq . > /dev/null; then
    set -e
    echo "Fix JSON by any-json"
    CONTENT=$(fixJson <<< "$CONTENT")
  fi
  set -e

  local ID
  ID=$(echo "$CONTENT" | jq -r '.id // empty')
  if [ -z "$ID" ]; then
    echo "ID not found in $URL"
    ID=$(urlToFileName <<< "$URL")
  fi
  echo "$CONTENT" > "$DIR/$ID.json"
}

mkdir -p "$DIR"
while read -r URL; do
  if [ "${URL:0:1}" == "#" ]; then
    continue
  fi
  echo "Downloading $URL"
  download "$URL"
done < "$ROOT/repositories.txt"
