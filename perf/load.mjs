// Tiny dependency-free HTTP load generator (Node, no k6 required).
//
// Fires a fixed number of requests across N concurrent workers and reports
// throughput + latency percentiles as JSON on stdout. Redirects are NOT
// followed on purpose: for the `/assistant` target each request then maps to
// exactly one server render that performs one (uncached) Firebase read, which
// is what we want to isolate.
//
// Env:
//   HOST         default http://localhost:18080
//   TARGET_PATH  default /assistant
//   VUS          concurrency (default 10)
//   ITER         total requests (default 2000)
import http from 'node:http';
import https from 'node:https';

const HOST = process.env.HOST || 'http://localhost:18080';
const TARGET_PATH = process.env.TARGET_PATH || '/assistant';
const VUS = Number(process.env.VUS || 10);
const ITER = Number(process.env.ITER || 2000);

const url = new URL(HOST + TARGET_PATH);
const client = url.protocol === 'https:' ? https : http;
const agent = new client.Agent({ keepAlive: true, maxSockets: VUS });

let issued = 0;
const latencies = [];
const status = {};
let errors = 0;

function once() {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const req = client.request(
      url,
      { method: 'GET', agent, headers: { 'accept-encoding': 'gzip' } },
      (res) => {
        status[res.statusCode] = (status[res.statusCode] || 0) + 1;
        res.on('data', () => {});
        res.on('end', () => {
          const ms = Number(process.hrtime.bigint() - start) / 1e6;
          latencies.push(ms);
          resolve();
        });
      },
    );
    req.on('error', () => {
      errors++;
      resolve();
    });
    req.end();
  });
}

async function worker() {
  while (issued < ITER) {
    issued++;
    await once();
  }
}

function pct(sorted, p) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[i];
}

const wallStart = Date.now();
await Promise.all(Array.from({ length: VUS }, worker));
const wallMs = Date.now() - wallStart;

latencies.sort((a, b) => a - b);
const sum = latencies.reduce((a, b) => a + b, 0);
const summary = {
  target: HOST + TARGET_PATH,
  vus: VUS,
  requests: latencies.length,
  errors,
  status,
  wall_seconds: +(wallMs / 1000).toFixed(2),
  rps: +((latencies.length / wallMs) * 1000).toFixed(1),
  latency_ms: {
    avg: +(sum / (latencies.length || 1)).toFixed(1),
    p50: +pct(latencies, 50).toFixed(1),
    p90: +pct(latencies, 90).toFixed(1),
    p95: +pct(latencies, 95).toFixed(1),
    p99: +pct(latencies, 99).toFixed(1),
    max: +(latencies[latencies.length - 1] || 0).toFixed(1),
  },
};
console.log(JSON.stringify(summary, null, 2));
