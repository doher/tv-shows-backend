import { CACHE_TTL_MS } from "./tvmaze.constants.js";

const CLEANUP_IMMEDIATELY = 0;

type CacheEntry<T> = { value: T; expiresAt: number };

export const createResponseCache = <T>() => {
  const cache: Partial<Record<string, CacheEntry<T>>> = {};
  const pending = new Map<string, Promise<T>>();
  let nextCleanup = CLEANUP_IMMEDIATELY;

  const cleanupExpired = (now: number) => {
    if (now < nextCleanup) {
      return;
    }

    for (const [url, entry] of Object.entries(cache)) {
      if (entry && entry.expiresAt <= now) {
        delete cache[url];
      }
    }

    nextCleanup = now + CACHE_TTL_MS;
  };

  return (url: string, load: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const cached = cache[url];
    if (cached && now < cached.expiresAt) {
      return Promise.resolve(cached.value);
    }

    const sharedRequest = pending.get(url);
    if (sharedRequest) {
      return sharedRequest;
    }

    cleanupExpired(now);
    const request = Promise.resolve()
      .then(load)
      .then((value) => {
        cache[url] = { value, expiresAt: Date.now() + CACHE_TTL_MS };
        return value;
      })
      .finally(() => pending.delete(url));

    pending.set(url, request);
    return request;
  };
};
