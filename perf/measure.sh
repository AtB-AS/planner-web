#!/usr/bin/env bash
#
# Run a perf image under a k8s-like cgroup limit, drive load at it, and measure
# CPU time + peak memory of the container. Writes perf/results/<tag>.json.
#
# Usage:
#   perf/measure.sh <tag>
#
# Reads exact CPU time from the container's cgroup v2 `cpu.stat` (usage_usec)
# before/after the measured load window, so the reported CPU cost is real CPU
# seconds consumed for a known number of requests — not an instantaneous sample.
#
# Env knobs (defaults tuned to mimic the prod pod):
#   CPUS=1            docker --cpus
#   MEM=512m          docker --memory
#   VUS=10            concurrency
#   ITER=2000         measured requests
#   WARMUP=300        warmup requests (populates caches / JIT before measuring)
#   TARGET_PATH=/assistant   the endpoint to hammer (isolates the Firebase read)
#   ENTUR_BASE_URL=https://api.staging.entur.io   runtime env for the container
#   HOST_PORT=18080  published port on the host
set -euo pipefail

cd "$(dirname "$0")/.."

TAG="${1:?usage: perf/measure.sh <tag>}"
IMAGE="planner-web-perf:$TAG"

CPUS="${CPUS:-1}"
MEM="${MEM:-512m}"
VUS="${VUS:-10}"
ITER="${ITER:-2000}"
WARMUP="${WARMUP:-300}"
TARGET_PATH="${TARGET_PATH:-/assistant}"
ENTUR_BASE_URL="${ENTUR_BASE_URL:-https://api.staging.entur.io}"
HOST_PORT="${HOST_PORT:-18080}"

# firebase-admin (used by the config-store build) authenticates with Application
# Default Credentials. In-cluster that's Workload Identity; locally we mount your
# `gcloud auth application-default login` file into the container. Harmless for
# the Web-SDK build, which ignores it.
ADC_FILE="${GOOGLE_ADC:-$HOME/.config/gcloud/application_default_credentials.json}"
FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID:-atb-mobility-platform-staging}"
CRED_ARGS=()
if [[ -f "$ADC_FILE" ]]; then
  echo ">> Mounting ADC from $ADC_FILE (project $FIREBASE_PROJECT_ID)"
  CRED_ARGS=(-v "$ADC_FILE:/adc.json:ro"
    -e GOOGLE_APPLICATION_CREDENTIALS=/adc.json
    -e FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID")
else
  echo ">> No ADC at $ADC_FILE — ok for the Web-SDK build; the admin build will fail to warm"
fi

NAME="planner-perf-$TAG"
HOST="http://localhost:$HOST_PORT"
mkdir -p perf/results

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

echo ">> Starting $IMAGE  (cpus=$CPUS mem=$MEM port=$HOST_PORT)"
docker run -d --name "$NAME" \
  --cpus="$CPUS" --memory="$MEM" \
  -e ENTUR_BASE_URL="$ENTUR_BASE_URL" \
  ${CRED_ARGS[@]+"${CRED_ARGS[@]}"} \
  -p "$HOST_PORT:8080" \
  "$IMAGE" >/dev/null

# Read a single field from the container's cgroup v2 files.
cg() { docker exec "$NAME" cat "/sys/fs/cgroup/$1" 2>/dev/null; }
cpu_usec() { cg cpu.stat | awk '/^usage_usec/ {print $2}'; }
mem_bytes() { cg memory.current | tr -d '[:space:]'; }
mem_peak() { cg memory.peak 2>/dev/null | tr -d '[:space:]'; }

# Readiness = the server accepts HTTP on the port and returns *any* status code
# (even 404 proves Node is up and serving). We deliberately don't require a
# health endpoint, so the harness works whether or not one exists in the tree.
echo ">> Waiting for readiness ..."
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$HOST$TARGET_PATH" || true)
  if [[ -n "$code" && "$code" != "000" ]]; then echo "   up (HTTP $code on $TARGET_PATH)"; break; fi
  sleep 1
  if [[ "$i" == "60" ]]; then echo "!! never became ready"; docker logs "$NAME"; exit 1; fi
done

# Give it a moment to settle, then record idle memory (baseline RSS).
sleep 3
IDLE_MEM=$(mem_bytes)

echo ">> Warmup ($WARMUP requests) ..."
VUS="$VUS" ITER="$WARMUP" HOST="$HOST" TARGET_PATH="$TARGET_PATH" \
  node perf/load.mjs >/dev/null

echo ">> Measured run ($ITER requests, $VUS VUs) ..."
CPU_BEFORE=$(cpu_usec)
LOAD_JSON=$(VUS="$VUS" ITER="$ITER" HOST="$HOST" TARGET_PATH="$TARGET_PATH" node perf/load.mjs)
CPU_AFTER=$(cpu_usec)
PEAK_MEM=$(mem_peak); [[ -z "$PEAK_MEM" ]] && PEAK_MEM=$(mem_bytes)

CPU_SECONDS=$(awk -v a="$CPU_AFTER" -v b="$CPU_BEFORE" 'BEGIN{printf "%.3f",(a-b)/1e6}')
REQS=$(printf '%s' "$LOAD_JSON" | awk -F'[:,]' '/"requests"/{gsub(/ /,"");print $2; exit}')
CPU_MS_PER_REQ=$(awk -v s="$CPU_SECONDS" -v r="$REQS" 'BEGIN{ if(r>0) printf "%.2f", s*1000/r; else print 0 }')

OUT="perf/results/$TAG.json"
cat > "$OUT" <<EOF
{
  "tag": "$TAG",
  "image": "$IMAGE",
  "limits": { "cpus": "$CPUS", "memory": "$MEM" },
  "target_path": "$TARGET_PATH",
  "cpu_seconds_total": $CPU_SECONDS,
  "cpu_ms_per_request": $CPU_MS_PER_REQ,
  "idle_memory_mib": $(awk -v b="$IDLE_MEM" 'BEGIN{printf "%.1f", b/1048576}'),
  "peak_memory_mib": $(awk -v b="$PEAK_MEM" 'BEGIN{printf "%.1f", b/1048576}'),
  "load": $LOAD_JSON
}
EOF

echo
echo "================= RESULT ($TAG) ================="
echo "CPU time total        : ${CPU_SECONDS}s over ${REQS} reqs"
echo "CPU per request       : ${CPU_MS_PER_REQ} ms"
echo "Idle memory           : $(awk -v b="$IDLE_MEM" 'BEGIN{printf "%.1f", b/1048576}') MiB"
echo "Peak memory           : $(awk -v b="$PEAK_MEM" 'BEGIN{printf "%.1f", b/1048576}') MiB"
echo "$LOAD_JSON" | grep -E '"rps"|"p95"|"errors"|"status"' || true
echo "Full results          : $OUT"
echo "================================================"
