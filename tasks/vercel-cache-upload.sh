#!/bin/bash
set -eu

KEY=$("$(dirname "$0")/generate-cache-key.sh")
CACHE_DIR="vpm-catalog/caches/$KEY"

echo "Syncing files to s3://$CACHE_DIR/"
aws s3 sync --endpoint-url="$S3_ENDPOINT_URL" --no-progress "$1" "s3://$CACHE_DIR/"
