#!/usr/bin/env bash
#
# Build a single-org standalone bundle on the host and wrap it in the perf
# runtime image (perf/Dockerfile).
#
# Usage:
#   perf/build.sh <tag> [org]
#
#   <tag>  label for the image, e.g. `baseline` or `candidate`
#   [org]  org id to build (default: atb)
#
# The result is an image tagged `planner-web-perf:<tag>`.
#
# Env knobs:
#   SKIP_SETUP=1   skip `pnpm setup` (asset generation) if public/assets already
#                  exists — makes rebuilds much faster while iterating.
set -euo pipefail

cd "$(dirname "$0")/.."

TAG="${1:?usage: perf/build.sh <tag> [org]}"
ORG="${2:-atb}"

# NEXT_PUBLIC_* values are inlined at *build* time (into both client and server
# bundles), so the Firebase config must be present now. We load .env.local via
# dotenv-cli (a project devDependency) rather than `source`, because env files
# aren't valid shell — placeholder values like `<mapbox token>` or values with
# spaces break `source`/`sh`. dotenv-cli does NOT override vars already exported
# below, so the org-specific overrides win.
export NEXT_PUBLIC_PLANNER_ORG_ID="$ORG"
export NEXT_PUBLIC_ENVIRONMENT="${NEXT_PUBLIC_ENVIRONMENT:-staging}"
export NEXT_PUBLIC_BUILD_ID="${NEXT_PUBLIC_BUILD_ID:-perf-$TAG}"

# org-data validates that all Mapbox vars are present at build time (during page
# data collection), even though the /assistant perf path never touches Mapbox
# server-side. Supply harmless placeholders so the build succeeds without needing
# the real Mapbox secrets. A caller-provided value still wins; dotenv-cli won't
# override these exports either.
export NEXT_PUBLIC_MAPBOX_API_TOKEN="${NEXT_PUBLIC_MAPBOX_API_TOKEN:-perf-dummy-token}"
export NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL="${NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL:-mapbox://styles/perf/dummy}"
export NEXT_PUBLIC_MAPBOX_USER_NAME="${NEXT_PUBLIC_MAPBOX_USER_NAME:-perf}"
export NEXT_PUBLIC_MAPBOX_NSR_TILESET_ID="${NEXT_PUBLIC_MAPBOX_NSR_TILESET_ID:-perf.dummy}"
export NEXT_PUBLIC_MAPBOX_NSR_SOURCE_LAYER_ID="${NEXT_PUBLIC_MAPBOX_NSR_SOURCE_LAYER_ID:-dummy}"
export NEXT_PUBLIC_MAPBOX_DEFAULT_LAT="${NEXT_PUBLIC_MAPBOX_DEFAULT_LAT:-63.4305}"
export NEXT_PUBLIC_MAPBOX_DEFAULT_LNG="${NEXT_PUBLIC_MAPBOX_DEFAULT_LNG:-10.3951}"

# Run a command with .env.local loaded (if present), else run it directly.
run() {
  if [[ -f .env.local ]]; then
    pnpm exec dotenv -e .env.local -- "$@"
  else
    "$@"
  fi
}

echo ">> Building standalone bundle for org=$ORG (tag=$TAG)"
rm -rf .next dist
mkdir -p "dist/$ORG"

# GraphQL codegen — emits the *.generated.ts files from the *.gql documents by
# introspecting the Entur schema. The production Dockerfile runs this before the
# build; without it webpack fails on missing `*.generated` modules.
run pnpm generate

if [[ "${SKIP_SETUP:-0}" != "1" ]]; then
  run pnpm setup
else
  echo ">> SKIP_SETUP=1 — reusing existing public/assets"
fi

run pnpm build

# Arrange output exactly like scripts/build-docker.sh so root server.js finds it.
mv .next/standalone "dist/$ORG"
mv .next/static "dist/$ORG/standalone/.next"
cp -r public "dist/$ORG/standalone"
cp next.config.js "dist/$ORG/standalone"

echo ">> Building perf image planner-web-perf:$TAG"
DOCKER_BUILDKIT=1 docker build -f perf/Dockerfile -t "planner-web-perf:$TAG" .

echo ">> Done. Image: planner-web-perf:$TAG (org=$ORG)"
