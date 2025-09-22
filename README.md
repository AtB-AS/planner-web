# Travel Planner Web

Travel planner for OMS.

## Configuration and initial setup

For initial start you can copy `.env.example` like so:

```
cp .env.example .env.local
```

And populate the `.env.local` file with settings for your org.

```
# What ORG to activate (nfk | atb | fram | troms | vkt | farte)
NEXT_PUBLIC_PLANNER_ORG_ID=atb


# Specifies what environment to build locally (dev | staging | prod)
NEXT_PUBLIC_ENVIRONMENT=dev

# ... etc
```

See all additional configuration in `.env.example`.

### Setup & Running locally

```bash

# Generate assets and icons specific for org
yarn refresh-assets

# Run development build
yarn dev

# Open service
open http://localhost:3000
```

### Changing organization

To easily change organization, change `NEXT_PUBLIC_PLANNER_ORG_ID` in your
`.env.local` file and run:

```bash
# Clean assets from old org and create new ones
yarn refresh-assets
```

## Release

### Deploy to staging

Changes to `main` branch will automatically be deployed to staging.

You can see the status of each deploy
[here](https://github.com/AtB-AS/planner-web/actions/workflows/docker.yml).

### Deploy to prod

Built versions of the widget gets released as part of this release process. See
details below for how to build new widget versions.

1. Go to [Releases](https://github.com/AtB-AS/planner-web/releases)
2. Changes to `main` branch will automatically create a new draft release
3. Select previous released tag/version as base for the new release. This will
   automatically populate the changelog with all changes since the last release.
4. Click "Generate release notes"
5. Click "Publish release"

You can see the status of the deploy
[here](https://github.com/AtB-AS/planner-web/actions/workflows/docker.yml).

## Building Planner Widget code

Check that NEXT_PUBLIC_PLANNER_ORG_ID is set in your .env.local file, and run

```
yarn generate-widget
```

This will place asset inside `public/widget/<VERSION>` which will be reachable
through `http://localhost:3000/widget` or
`http://localhost:3000/widget/<VERSION>` (omitting the version will default to
the most recent one).

### Releases and Widget Development

All versions of widgets should be checked in the repo, with specific versions.
This will allow for referring to specific versions and keeping them stable when
integrating. This also means that we should never change existing files.

Version is based on `package.json`. We should always keep this in sync with the
generated version in Releases so the changelog is correct.

### Versioning

All changes made to widget should use commit messages with scope like:

```sh
# New features, but backwards compatible
feat(widget): makes change

# Bug fix, require no changes other than using new bundles.
fix(widget): makes change

# Requires HTML update. Not backwards compatible
breaking-change(widget): makes change
```

This will set correct version in releases on Github.

#### Release flow

1. Bump version in `package.json`. Should match the coming release on Github

2. Generate new asset files to check in by running the following command:

```sh
yarn generate-all-widgets
```

## Sitemap & Stop Place overview

Sitemap is generated automatically and has an overview of all links to departure
pages which can be crawled and searchable through search engines.

Sitemap is generated as part of a build step with correct URLs specified in the
`<org.>.json` files. If you want to generate manually you can run command:

```bash
yarn next-sitemap --config next-sitemap.js
```

### Updating StopPlaces data

If the National Stop Register has changed (new stop places etc), we can generate
a new data layer by running:

```
node scripts/generate-stopplaces/download-and-generate.js
```

This will remove the static cache file and regenerate the data. Doing a deploy
will create sitemap as part of the build step and update all departure URLs with
the new data.
