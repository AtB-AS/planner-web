# Travel Planner Web

Travel planner for OMS.

## Configuration and initial setup

```
# What ORG to activate (nfk | atb | fram | troms | vkt | farte)
NEXT_PUBLIC_PLANNER_ORG_ID=atb


# Specifies what environment to build locally (dev | staging | prod)
NEXT_PUBLIC_ENVIRONMENT=dev

# ... etc
```

See all additional configuration in `.env.example`. For initial start you can
copy `.env.example` like so:

```
cp .env.example .env.local
```

And populate the `.env.local` file with settings for your org.

### Setup & Running locally

```bash

# Generate assests and icons specific for org
NEXT_PUBLIC_PLANNER_ORG_ID=<orgID> yarn setup

# Run development build
yarn dev

# Open service
open http://localhost:3000
```

## Building Planner Widget code

Example of creating widget for AtB:

```
NEXT_PUBLIC_PLANNER_ORG_ID=atb yarn build:widget
```

This will place asset inside `public/widget/<VERSION>` which will be reachable
through `http://localhost:3000/widget/<VERSION>`.

During development you can watch for changes:

```
NEXT_PUBLIC_PLANNER_ORG_ID=atb yarn build:widget -w
```

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
yarn generate-widget-version
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
