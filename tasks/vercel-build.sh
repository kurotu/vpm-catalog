#!/bin/bash
set -eu

ZIP_DIR=vpm/zips
ROOT="$(cd "$(dirname "$0")" && pwd)/.."

"$ROOT"/tasks/vercel-cache-download.sh "$ZIP_DIR"

"$ROOT"/tasks/download-repos.sh
"$ROOT"/tasks/download-packages.sh

astro build
npm run index

"$ROOT"/tasks/vercel-cache-upload.sh "$ZIP_DIR"
