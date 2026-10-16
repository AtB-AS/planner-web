#!/bin/bash

# Builds the widget for every org from the current source and takes a
# screenshot of each one with Playwright. Widgets are built to a temporary
# directory, so nothing in public/widget is changed. Screenshots are saved
# to widget-screenshots/.
#
# The assistant page & departures page are screenshotted too, for comparison. It is taken from the
# already running app (E2E_URL or http://localhost:3000), so start
# `pnpm dev` first.

set -e

BUILD_DIR=$(mktemp -d)
trap 'rm -rf "$BUILD_DIR"' EXIT

for ORG_FILE in orgs/*.json; do
  ORG_ID=$(basename "$ORG_FILE" .json)
  if [ "$ORG_ID" = "schema-validation" ]; then
    continue
  fi

  echo "Building widget for $ORG_ID"
  NEXT_PUBLIC_PLANNER_ORG_ID=$ORG_ID pnpm vite build ./src/widget \
    --outDir "$BUILD_DIR/$ORG_ID" --emptyOutDir

  # Same PostCSS workaround as in build-widget.sh
  npx postcss --config . "$BUILD_DIR/$ORG_ID/planner-web.css" \
    -o "$BUILD_DIR/$ORG_ID/planner-web.css"
done

rm -rf widget-screenshots
WIDGET_BUILD_DIR="$BUILD_DIR" pnpm playwright test e2e-tests/widget.spec.ts \
  --project chromium
