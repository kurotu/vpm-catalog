#!/bin/bash
set -eu

dnf -y install awscli jq

ROOT="$(cd "$(dirname "$0")" && pwd)/.."
"$ROOT"/tasks/vercel-cache-download.sh

npm install
