interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private requests = new Map<string, RateLimitEntry>();

  private constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public isAllowed(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.requests.entries());
    for (const [key, entry] of entries) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  public getStats(): {
    totalEntries: number;
    entries: Array<{ key: string; count: number; resetTime: number }>;
  } {
    return {
      totalEntries: this.requests.size,
      entries: Array.from(this.requests.entries()).map(([key, entry]) => ({
        key,
        count: entry.count,
        resetTime: entry.resetTime,
      })),
    };
  }
}

export default RateLimiter.getInstance();
