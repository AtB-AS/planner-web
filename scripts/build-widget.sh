#!/bin/bash

# This script generates widget for all orgs based on version found
# in package.json.

mkdir public/widget

for orgId in atb nfk fram troms vkt farte; do
  # @TODO FIX THIS
  echo "Building widget for $orgId"
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId yarn build:widget
  NEXT_PUBLIC_PLANNER_ORG_ID=$orgId node ./scripts/generate-widget-stat.js
done

# Workaround for PostCSS processing issue
# Issue: PostCSS does not allow control over plugin execution order, meaning the "composes" 
# CSS is not processed before other plugins. As a result, parts of the CSS remain unprocessed.
#
# Workaround: Run PostCSS twice to ensure CSS imported using "composes" also is processed properly.

BASE_DIR="public/widget"
VERSION=$(node -p "require('./package.json').version")

for FOLDER in "$BASE_DIR"/*/; do
  FOLDER_NAME=$(basename "$FOLDER")
  FILE_NAME="$BASE_DIR/$FOLDER_NAME/$VERSION/planner-web.css"
  npx postcss "$FILE_NAME" -o "$FILE_NAME"
done

echo "Post processing completed"
