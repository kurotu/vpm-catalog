#!/bin/bash
set -eu

KEY=$("$(dirname "$0")/generate-cache-key.sh")
CACHE_DIR="vpm-catalog/caches/$KEY"

echo "Syncing files from s3://$CACHE_DIR/"
if aws s3 sync --endpoint-url="$S3_ENDPOINT_URL" --no-progress "s3://$CACHE_DIR/" "$1"; then
  echo "Cache downloaded successfully"
else
  echo "cache not found"
fi
