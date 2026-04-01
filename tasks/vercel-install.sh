#!/bin/bash
set -eux

dnf -y install awscli jq

pnpm install
