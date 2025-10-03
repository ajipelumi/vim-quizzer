import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/database";
import cache from "@/lib/cache";
import rateLimiter from "@/lib/rateLimiter";
import { addSecurityHeaders, validateRequest } from "@/lib/security";

interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: {
      status: string;
      message: string;
      stats?: Record<string, unknown>;
    };
    cache: {
      status: string;
      size: number;
      keys: string[];
    };
    rateLimiter: {
      status: string;
      stats: Record<string, unknown>;
    };
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse | { error: string }>
) {
  // Add security headers
  addSecurityHeaders(res);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate request
  const validation = validateRequest(req);
  if (!validation.valid) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // const startTime = Date.now(); // Unused variable

  try {
    // Check database health
    const dbHealth = await db.healthCheck();
    const dbStats = db.getPoolStats();

    // Check cache health
    const cacheSize = cache.size();
    const cacheKeys = cache.keys();
    const cacheStatus = cacheSize >= 0 ? "healthy" : "unhealthy";

    // Check rate limiter health
    const rateLimiterStats = rateLimiter.getStats();
    const rateLimiterStatus = "healthy";

    // Get memory usage
    const memUsage = process.memoryUsage();
    const memoryPercentage = Math.round(
      (memUsage.heapUsed / memUsage.heapTotal) * 100
    );

    // Get uptime
    const uptime = process.uptime();

    const response: HealthResponse = {
      status:
        dbHealth.status === "healthy" &&
        cacheStatus === "healthy" &&
        rateLimiterStatus === "healthy"
          ? "healthy"
          : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbHealth.status,
          message: dbHealth.message,
          stats: dbStats,
        },
        cache: {
          status: cacheStatus,
          size: cacheSize,
          keys: cacheKeys,
        },
        rateLimiter: {
          status: rateLimiterStatus,
          stats: rateLimiterStats,
        },
      },
      uptime,
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: memoryPercentage,
      },
    };

    const statusCode = response.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    const errorResponse: HealthResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        cache: {
          status: "error",
          size: 0,
          keys: [],
        },
        rateLimiter: {
          status: "error",
          stats: { totalEntries: 0, entries: [] },
        },
      },
      uptime: process.uptime(),
      memory: {
        used: 0,
        total: 0,
        percentage: 0,
      },
    };

    res.status(503).json(errorResponse);
  }
}
