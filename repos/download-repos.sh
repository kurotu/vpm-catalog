#!/bin/bash
set -eu
DIR=$(cd "$(dirname "$0")" && pwd)

function download() {
  local URL=$1
  local CONTENT
  CONTENT=$(curl -s -L "$URL")
  local ID
  ID=$(echo "$CONTENT" | jq -r '.id')
  echo "$CONTENT" > "$DIR/$ID.json"
}

while read -r URL; do
  download "$URL"
done < "$DIR/repos.txt"
