# Travel Planner Web

TBA

## Configuration

```
# What ORG to activate (nfk | atb | fram)
NEXT_PUBLIC_PLANNER_ORG_ID=atb
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

Widget is cached for a long time, so you might want to clear cache while
developing.

### Releases and Widget Development

All versions of widgets should be checked in the repo, with specific versions.
This will allow for referring to specific versions and keeping them stable when
integrating.

This also means that we should never change existing files.

Version is based on `package.json`. We should always keep this in sync with the
generated version in Releases so the changelog is correct.

Generate asset files to check in by running the following command:

```sh
yarn generate-widget-version
```
