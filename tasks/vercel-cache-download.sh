#!/bin/bash
set -eu

KEY=$("$(dirname "$0")/generate-cache-key.sh")
CACHE_FILE="${KEY}.tar.gz"

echo downloading "$CACHE_FILE"
if aws s3 cp --quiet "s3://vpm-catalog/caches/$CACHE_FILE" .; then
  echo extracting "$CACHE_FILE"
  tar xf "$CACHE_FILE"
else
  echo "cache not found"
fi
