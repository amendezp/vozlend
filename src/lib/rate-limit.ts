// ============================================
// Echo Bank — Rate Limiting
// Uses Prisma-backed store for persistence across restarts
// ============================================

import { prisma } from "@/lib/db";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

const DEFAULTS: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

export async function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { maxRequests, windowMs } = { ...DEFAULTS, ...config };
  const now = new Date();

  // No DB — allow all requests
  if (!prisma) {
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }

  // Find or create rate limit entry
  let rateLimit = await prisma.rateLimit.findUnique({
    where: { key },
  });

  if (!rateLimit) {
    // First request — create entry
    rateLimit = await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        windowStart: now,
      },
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }

  const windowExpiry = new Date(rateLimit.windowStart.getTime() + windowMs);

  if (now > windowExpiry) {
    // Window expired — reset counter
    rateLimit = await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        windowStart: now,
      },
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }

  // Within window — check if under limit
  if (rateLimit.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: windowExpiry,
    };
  }

  // Increment counter
  rateLimit = await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: maxRequests - rateLimit.count,
    resetAt: windowExpiry,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
