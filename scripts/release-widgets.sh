#!/bin/bash

# Generates widgets for all orgs with the version in package.json, but only
# keeps them if the output differs from the previous widget version. Used by
# the widget release workflow on release-please PRs.
#
# The version string is normalized before comparing, since it is baked into
# the bundle. Set FORCE_WIDGET_RELEASE=true to keep the new version regardless.

set -e

BASE_DIR="public/widget"
MANIFEST_DIR="src/page-modules/widget/available-widgets"
VERSION=$(node -p "require('./package.json').version")
FILES="planner-web.css planner-web.d.ts planner-web.mjs planner-web.umd.js"

bash ./scripts/build-all-widgets.sh

normalize() {
  # Escape dots so the version is matched literally
  sed "s/${2//./\\.}/__VERSION__/g" "$1"
}

CHANGED=false
for ORG_DIR in "$BASE_DIR"/*/; do
  ORG_DIR="${ORG_DIR%/}"
  NEW_DIR="$ORG_DIR/$VERSION"

  # Not an org folder from this build
  if [[ ! -d "$NEW_DIR" ]]; then
    continue
  fi

  for FILE in $FILES; do
    if [[ ! -f "$NEW_DIR/$FILE" ]]; then
      echo "::error::Missing $NEW_DIR/$FILE after build"
      exit 1
    fi
  done

  PREVIOUS=$(ls "$ORG_DIR" | grep -vxF "$VERSION" | sort -V | tail -n 1)
  if [[ -z "$PREVIOUS" ]]; then
    echo "$ORG_DIR: no previous version"
    CHANGED=true
    continue
  fi

  for FILE in $FILES; do
    if [[ ! -f "$ORG_DIR/$PREVIOUS/$FILE" ]] ||
      ! cmp -s <(normalize "$ORG_DIR/$PREVIOUS/$FILE" "$PREVIOUS") \
        <(normalize "$NEW_DIR/$FILE" "$VERSION"); then
      echo "$ORG_DIR: $FILE differs from $PREVIOUS"
      CHANGED=true
    fi
  done
done

if [[ "$CHANGED" == true ]]; then
  echo "Widget changed, keeping version $VERSION"
elif [[ "$FORCE_WIDGET_RELEASE" == true ]]; then
  echo "Widget unchanged, but FORCE_WIDGET_RELEASE is set, keeping version $VERSION"
elif [[ -n "$(git ls-files -- "$BASE_DIR/*/$VERSION/*")" ]]; then
  echo "Widget unchanged, but $VERSION is already committed, keeping it"
else
  echo "Widget unchanged since previous version, discarding $VERSION"
  # Only touch what this script generated, to keep other local changes
  for ORG_DIR in "$BASE_DIR"/*/; do
    rm -rf "${ORG_DIR%/}/$VERSION"
  done
  git checkout -- "$MANIFEST_DIR"/*/manifest.json
fi
