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
DUMMY_PNG="$ROOT/vpm/dummy/dummy.png"
DUMMY_JPG="$ROOT/vpm/dummy/dummy.jpg"
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
      unzip -q -o -UU "$DOWNLOAD_FILE" -d "$UNZIP_DIR"
    fi
  else
    echo "Directory $UNZIP_DIR already exists"
  fi

  if [ "$PACKAGE_NAME" == "com.anatawa12.av3emulator" ]; then
    echo "Patch missing files"
    mkdir -p "$UNZIP_DIR/.readme"
    cp "$DUMMY_PNG" "$UNZIP_DIR/.readme/a3_example.png"
    cp "$DUMMY_PNG" "$UNZIP_DIR/.readme/av3_radial_menu.png"
    cp "$DUMMY_PNG" "$UNZIP_DIR/.readme/avatar3emu_tutorial.png"
    cp "$DUMMY_PNG" "$UNZIP_DIR/.readme/lock_inspector_tutorial.png"
    cp "$DUMMY_PNG" "$UNZIP_DIR/.readme/write_defaults_off.png"
  fi

  if [ "$PACKAGE_NAME" == "lyuma.av3emulator" ]; then
    echo "Patch missing files"
    mkdir -p "$UNZIP_DIR/Runtime/Screenshots"
    cp "$DUMMY_PNG" "$UNZIP_DIR/Runtime/Screenshots/a3_example.png"
  fi

  if [ "$PACKAGE_NAME" == "com.vrmc.gltf" ]; then
    echo "Patch missing files"
    mkdir -p "$UNZIP_DIR/doc"
    cp "$DUMMY_PNG" "$UNZIP_DIR/doc/pbr_to_standard.png"
  fi

  if [ "$PACKAGE_NAME" == "at.pimaker.ltcgi" ]; then
    echo "Patch missing files"
    mkdir -p "$UNZIP_DIR/~Screenshots"
    cp "$DUMMY_JPG" "$UNZIP_DIR/~Screenshots/attribution.jpg"
    cp "$DUMMY_JPG" "$UNZIP_DIR/~Screenshots/demoapp.jpg"
  fi
done
