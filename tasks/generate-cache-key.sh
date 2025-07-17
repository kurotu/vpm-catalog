#!/bin/bash
set -eu

BRANCH="$VERCEL_GIT_COMMIT_REF"
if [ "$BRANCH" = "" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

echo "vpm-catalog-cache-$BRANCH"
