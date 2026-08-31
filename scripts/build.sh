#!/bin/bash
set -e

# This script prepares and organizes the application for different organizations
# by setting up the environment, building the application, and organizing the output
# into the 'dist' directory with separate subdirectories for each organization.

mkdir dist

for orgId in atb nfk fram troms vkt farte; do
  mkdir dist/$orgId
  export NEXT_PUBLIC_PLANNER_ORG_ID=$orgId
  # @TODO FIX THIS
  echo "Running pnpm setup && pnpm build for $orgId"
  pnpm setup $orgId
  pnpm build

  echo "Moving the output into the dist directory"
  mv .next/standalone dist/$orgId
  mv .next/static dist/$orgId/standalone/.next
  cp -r public dist/$orgId/standalone
  cp next.config.js dist/$orgId/standalone
done
