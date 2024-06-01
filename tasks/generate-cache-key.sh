#!/bin/bash
set -eu

BRANCH="$VERCEL_GIT_COMMIT_REF"
if [ "$BRANCH" = "" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi
YEAR_WEEK=$(date +%Y-week%V)

echo "vpm-catalog-cache-$BRANCH-$YEAR_WEEK"
