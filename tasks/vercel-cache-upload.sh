#!/bin/bash
set -eu

KEY=$("$(dirname "$0")/generate-cache-key.sh")
CACHE_FILE="${KEY}.tar.gz"

echo creating "$CACHE_FILE" with "$@"
tar zcf "$CACHE_FILE" "$@"

echo uploading "$CACHE_FILE"
aws s3 cp --quiet "$CACHE_FILE" "s3://vpm-catalog/caches/$CACHE_FILE"
