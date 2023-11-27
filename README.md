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

This will place asset inside `public/widget/` and then
`http://localhost:3000/widget` can reach it.

During development you can watch for changes:

```
NEXT_PUBLIC_PLANNER_ORG_ID=atb yarn build:widget -w
```
