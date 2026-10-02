#!/usr/bin/env bash
#
# Compare two perf runs and print the deltas.
#
# Usage:
#   perf/compare.sh <baseline-tag> <candidate-tag>
set -euo pipefail
cd "$(dirname "$0")/.."

A="perf/results/${1:?usage: perf/compare.sh <baseline> <candidate>}.json"
B="perf/results/${2:?usage: perf/compare.sh <baseline> <candidate>}.json"

node - "$A" "$B" <<'EOF'
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f)));
const rows = [
  ['CPU ms / request', a.cpu_ms_per_request, b.cpu_ms_per_request, 'lower'],
  ['CPU seconds total', a.cpu_seconds_total, b.cpu_seconds_total, 'lower'],
  ['Idle memory (MiB)', a.idle_memory_mib, b.idle_memory_mib, 'lower'],
  ['Peak memory (MiB)', a.peak_memory_mib, b.peak_memory_mib, 'lower'],
  ['Throughput (rps)', a.load.rps, b.load.rps, 'higher'],
  ['Latency p95 (ms)', a.load.latency_ms.p95, b.load.latency_ms.p95, 'lower'],
];
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad('metric', 20)} ${pad(a.tag, 12)} ${pad(b.tag, 12)} ${pad('delta', 12)} better?`);
console.log('-'.repeat(72));
for (const [name, av, bv, dir] of rows) {
  const delta = bv - av;
  const pct = av ? ((delta / av) * 100).toFixed(1) + '%' : 'n/a';
  const improved = dir === 'lower' ? bv < av : bv > av;
  const flag = delta === 0 ? '=' : improved ? '✓ better' : '✗ worse';
  const sign = delta > 0 ? '+' : '';
  console.log(`${pad(name, 20)} ${pad(av, 12)} ${pad(bv, 12)} ${pad(sign + delta.toFixed(2) + ' (' + sign + pct + ')', 12)} ${flag}`);
}
console.log('');
EOF
