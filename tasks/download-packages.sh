#!/bin/bash

if [ "$COMSPEC" != "" ]; then
  JQ="jq -b"
else
  JQ="jq"
fi

set -eu

crossJq() {
  $JQ "$@"
}

ROOT="$(cd "$(dirname "$0")" && pwd)/.."

function getAllPackageNames() {
  cat "$ROOT"/vpm/repos/*.json | crossJq -r '.packages | to_entries[].key' | sort | uniq
}

function getAllVersions() {
  local PACKAGE_NAME="$1"
  cat "$ROOT"/vpm/repos/*.json \
    | crossJq -r --arg PACKAGE_NAME "$PACKAGE_NAME" '
        .packages
        | to_entries[].value
        | to_entries[].value
        | to_entries[].value
        | select(.name==$PACKAGE_NAME)
        | .version
      ' \
    | node "$ROOT"/tasks/sort-semver.js \
    | uniq
}

function getPackageInfo() {
  local PACKAGE_NAME="$1"
  local VERSION="$2"
  cat "$ROOT"/vpm/repos/*.json \
    | crossJq -r -c --arg PACKAGE_NAME "$PACKAGE_NAME" --arg VERSION "$VERSION" '
        .packages
        | to_entries[].value
        | to_entries[].value
        | to_entries[].value
        | select(.name==$PACKAGE_NAME and .version==$VERSION)
      ' \
    | head -n 1
}

DOWNLOAD_DIR="$ROOT/vpm/zips"
PACKAGES_DIR="$ROOT/vpm/packages"
mkdir -p "$DOWNLOAD_DIR"
mkdir -p "$PACKAGES_DIR"
getAllPackageNames | while read -r PACKAGE_NAME; do
  echo "Package: $PACKAGE_NAME"
  LATEST=$(getAllVersions "$PACKAGE_NAME" | grep -v '-' | tail -n 1)
  if [ "$LATEST" == "" ]; then # if no stable version, use latest version
    LATEST=$(getAllVersions "$PACKAGE_NAME" | tail -n 1)
  fi
  echo "Latest version: $LATEST"
  LATEST_INFO=$(getPackageInfo "$PACKAGE_NAME" "$LATEST")
  ZIP_URL=$(echo "$LATEST_INFO" | crossJq -r '.url')
  DOWNLOAD_FILE="$DOWNLOAD_DIR/$PACKAGE_NAME-$LATEST.zip"
  if [ ! -f "$DOWNLOAD_FILE" ]; then
    echo "Downloading $ZIP_URL to $DOWNLOAD_FILE"
    curl -s -L -H "User-Agent: VPM Catalog" "$ZIP_URL" > "$DOWNLOAD_FILE"
  else
    echo "File $DOWNLOAD_FILE already exists"
  fi

  UNZIP_DIR="$PACKAGES_DIR/$PACKAGE_NAME-$LATEST"
  if [ ! -d "$UNZIP_DIR" ]; then
    mkdir -p "$UNZIP_DIR"
    echo "Unzipping $DOWNLOAD_FILE to $UNZIP_DIR"
    if ! unzip -q -o "$DOWNLOAD_FILE" -d "$UNZIP_DIR"; then
      echo "Failed to unzip $DOWNLOAD_FILE, retrying with -UU"
      unzip -q -o -UU "$DOWNLOAD_FILE" -d "$UNZIP_DIR" && true
      CODE=$?
      if [ $CODE -eq 0 ]; then
        echo "unzip exited with code 0"
      elif [ $CODE -eq 1 ]; then
        echo "unzip exited with code 1"
      else
        echo "unzip exited with code $CODE"
        exit 1
      fi
    fi
  else
    echo "Directory $UNZIP_DIR already exists"
  fi
done
