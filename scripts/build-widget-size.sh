#!/bin/bash

# Builds the AtB widget into .widget-size/ so its size can be checked with
# size-limit (see .size-limit.json), without touching public/widget or the
# manifests.

set -e

OUT_DIR="$(pwd)/.widget-size"

NEXT_PUBLIC_PLANNER_ORG_ID=atb pnpm vite build ./src/widget \
  --outDir "$OUT_DIR" --emptyOutDir
