// Simple latency benchmark for local/dev or production deployments
// Usage (PowerShell):
//   node scripts/measure-latency.mjs http://localhost:3000 100
// Optional: set TARGET to your deployed URL

const TARGET = process.argv[2] || 'http://localhost:3000';
const N = Number(process.argv[3] || 50); // default 50 to keep it fast

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

async function timeOnce(fn) {
  const t0 = performance.now();
  const res = await fn();
  const t1 = performance.now();
  return { ms: t1 - t0, res };
}

async function run() {
  const base = TARGET.replace(/\/$/, '');

  const getLatencies = [];
  for (let i = 0; i < N; i++) {
    const { ms } = await timeOnce(() => fetch(`${base}/api/chat`, { method: 'GET' }));
    getLatencies.push(ms);
  }

  const postPayload = {
    message: 'Hello, I would like to talk about stress at work.',
    intensity: 4,
  };
  const postLatencies = [];
  for (let i = 0; i < N; i++) {
    const { ms } = await timeOnce(() => fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload),
    }));
    postLatencies.push(ms);
  }

  const summarize = (label, data) => ({
    label,
    n: data.length,
    mean_ms: Number((data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)),
    p50_ms: Number(percentile(data, 50).toFixed(1)),
    p95_ms: Number(percentile(data, 95).toFixed(1)),
    min_ms: Number(Math.min(...data).toFixed(1)),
    max_ms: Number(Math.max(...data).toFixed(1)),
  });

  const summary = [
    summarize('GET /api/chat', getLatencies),
    summarize('POST /api/chat (fallback path, no GROQ_API_KEY)', postLatencies),
  ];

  console.log(JSON.stringify({ target: base, N, results: summary }, null, 2));
}

run().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
