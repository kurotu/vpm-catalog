#!/bin/bash
set -eu

dnf -y install awscli jq

pnpm install
