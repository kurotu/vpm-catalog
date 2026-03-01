#!/bin/bash
# Resolves the repository list file to use.
# Priority: $VPM_REPOS_FILE > repositories-dev.txt
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)/.."

if [ -n "${VPM_REPOS_FILE:-}" ]; then
  REPOS_FILE="$VPM_REPOS_FILE"
else
  REPOS_FILE="$ROOT/repositories-dev.txt"
fi

echo "$REPOS_FILE"
>&2 echo "Using repos file: $REPOS_FILE"
