# Local perf harness — before/after CPU & memory

Purpose: measure the container's **CPU time per request** and **memory footprint**
under a k8s-like resource limit, so a change (e.g. the Firebase SDK migration in
[`../PERF.md`](../PERF.md) #1) can be compared before vs after with real numbers.

It does **not** use the production `Dockerfile` (that builds all 5 orgs and needs
mapbox secrets). Instead `build.sh` produces a single-org standalone bundle on
the host and wraps it in [`Dockerfile`](./Dockerfile), which mirrors the prod
`runner` stage — so runtime behavior is representative while staying fast to
iterate.

## Why `/assistant` is the target

The change we want to measure is the uncached, server-side **Firebase Web SDK**
read (`getTransportModeFilter`). `GET /assistant` with **no query params** hits
exactly that: `getServerSideProps` sees a missing transport-mode filter, calls
Firestore once, then 307-redirects. It does **not** call the BFF geocoder or
Entur, so it works locally with only the public `NEXT_PUBLIC_FIREBASE_*` staging
config — and it isolates the Firebase cost from everything else.

The load generator does not follow redirects, so 1 request == 1 Firebase read
(in the baseline). After the fix (admin SDK + TTL cache), the first request
populates the cache and the rest are ~free — that delta is the win.

> To measure a full trip search instead (Firebase + geocoder + Entur), set
> `TARGET_PATH` to a captured `/api/assistant/trip?...` URL and provide the BFF
> service-discovery env vars — see "Full trip path" below.

## Prerequisites

- Docker (uses cgroup v2 `cpu.stat` / `memory.peak` for exact measurement).
- Node (for the dependency-free load generator `load.mjs`).
- `.env.local` with the `NEXT_PUBLIC_FIREBASE_*` staging values (already present).

## Run it

```bash
# 1. Baseline: build + measure on current main
git switch main
perf/build.sh baseline
perf/measure.sh baseline

# 2. Candidate: build + measure on the firebase branch
git switch firebase-admin-cache
SKIP_SETUP=1 perf/build.sh candidate      # assets already generated -> faster
perf/measure.sh candidate

# 3. Compare
perf/compare.sh baseline candidate
```

Each `measure.sh` run writes `perf/results/<tag>.json` and prints a summary:

```
CPU time total        : 12.480s over 2000 reqs
CPU per request       : 6.24 ms
Idle memory           : 138.2 MiB
Peak memory           : 210.7 MiB
```

The headline metric is **CPU per request** and **peak/idle memory**. Because the
container is pinned to `--cpus` / `--memory`, these map directly to how the pod
behaves against the HPA's CPU target and its memory request (see PERF.md #0).

## Knobs (env vars for `measure.sh`)

| var           | default                          | meaning                          |
|---------------|----------------------------------|----------------------------------|
| `CPUS`        | `1`                              | container CPU limit              |
| `MEM`         | `512m`                           | container memory limit           |
| `VUS`         | `10`                             | concurrency                      |
| `ITER`        | `2000`                           | measured requests                |
| `WARMUP`      | `300`                            | warmup requests before measuring |
| `TARGET_PATH` | `/assistant`                     | endpoint under test              |
| `ENTUR_BASE_URL` | `https://api.staging.entur.io`| runtime env passed to container  |

## Full trip path (optional)

To exercise the whole `/api/assistant/trip` flow you need the BFF reachable. In
the production container `NODE_ENV=production`, so BFF/sales URLs come from k8s
service-discovery env vars. Pass them to `docker run` (edit `measure.sh` or run
manually), e.g. point `BFF_SERVICE_HOST` / `BFF_SERVICE_PORT` at a reachable
BFF, then set `TARGET_PATH` to a real captured trip URL (copy it from the
browser Network tab after doing a search).

## Notes / caveats

- First measured request in the *candidate* run may still pay the Firebase cost
  if warmup didn't populate the cache; `WARMUP` handles this. Keep `WARMUP > 0`.
- Numbers are comparative, not absolute SLOs — run baseline and candidate on the
  same machine, back-to-back, with nothing else hammering the CPU.
- For statistical stability, run each a few times; CPU-per-request should be
  stable to within a few percent.
