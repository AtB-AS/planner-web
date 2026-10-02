# planner-web — Performance Analysis & TODO

Investigation into why `planner-web-service` is a scaling/CPU/memory outlier in
GKE compared to the rest of the service catalogue (slow startup, outsized
CPU/memory, HPA thrashing — pinned near ~10 replicas in prod, sluggish at 1
replica in staging).

The single biggest factor is **infra sizing** (see #0): the HPA scales on 50% of
a **100m** CPU request, i.e. it adds replicas whenever a pod uses more than
**50 millicores**. A Node SSR render exceeds that on essentially every request,
so the autoscaler is effectively always scaling up. The app-level findings below
make each request more expensive than it needs to be, which amplifies the
problem — but the infra target is what makes it pathological.

> Legend: 🔴 high impact · 🟡 medium · 🟢 low / cleanup

---

## 0. 🔴 Infra: HPA target vs. CPU request is mis-sized for a Node SSR workload

Lives in `gcp-infra`, not this repo, but it's the root cause so it's tracked here.

- `manifests/amp/services/templates/service/horizontalpodautoscaler.yaml`
  → `targetCPUUtilizationPercentage: 50`, `maxReplicas: 10`.
- `manifests/amp/platform/utility/resources/m/kustomization.yaml` overrides
  resources to `requests.cpu: 100m`, `requests.memory: 384Mi` (**no limits**).
- `manifests/amp/platform/prod/kustomization.yaml` sets `minReplicas: 2`.

Effect: HPA scale-up threshold = 50% × 100m = **50m CPU (~5% of one core)**. Any
React SSR render blows past this instantly, so the deployment sits at or near
`maxReplicas` and thrashes. Rust services idle far below 50m and do less
per-request CPU, so they fit under the same threshold — this is why planner-web
looks like an outlier.

- [ ] Give planner-web its own resource profile: raise CPU **request** to a
      realistic Node-SSR baseline (e.g. `500m`–`1000m`) and set a CPU **limit**.
- [ ] Set a memory **limit** (currently none) to make scheduling/OOM behavior
      deterministic; base it on observed RSS (Firebase Web SDK + Apollo +
      satori/resvg native inflate it — see #4, #5).
- [ ] Reconsider the HPA target now that requests are realistic (50% of a proper
      request is fine; 50% of 100m is not). Consider a longer scale-down
      stabilization window to stop churn.
- [ ] Pin `node --max-old-space-size` to match the container memory limit
      (currently unset — see #7).

## 0b. 🔴 Infra: readiness/liveness probes are disabled

- `manifests/amp/services/bases/planner-web/kustomization.yaml` **removes** both
  `readinessProbe` and `livenessProbe` (the shared template defines them on
  `GET /healthz:8080`). They were presumably removed because `/healthz` did not
  exist and the app listens on `PORT=8080` (set in the overlay `*.env`).

Effect: with no readiness probe, k8s routes traffic to a pod the moment the
container starts — before Next.js is warm — so the first requests to every new
replica (and there are many, given #0) are slow or error. This is a large part
of the perceived "slow startup".

- [x] Add a lightweight `/healthz` endpoint in the app (this change:
      `src/pages/api/healthz.ts` + rewrite in `next.config.js`).
- [ ] Re-enable the readiness + liveness probes in the planner-web base (drop the
      `remove` patch) now that `/healthz` exists. Health check must stay
      dependency-free (no Entur/BFF/Firebase) so downstream outages don't restart
      pods.

---

## 1. 🔴 Firebase **Web SDK** used server-side, uncached, on the hot path

`src/modules/firebase/firebase.ts` initializes the browser `firebase/app` +
`firebase/firestore` SDK and reads Firestore docs **on the server**.

- The Web SDK uses gRPC-WebChannel/long-polling transport designed for browsers,
  not the pooled gRPC of `firebase-admin`. Per-request server use is memory-heavy
  and connection-churny.
- `getTransportModeFilter()` (`src/modules/firebase/transport-mode-filter.ts`) is
  **not cached** and sits on the hottest paths:
  - `src/page-modules/assistant/server/journey-planner/mappers.ts:20`
    (`mapToJourneyPlannerTransportModes`) — runs on **every trip search**.
  - `src/page-modules/assistant/layout.tsx:56`
  - `src/pages/assistant/index.tsx:54`
- `getFareZones()` (`src/modules/firebase/fare-zones.ts`) — uncached (client-side
  via SWR in `src/components/map/use-map-fare-zones.ts`, but the server function
  is uncached where used server-side).
- `getPreassignedFareProducts()` **is** cached (30 min) via
  `src/page-modules/assistant/server/price-product-cache.ts` — this is the
  pattern to replicate everywhere.

**Implemented** (branch `perf/firebase-config-cache`): a server-side config store
(`src/modules/firebase/server-config-store.ts`) that opens one `onSnapshot`
listener per config doc (`travelSearchFilters`, `referenceData`, `urls`), parses
each **once per change**, and serves reads from memory. Pre-warmed at startup via
`src/instrumentation.ts`. Deliberately kept on the **Web SDK** (no
`firebase-admin` / ADC) so it runs unchanged on GKE, local dev and Vercel
previews. Server hot paths (`mappers.ts`, `assistant/index.tsx`,
`price-product-cache.ts`) and the **browser** (via new `/api/config/*` routes
consumed by the map + layout hooks) now read from the store instead of hitting
Firestore per request/session. The old per-call reader modules were deleted.

Measured (`perf/`, 1 CPU / 512 MiB, `/assistant`, medians of repeated runs):

| metric | baseline | this change |
|---|---|---|
| CPU / request | ~3.8 ms | **~0.8 ms (−80%)** |
| Idle memory | ~140–220 MiB (noisy) | ~190 MiB (≈ neutral) |
| Latency p95 | ~150 ms | ~19 ms |

- CPU reduction is stable and reproducible — this is what relieves the HPA.
- Latency/throughput gains are **inflated by laptop→staging WAN latency**; expect
  a smaller absolute gain in-cluster.
- Memory is ≈ neutral. NB: a `firebase-admin` variant measured ~+50–75 MiB
  heavier, which is why we kept the Web SDK. That variant is preserved on branch
  `perf/firebase-admin-config-store` if a service-account path is ever wanted.
- Separately cuts Firestore **read ops**: fare zones / sprite / transport-mode
  filter were previously fetched by every browser session; now one listener per
  pod serves all clients via `/api/config/*`.

- [x] Move server Firestore reads behind the config store (no per-request read).
- [x] Cache transport-mode filter, preassigned products, fare zones, sprite URL.
- [x] Serve config to the client from the server to cut per-session reads.
- [ ] `globalMessagesV2` still uses a per-client `onSnapshot` — likely the largest
      remaining client read source; needs a real-time-aware server solution
      (SSE/poll), not the near-static config pattern.
- [ ] The mobile app reads the same config directly; a shared server config
      endpoint would cut those reads too (cross-team).
- [ ] `pnpm test` — `assistant.test.tsx` mocks were updated; the wider suite
      wasn't re-run after deleting the old reader modules.

## 2. 🔴 Everything is `getServerSideProps`; no output/data caching

- 10/10 pages use `getServerSideProps`, **0** use `getStaticProps`/ISR
  (`src/pages/**`). Every request — including crawlers and probes — pays a full
  SSR render.
- `src/modules/api-server/requesters/graphql-requester.ts` sets
  `fetchPolicy: 'no-cache'` for all queries → Entur is hit live every time.
- A **new `ApolloClient` is built per request** (`createExternalClient` in
  `src/modules/api-server/external-client.ts`), and `composeClientFactories`
  builds 2–3 clients per request (`assistant/server/index.ts`). The module-level
  `InMemoryCache` does nothing under `no-cache` — dead weight.
- The only server cache, `src/page-modules/assistant/server/trip-cache.ts`, has a
  **20s TTL** and is written only from the `/api/assistant/trip` API route
  (`journey-planner/index.ts:243`); the SSR page only reads it, so the SSR path
  rarely benefits.

TODO:
- [ ] Convert genuinely-static pages to static/ISR.
- [ ] Add `Cache-Control` / `stale-while-revalidate` on cacheable SSR responses
      so the ingress/CDN absorbs repeat traffic.
- [ ] Reuse a single Apollo client (or drop Apollo for server `no-cache` calls in
      favor of plain `fetch` — Apollo's machinery is pure overhead here).

## 3. 🟡 Zod validation of large config schemas per request

`@atb-as/config-specs` is ~7.6 MB. Each uncached Firebase read `JSON.parse`s a
large blob then `safeParse`s it (`travelSearchFilters`, `referenceData` →
`preassignedFareProducts_v2`, `fareZones`). Zod parsing of big nested schemas is
synchronous, CPU-heavy work on the event loop — precisely the bursty CPU that
makes a 50m-target HPA thrash. Fixed largely by caching the *parsed* result (#1).

- [ ] Cache parsed results, not raw docs, so Zod runs once per TTL window.

## 4. 🟡 On-the-fly OG image rendering (satori + resvg)

`src/pages/api/departures/og-departure.tsx`, `src/pages/api/departures/og-location.tsx`:
render 1200×630 PNGs via `satori` + `@resvg/resvg-js` (native), and `readFile`
the fonts **on every request**. This is some of the most CPU-expensive work a
Node process can do, hit hard by social/link-preview crawlers.

- [ ] Cache rendered OG images (CDN + long `Cache-Control`).
- [ ] Load/parse fonts once at module scope, not per request.
- [ ] Consider pre-generating or moving OG rendering out of the request path.

## 5. 🟡 Heavy server bundle / image footprint

- The Docker image builds **all 5 orgs** into `dist/` and ships them all in the
  runner stage (`Dockerfile`; `server.js` picks one at runtime via
  `NEXT_PUBLIC_PLANNER_ORG_ID`). Larger image = slower pulls = slower pod start,
  even though only one org runs.
- `mapbox-gl` is correctly kept out of the server bundle (`Map` is
  `dynamic(..., { ssr:false })` in `src/components/map/dynamic-map.tsx`, and
  `src/components/map/utils.ts` uses `import type` from `mapbox-gl`). ✅ verified,
  no action — noted so it isn't "fixed" by mistake.

- [ ] Build per-org images (or prune unused `dist/*` in the runner stage).

## 6. 🟢 `middleware.js` CORS logic is broken

`middleware.js:13` calls `req.headers.get('origin')` and discards the result;
line 15 then references a bare `origin` that is never defined →
`ReferenceError` / always-false on every `/api/departures/*` request.

- [ ] Fix: `const origin = req.headers.get('origin');` before the check (or
      remove the middleware if the per-route CORS in `external-client.ts` already
      covers it).

## 7. 🟢 No Node memory tuning

No `NODE_OPTIONS` / `--max-old-space-size` anywhere. Combined with the missing
container memory limit (#0), heap sizing is left to V8 defaults under an
unbounded cgroup.

- [ ] Set `--max-old-space-size` to match the container memory limit once #0 sets
      one.

## 8. 🟢 Per-request logging overhead

`graphql-requester.ts` logs full response headers and `JSON.stringify`s every
Apollo error per call. Minor, but it's on the hot path.

- [ ] Trim to what's needed; avoid stringifying large objects on the happy path.

---

## Suggested order of attack

1. **#0 / #0b** (infra): right-size CPU/memory requests+limits, re-enable probes
   against the new `/healthz`. Biggest, fastest win — directly stops the HPA
   thrash and the "traffic before ready" slowness.
2. **#1 + #3**: `firebase-admin` + cache the config reads. Removes a per-request
   network hop and a Zod parse from the hottest path.
3. **#4**: CDN-cache OG images, load fonts once.
4. **#2**: response caching / static-ify / single Apollo client.
5. Cleanups: #5, #6, #7, #8.

## Measuring before/after locally

A local harness lives in [`perf/`](./perf/README.md). It builds a single-org
standalone bundle, wraps it in a runtime container under a k8s-like
`--cpus`/`--memory` limit, drives HTTP load at it, and reports **CPU time per
request** and **peak/idle memory** read straight from the container's cgroup v2
counters. Run it on `main` and on a change branch, then `perf/compare.sh` the two.

For the Firebase change (#1) specifically, the harness hammers `GET /assistant`
(no query) — that path performs exactly one uncached `getTransportModeFilter`
Firestore read and then redirects, with no BFF/Entur calls, so it isolates the
Firebase cost using only the public staging config.

## Not yet verified (needs a live profile)

Findings above are from static analysis of the code + manifests. The `perf/`
harness quantifies #1 (and any per-request change) locally; to attribute the
full CPU/memory split in production, also run a profile against a staging pod
under load (`node --prof`, `clinic.js`, or a flame graph).
