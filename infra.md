# planner-web — CPU / SSR performance analysis

Why this doc: after the server-side Firestore config-store change was merged to
staging, planner-web still spikes CPU and scales to ~10 replicas on light traffic
(a single trip-search visit). This captures what's actually happening, why, which
code paths are CPU-intensive, and the options to reduce the load — ranked by ROI.

**TL;DR:** the spikes are the normal CPU cost of live Node SSR rendering colliding
with a mis-sized HPA (scales at ~50 millicores, throttles at 250m). It is **chronic
and pre-dates the merge** — not caused by the config-store change. Node SSR is
inherently more CPU-spiky than our Rust services. The highest-ROI fix is infra
(right-size CPU request/limit + HPA stabilization); the app can also be made
meaningfully cheaper per request.

---

## 1. Cluster evidence (staging `atb-staging-c420`)

Measured live on the deployed candidate:

- **Idle:** 2 pods at **1m CPU / ~175 MiB**. The new `onSnapshot` config listeners
  cost ~nothing at rest, and there are **no** `server-config-store` / listener /
  re-subscribe errors in the logs. → rules out a background-CPU regression from the
  change.
- **Under load** (~4 concurrent page renders for ~50s via `curl`): scaled 2 → 6–10
  pods; freshly-started pods pegged at **229–250m CPU = their CPU limit** (i.e. being
  CPU-throttled while rendering).
- **Resources:** `requests.cpu=100m`, `limits.cpu=250m`, `mem 384Mi req / 512Mi limit`.
- **HPA:** `targetCPUUtilizationPercentage: 50`, min depends on env, max 10.
  → scale-up trigger = 50% of the 100m request = **50m (~5% of one core)**.
- **History:** the HPA has flapped 1↔10 for **10+ days**
  (`SuccessfulRescale … (x37 over 10d)`, `(x32 over 10d)` …) — well before the merge.
- Single SSR page render ≈ **0.45s / 15 KB**; single `/api/assistant/trip` ≈ **1s /
  139 KB** (dominated by Entur I/O wait, not CPU).

How to reproduce:
```bash
kubectl -n atb-staging-c420 get hpa planner-web-service
kubectl -n atb-staging-c420 top pods | grep planner        # idle ~1m
# sustained load on the real page URL, watch top + hpa climb:
PAGE='https://atb-staging.planner-web.mittatb.no/assistant?filter=bus,tram,rail&searchMode=now&fromId=...&toId=...'
while true; do curl -s -o /dev/null "$PAGE" & ... ; done
```

---

## 2. Root cause: HPA / resource sizing (infra)

The autoscaler math makes any real request trigger a scale-up, and the CPU limit
throttles the very renders that cause it:

- HPA utilisation = `actual CPU / request`. With `request=100m` and `target=50%`, it
  scales whenever a pod averages **>50m** — a single React `renderToString` blows
  past that instantly. Rust services idle far below 50m and do less per-request CPU,
  so they never trip it — this is why planner-web looks like the outlier.
- `limit=250m` means a pod can never use more than a quarter-core. A trip-search SSR
  render wants ~a full core briefly, so it gets **throttled** (we saw pods pinned at
  exactly 250m). That throttling is a large part of "staging feels slow".
- Low request + CPU-percentage HPA + no stabilization ⇒ **thrash**: scale to 10 on a
  blip, scale back down seconds later, repeat.

Manifests: `gcp-infra/manifests/amp/platform/utility/resources/m/kustomization.yaml`
(the `100m/384Mi` override) and
`gcp-infra/manifests/amp/services/templates/service/horizontalpodautoscaler.yaml`
(`target 50`, `max 10`).

---

## 2b. Startup-CPU cascade — why one search → 10 replicas

Observed: hitting the frontend does *not* spike, but the **first search** does, and it
spawns a chain up to 10 replicas. Measured container startup CPU with **zero traffic**
(local docker, 1 core):

| phase | this branch | main (baseline) |
|---|---|---|
| first ~2s of boot | ~92% of a core | ~108% of a core |
| 2–4s | ~50% | ~6% |
| settled (idle) | ~1% | ~1% |

A booting pod wants **~1 full core for 2–4s**, regardless of our change (main is the
same / slightly higher — so this is Node/Next boot cost, not the config store). In
prod the pod is **limited to 250m**, so that boot is throttled to a quarter-core and
sits **pegged at the 250m limit for several seconds**.

The cascade:
1. A search does real CPU work → a pod crosses the **50m** trigger → HPA adds a pod.
2. The new pod boots **pegged at its 250m limit** (throttled cold start) for seconds.
3. HPA averages CPU across all pods, sees the booting pod maxed → adds more.
4. Each added pod also boots hot → self-reinforcing → **runs to maxReplicas=10**.
5. Once all warm, CPU collapses to ~1m → scales back down → thrash.

Amplifiers (all infra): request `100m` (trigger = 50m; a 250m boot ≈ 500% of request);
limit `250m` (throttles the boot, *prolonging* the hot window); **no readiness probe**
(booting pods are counted in the HPA average and served while cold); no scale-up
stabilization (HPA reacts to the transient boot spike instantly).

**Most effective single fix: a readiness probe.** The HPA **excludes not-yet-Ready
pods from its scale-up utilisation math** (treats them as 0%), so booting pods stop
driving further scale-ups — this breaks the chain. It needs a lightweight health
endpoint (the `/healthz` discussed previously; the shared template already probes
`/healthz:8080`, and the planner-web base currently *removes* that probe). Combine with:
raise the CPU request (boot becomes a smaller %), raise the limit (boot finishes fast),
and add scale-up stabilization (30–60s) so transient boot CPU is ignored.

This is chronic and predates the merge (identical boot cost on `main`).

## 3. CPU-intensive server code paths (per request, ranked)

Focused on the assistant (trip search) path, which is the heavy one. The `/trip`
data is ~139 KB and is transformed leg-by-leg on the server.

1. **Trip response transform + per-leg map extension.**
   `src/page-modules/assistant/server/journey-planner/index.ts` (`mapRawTripResponse`,
   `extendLeg`, ~558-577) runs for every leg of every trip pattern (default 8), and
   each leg calls `mapToMapLegs` in `src/components/map/utils.ts:40-102`, which:
   - **decodes the polyline** (`@mapbox/polyline.decode`, hundreds–thousands of
     lat/lon pairs per leg), and
   - runs a **closest-point search over all decoded points** to find start/end
     indices → roughly O(patterns × legs × points) per request.
   - **[done]** The closest-point search (`findIndex`) previously called the
     trig/sqrt haversine on every point; replaced with an equirectangular
     squared-distance scan (exact 100 m gate preserved via one haversine on the
     winner). Microbenchmark (24 legs × 500 pts × 2): **0.82 ms → 0.028 ms per
     trip (~29×)**, identical indices, `departure-details` test still green.
   - Still worth exploring: `mapToMapLegs` runs on the **server** even though the
     map is client-only (`dynamic(ssr:false)`) — moving it (or the polyline
     decode) client-side would remove this work from the SSR path entirely.
2. **Parallel per-leg refresh queries + date math.** `journey-planner/index.ts:340-390`
   fires one GraphQL query per transit leg and does `date-fns` parsing/adjustment per
   leg. Mostly I/O, but the response parsing + date work is CPU.
3. **`lz-string` compress/decompress** of per-pattern detail-link query strings —
   `journey-planner/index.ts:510-594` (CPU-bound, once per pattern).
4. **Via-trip Cartesian combination** of pattern segments — `journey-planner/index.ts:650-703`
   (N×M pattern copies when a via is present).
5. **Situations/notices filtering** — `src/modules/situations-and-notices/utils.ts:96-166`:
   dedupe by id, multilingual `getTextForLanguage`, and `date-fns` validity checks per
   situation, applied across every leg's notice arrays.
6. **React 19 `renderToString`** of the large assistant/departures trees (framer-motion,
   react-aria-components) — inherent, unavoidable SSR cost and likely the single
   biggest CPU consumer on a full page render.
7. **`zod.safeParse` of config/products** — now cached in the config store, so this is
   *mostly addressed*; noted for completeness.

> Attribution note: #1–#5 are code we can optimise; #6 is inherent to SSR. A
> `node --prof` / clinic flamegraph of one trip render would confirm the split
> in-process — recommended before investing in #1.

---

## 4. Per-request overhead (not rendering)

1. **Access logging serialises page props on every request.**
   `src/modules/logging/log-page-access.ts:28-47` — `logPageAccess` calls
   `limitedStringify(await propsResult.props)` on **every** SSR request, ungated by
   log level/env. *Measured:* ~**0.0025 ms/request** — the depth-2 cap truncates the
   tree to ~900 chars, so despite looking scary this is **negligible CPU**. Left as-is;
   only worth revisiting if the depth cap is ever raised.
2. **New ApolloClient per request (×2–3).** `graphql-requester.ts:32-82` +
   `api-server/index.ts:57-62`: `composeClientFactories` builds 2–3 clients per
   request, each with `fetchPolicy:'no-cache'` (so the `InMemoryCache` is dead weight),
   a logging link, a `uuidv4()` correlation id, and header copying. Apollo's machinery
   is pure overhead for `no-cache` server calls.
3. **Per-graphql-call logging** (`logApiResponse`) + several `new Date()` / `Timer`
   allocations per request and per call — `src/modules/logging/*`,
   `graphql-requester.ts:56-74`.
4. **Response compression** — Next's default `compress: true` gzips every response on
   the Node process (CPU that a CDN/ingress could do instead).
5. **Broken CORS middleware still executes** on `/api/departures/*` — `middleware.js:13-15`
   references an undefined `origin` (the header read on the line above is discarded),
   so it appends CORS headers on every matched request while the origin check is dead.
6. **OG images (crawler-only).** `src/pages/api/departures/og-departure.tsx`,
   `og-location.tsx` run satori + `@resvg/resvg-js` and `readFile` the fonts per call.
   Only hit by link-preview crawlers, not normal traffic — but expensive and uncached
   per hit, so a shared link can cause a bursty spike.

---

## 5. Mitigations, ranked by ROI

Impact = rough CPU relief; all are pages-router compatible unless noted.

### Infra (highest ROI, no app change)
| Change | Impact | Effort/Risk |
|---|---|---|
| **Re-enable the readiness probe** (needs a `/healthz` endpoint) | Breaks the startup-CPU cascade — HPA excludes not-Ready pods from scale-up (§2b) | Low (needs endpoint) |
| Right-size CPU **request** (e.g. 250–500m) so 50% target isn't 50m | Stops premature scale-up / thrash | Low |
| Raise CPU **limit** to ~1 core (1000m) so renders/boot aren't throttled | Faster renders + faster boot (shorter hot window) | Low |
| Add HPA **scale-up (30–60s) + scale-down (300–600s) stabilization** | Ignores transient boot spikes; ~50–80% less churn | Low |
| Consider scaling on **RPS/latency** (custom metric) instead of raw CPU% | More accurate for bursty SSR | Medium |

Sources: [Sysdig — CPU requests/limits & autoscaling](https://www.sysdig.com/blog/kubernetes-cpu-requests-limits-autoscaling),
[OneUptime — HPA stabilization window](https://oneuptime.com/blog/post/2026-02-09-hpa-stabilization-window-prevent-thrashing/view),
[Why HPA doesn't scale well on CPU](https://medium.com/@yousaf.k.hamza/why-kubernetes-hpa-doesnt-scale-when-traffic-spikes-and-why-cpu-based-autoscaling-sometimes-1c837e42e417).

### Node / V8 tuning (cheap, container-wide)
| Change | Impact | Effort/Risk |
|---|---|---|
| `--max-semi-space-size` (~64) — bigger young-gen, fewer promotions | ~20% GC/throughput win under SSR churn | Low |
| `--max-old-space-size` matched to the memory limit (~400 in 512Mi) | Avoids OOM / GC thrash | Low |
| `UV_THREADPOOL_SIZE` (~8) for I/O concurrency | Minor latency | Low |

Sources: [NearForm — max-semi-space-size & GC](https://nearform.com/digital-community/optimising-node-js-applications-the-impact-of-max-semi-space-size-on-garbage-collection-efficiency/),
[Node.js — understanding & tuning memory](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory).

### App — cheap wins
| Change | Impact | Effort/Risk |
|---|---|---|
| **[done]** Equirectangular `findIndex` in `map/utils.ts` (was haversine-per-point) | ~0.8 ms → 0.03 ms CPU per trip render; identical output | Low |
| Add `Cache-Control: public, s-maxage=…, stale-while-revalidate=…` on cacheable SSR responses so the CDN/ingress absorbs repeats | 60–90% fewer origin renders on hot URLs | Low–Med |
| Reuse a single Apollo client, or use plain `fetch` for server `no-cache` calls | ~10–30% less per-request client overhead | Medium |
| Fix the CORS middleware (`middleware.js`) | Removes dead work / latent bug | Low |
| CDN-cache OG images + load fonts once at module scope | Neutralises crawler-driven spikes | Low |

Sources: [Next.js — getServerSideProps caching](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props),
[Next.js — CDN caching](https://nextjs.org/docs/app/guides/cdn-caching),
[Apollo — SSR](https://www.apollographql.com/docs/react/performance/server-side-rendering).

### App — larger
| Change | Impact | Effort/Risk |
|---|---|---|
| ISR / `getStaticProps` + `revalidate` for pages that don't need per-user data | Removes per-request SSR entirely | Medium |
| Trim per-leg work (memoize/avoid the haversine closest-point scan; decode polylines lazily / client-side) | Cuts the #1–#3 hotspots | Medium |
| Streaming SSR (`renderToPipeableStream`) | Better TTFB; note: can *lower* peak RPS on CPU-bound pods | Medium |

Sources: [Next.js — ISR](https://nextjs.org/docs/13/pages/building-your-application/rendering/incremental-static-regeneration),
[React 18 streaming SSR](https://blog.logrocket.com/streaming-ssr-with-react-18/).
Note: **Partial Prerendering (PPR) is App-Router only** — not available for this pages-router app.

---

## 6. What this is *not*

The server-config-store change is healthy and not the cause of the spikes:
- Idle CPU ~1m; no listener errors in staging logs.
- It **reduced** per-request server CPU on the config path (no per-request Firestore
  `getDoc` + Zod parse) and cut Firestore read-ops (config now served from one
  in-process listener via `/api/config/*`).
- The one cost it added is ~3 cheap `/api/config/*` requests per page load (memory
  reads), trading Firestore read-ops for a little of our server CPU.

The CPU spike is the inherent cost of live Node SSR (section 3, esp. #6) meeting a
50m HPA trigger and a 250m throttle (section 2) — a pre-existing infra condition.

---

## 7. Suggested order of attack

1. **Infra sizing** (request/limit/HPA stabilization) — biggest, fastest win; stops
   the thrash and the throttling. Lives in `gcp-infra`.
2. **Node GC flags** — cheap, container-wide.
3. **App cheap wins** — logging gate, `Cache-Control`, CORS fix, OG caching.
4. **Profile** a trip render (`node --prof`/clinic) to confirm the render vs.
   transform split before investing in the larger app refactors (ISR, per-leg trims).
