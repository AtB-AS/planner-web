#!/bin/bash

# This script generates widget for all orgs based on version found
# in package.json.

mkdir public/widget

for orgId in atb nfk fram troms vkt farte; do
  # @TODO FIX THIS
  echo "Building widget for $orgId"
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId sh ./scripts/build-widget.sh
done
