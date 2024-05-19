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

function findReadme() {
  local FILE="$1"
  unzip -l "$FILE" \
  | grep -v '.meta' \
  | awk '{print $4}' \
  | grep -i '^readme' \
  | grep -i '.md' \
  | head -n 1
}

DOWNLOAD_DIR="$ROOT/vpm/zips"
PACKAGES_DIR="$ROOT/vpm/packages"
DUMMY_PNG="$ROOT/dummy.png"
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
    curl -s -L "$ZIP_URL" > "$DOWNLOAD_FILE"
  else
    echo "File $DOWNLOAD_FILE already exists"
  fi
  mkdir -p "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST"
  echo "Unzipping $DOWNLOAD_FILE to $PACKAGES_DIR/$PACKAGE_NAME-$LATEST"
  unzip -UU -q -o "$DOWNLOAD_FILE" -d "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST"

  if [ "$PACKAGE_NAME" == "com.anatawa12.av3emulator" ]; then
    echo "Patch missing files"
    mkdir -p "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme/a3_example.png"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme/av3_radial_menu.png"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme/avatar3emu_tutorial.png"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme/lock_inspector_tutorial.png"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/.readme/write_defaults_off.png"
  fi

  if [ "$PACKAGE_NAME" == "lyuma.av3emulator" ]; then
    echo "Patch missing files"
    mkdir -p "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/Runtime/Screenshots"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/Runtime/Screenshots/a3_example.png"
  fi

  if [ "$PACKAGE_NAME" == "com.vrmc.gltf" ]; then
    echo "Patch missing files"
    mkdir -p "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/doc"
    cp "$DUMMY_PNG" "$PACKAGES_DIR/$PACKAGE_NAME-$LATEST/doc/pbr_to_standard.png"
  fi
done
