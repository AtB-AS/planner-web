# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG ATB_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ARG ATB_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

ARG NFK_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ARG NFK_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

ARG FRAM_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ARG FRAM_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

# Build AtB
ENV NEXT_PUBLIC_PLANNER_ORG_ID="atb"
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LAT=$ATB_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LNG=$ATB_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

RUN --mount=type=secret,id=ATB_NEXT_PUBLIC_MAPBOX_API_TOKEN \
  --mount=type=secret,id=ATB_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL \
  sh -c 'NEXT_PUBLIC_MAPBOX_API_TOKEN=$(cat /run/secrets/ATB_NEXT_PUBLIC_MAPBOX_API_TOKEN) \
  NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL=$(cat /run/secrets/ATB_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL) \
  yarn build:docker'

# Build NFK
ENV NEXT_PUBLIC_PLANNER_ORG_ID="nfk"
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LAT=$NFK_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LNG=$NFK_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

RUN --mount=type=secret,id=NFK_NEXT_PUBLIC_MAPBOX_API_TOKEN \
  --mount=type=secret,id=NFK_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL \
  sh -c 'NEXT_PUBLIC_MAPBOX_API_TOKEN=$(cat /run/secrets/NFK_NEXT_PUBLIC_MAPBOX_API_TOKEN) \
  NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL=$(cat /run/secrets/NFK_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL) \
  yarn build:docker'

# Build FRAM
ENV NEXT_PUBLIC_PLANNER_ORG_ID="fram"
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LAT=$FRAM_NEXT_PUBLIC_MAPBOX_DEFAULT_LAT
ENV NEXT_PUBLIC_MAPBOX_DEFAULT_LNG=$FRAM_NEXT_PUBLIC_MAPBOX_DEFAULT_LNG

RUN --mount=type=secret,id=FRAM_NEXT_PUBLIC_MAPBOX_API_TOKEN \
  --mount=type=secret,id=FRAM_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL \
  sh -c 'NEXT_PUBLIC_MAPBOX_API_TOKEN=$(cat /run/secrets/FRAM_NEXT_PUBLIC_MAPBOX_API_TOKEN) \
  NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL=$(cat /run/secrets/FRAM_NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL) \
  yarn build:docker'

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir dist
RUN chown nextjs:nodejs dist

COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY server.js ./

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]