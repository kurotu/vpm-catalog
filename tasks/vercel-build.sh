#!/bin/bash
set -eu

ZIP_DIR=vpm/zips
ROOT="$(cd "$(dirname "$0")" && pwd)/.."

# CI always uses the full repository list
export VPM_REPOS_FILE="$ROOT/repositories.txt"

"$ROOT"/tasks/vercel-cache-download.sh "$ZIP_DIR"

"$ROOT"/tasks/download-repos.sh
"$ROOT"/tasks/download-packages.sh

astro build
pnpm run index

"$ROOT"/tasks/vercel-cache-upload.sh "$ZIP_DIR"
