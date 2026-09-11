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
# Enable corepack to install the correct pnpm version
corepack enable

# Generate assets and icons specific for org
pnpm refresh-assets

# Run development build
pnpm dev

# Open service
open http://localhost:3000
```

### Changing organization

To easily change organization, change `NEXT_PUBLIC_PLANNER_ORG_ID` in your
`.env.local` file and run:

```bash
# Clean assets from old org and create new ones
pnpm refresh-assets
```

## Developer mode

Developer mode unlocks the debugging interface at `/dev/trip-pattern`, which
lets you edit GraphQL queries directly and see detailed metadata.

To enable it, set the `dev-mode-enabled` cookie to `true`. Run this in the
DevTools console:

```js
document.cookie = 'dev-mode-enabled=true';
```

Then load `/dev/trip-pattern`. This works in any environment — set the cookie on
that host to use dev mode in staging or production too.

## Release

### Deploy to staging

Changes to `main` branch will automatically be deployed to staging.

You can see the status of each deploy
[here](https://github.com/AtB-AS/planner-web/actions/workflows/docker.yml).

### Deploy to prod

To release to production, merge the open Release PR (created automatically by
release-please), which publishes a GitHub Release and triggers the production
deployment.

The version is bumped automatically from the Conventional Commit PR titles. Use
a breaking change (feat!:) to bump the major version.

You can see the status of the deploy
[here](https://github.com/AtB-AS/planner-web/actions/workflows/docker.yml).

## Building Planner Widget code

Check that NEXT_PUBLIC_PLANNER_ORG_ID is set in your .env.local file, and run

```
pnpm generate-widget
```

This will place asset inside `public/widget/<VERSION>` which will be reachable
through `http://localhost:3000/widget` or
`http://localhost:3000/widget/<VERSION>` (omitting the version will default to
the most recent one).

### Releases and Widget Development

All versions of widgets should be checked in the repo, with specific versions.
This will allow for referring to specific versions and keeping them stable when
integrating. This also means that we should never change existing files.

Version is based on `package.json`, which is now owned by release-please. Widget
assets are generated with whatever version is currently in `package.json`, so
generate a new widget version right after a prod release — see the release flow
below.

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

Widget assets are versioned from `package.json`. Generate new asset files to
check in by running the following command:

```sh
pnpm generate-all-widgets
```

## Sitemap & Stop Place overview

Sitemap is generated automatically and has an overview of all links to departure
pages which can be crawled and searchable through search engines.

Sitemap is generated as part of a build step with correct URLs specified in the
`<org.>.json` files. If you want to generate manually you can run command:

```bash
pnpm next-sitemap --config next-sitemap.js
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
