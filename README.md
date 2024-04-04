# Travel Planner Web

TBA

## Configuration

```
# What ORG to activate (nfk | atb | fram | troms)
NEXT_PUBLIC_PLANNER_ORG_ID=atb


# Specifies what environment to build locally (dev | staging | prod)
NEXT_PUBLIC_ENVIRONMENT=dev
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
