type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const inFlight = new Map<string, Promise<unknown>>();
const cache = new Map<string, CacheEntry<unknown>>();

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}

export function invalidateDedupe(prefix?: string) {
  for (const key of Array.from(cache.keys())) {
    if (!prefix || key.startsWith(prefix)) cache.delete(key);
  }
  for (const key of Array.from(inFlight.keys())) {
    if (!prefix || key.startsWith(prefix)) inFlight.delete(key);
  }
}

export async function dedupeRequest<T>(
  key: string,
  factory: () => Promise<T>,
  options: { ttlMs?: number } = {}
): Promise<T> {
  const ttlMs = options.ttlMs ?? 10000;
  const now = Date.now();
  const cached = cache.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) return cached.value;

  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = factory()
    .then((value) => {
      if (ttlMs > 0) cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

export async function dedupedJsonFetch<T>(
  key: string,
  url: string,
  init: RequestInit = {},
  options: { ttlMs?: number } = {}
): Promise<T> {
  return dedupeRequest<T>(key, async () => {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error = new Error((data as any)?.error || `Request failed (${res.status})`);
      (error as any).status = res.status;
      (error as any).data = data;
      throw error;
    }
    return data as T;
  }, options);
}