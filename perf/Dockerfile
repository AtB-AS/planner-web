# Runtime-only image for local perf testing.
#
# This is NOT the production Dockerfile (that one builds all 5 orgs and needs
# mapbox secrets). This image just wraps a *prebuilt* single-org standalone
# bundle so we can measure runtime CPU/memory of the container under a
# k8s-like cgroup limit, and iterate quickly on before/after comparisons.
#
# `perf/build.sh` produces `dist/<org>/standalone/...` (via `pnpm build:docker`)
# on the host first, then builds this image. It mirrors the `runner` stage of
# the production Dockerfile so runtime behavior is representative.
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Prebuilt standalone output (+ its bundled node_modules) and the org switcher.
COPY --chown=nextjs:nodejs dist ./dist
COPY --chown=nextjs:nodejs server.js ./

USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
