const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, limit = 15, windowMs = 60_000) {
  const now = Date.now();
  const arr = hits.get(key) || [];
  const recent = arr.filter((v) => now - v < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length <= limit;
}
