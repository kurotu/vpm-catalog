#!/bin/bash
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)/.."

VPM_REPOS_FILE="$ROOT/repositories.txt"
VPM_REPOS_IGNORE_FILE="$ROOT/repositories-ignore.txt"
VPM_REPOS_DEV_FILE="$ROOT/repositories-dev.txt"

function sort_repos() {
    local file="$1"
    if [ -f "$file" ]; then
        cat "$file" | LC_ALL=C sort --ignore-case | uniq > "$file.tmp"
        mv "$file.tmp" "$file"
    fi
}

sort_repos "$VPM_REPOS_FILE"
sort_repos "$VPM_REPOS_IGNORE_FILE"
sort_repos "$VPM_REPOS_DEV_FILE"
