type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function peekRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt <= now) {
    if (entry) {
      rateLimitStore.delete(key);
    }
    return {
      ok: true,
      remaining: options.limit,
      resetAt: now + options.windowMs,
    };
  }

  if (entry.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    ok: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export function rateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    const nextEntry = { count: 1, resetAt: now + options.windowMs };
    rateLimitStore.set(key, nextEntry);
    return {
      ok: true,
      remaining: options.limit - 1,
      resetAt: nextEntry.resetAt,
    };
  }

  if (entry.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return {
    ok: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}
