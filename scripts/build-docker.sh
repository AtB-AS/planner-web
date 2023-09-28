#!/bin/bash

# This script prepares and builds the application for a organization
# by setting up the environment, building the application, and organizing the output 
# into a organization specific subdirectiory in the 'dist' directory.

mkdir -p dist
mkdir -p dist/$NEXT_PUBLIC_PLANNER_ORG_ID
echo "Running yarn setup && yarn build for $NEXT_PUBLIC_PLANNER_ORG_ID"
yarn setup $NEXT_PUBLIC_PLANNER_ORG_ID
yarn build

echo "Moving the output into the dist directory"
mv .next/standalone dist/$NEXT_PUBLIC_PLANNER_ORG_ID
mv .next/static dist/$NEXT_PUBLIC_PLANNER_ORG_ID/standalone/.next
cp -r public dist/$NEXT_PUBLIC_PLANNER_ORG_ID/standalone
cp next.config.js dist/$NEXT_PUBLIC_PLANNER_ORG_ID/standalone
