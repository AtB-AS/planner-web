#!/bin/bash

# This script generates widget for all orgs based on version found
# in package.json.

set -e

mkdir -p public/widget

if [ -n "$NEXT_PUBLIC_PLANNER_ORG_ID" ]; then
    ORG_ID="$NEXT_PUBLIC_PLANNER_ORG_ID"
    echo "Found NEXT_PUBLIC_PLANNER_ORG_ID= $ORG_ID in environment. Building widget for $ORG_ID"
    NEXT_PUBLIC_PLANNER_ORG_ID=$ORG_ID pnpm build:widget
    NEXT_PUBLIC_PLANNER_ORG_ID=$ORG_ID node ./scripts/generate-widget-stat.js
else
  echo "No NEXT_PUBLIC_PLANNER_ORG_ID found in environment. Please expose it, or build all widgets instead"
  exit 1
fi

