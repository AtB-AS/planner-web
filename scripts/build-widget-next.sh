#!/bin/bash

# Builds the unreleased `next` widget for the current org from the current
# source, into public/widget/<org>/next. It is not checked in and not added to
# the manifests. Used for non-production builds (see build-docker.sh), so widget
# changes can be tested before they are released.

set -e

if [ -z "$NEXT_PUBLIC_PLANNER_ORG_ID" ]; then
  echo "No NEXT_PUBLIC_PLANNER_ORG_ID found in environment."
  exit 1
fi

echo "Building next widget for $NEXT_PUBLIC_PLANNER_ORG_ID"
WIDGET_VERSION=next pnpm build:widget

ORG_DIR=$(node -p "require('lz-string').compressToEncodedURIComponent(process.env.NEXT_PUBLIC_PLANNER_ORG_ID)")
CSS_FILE="public/widget/$ORG_DIR/next/planner-web.css"

# Same PostCSS workaround as in build-widget.sh
npx postcss --config . "$CSS_FILE" -o "$CSS_FILE"

if grep -q 'token(' "$CSS_FILE"; then
  echo "Unprocessed token() found in $CSS_FILE"
  exit 1
fi
