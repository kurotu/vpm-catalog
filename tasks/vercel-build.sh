#!/bin/bash
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)/.."
"$ROOT"/tasks/download-repos.sh
"$ROOT"/tasks/download-packages.sh

astro build
npm run index

"$ROOT"/tasks/vercel-cache-upload.sh vpm/zips
