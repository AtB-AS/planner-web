#!/bin/bash

# This script generates widget for all orgs based on version found
# in package.json.

set -e

mkdir -p public/widget

for orgId in atb nfk fram vkt farte; do
  # @TODO FIX THIS
  echo "Building widget for $orgId"
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId bash ./scripts/build-widget.sh
done
