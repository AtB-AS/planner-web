#!/bin/bash

# This script generates widget for all orgs based on version found
# in package.json.

mkdir public/widget

for orgId in atb nfk fram; do
  # @TODO FIX THIS
  echo "Building widget for $orgId"
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId yarn build:widget
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId node ./scripts/generate-widget-stat.js
done