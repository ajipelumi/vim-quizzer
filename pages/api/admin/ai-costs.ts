import type { NextApiRequest, NextApiResponse } from "next";
import rateLimiter from "@/lib/rateLimiter";

// Admin-only cost reporting for OpenAI calls
// Security: env gate + admin token + strict rate limit

type CostEntry = {
  timestamp: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  total_cost_usd: number;
};

type ModelStats = {
  calls: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  total_cost_usd: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        entries: CostEntry[];
        totals: {
          calls: number;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          input_cost_usd: number;
          output_cost_usd: number;
          total_cost_usd: number;
        };
        by_model: Record<
          string,
          {
            calls: number;
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
            input_cost_usd: number;
            output_cost_usd: number;
            total_cost_usd: number;
          }
        >;
      }
    | { error: string }
  >
) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Env gate: disabled by default in production
  const allow = process.env.ALLOW_AI_COSTS_ENDPOINT === "true";
  if (process.env.NODE_ENV === "production" && !allow) {
    return res.status(404).json({ error: "Not found" });
  }

  // Admin token validation
  const token = req.headers["x-admin-token"];
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected || token !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Strict rate limit: 10 requests per minute per client
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientId =
    (Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : typeof forwardedFor === "string"
      ? forwardedFor
      : req.socket.remoteAddress) || "unknown-admin";

  const limiter = rateLimiter.isAllowed(clientId, 10, 60 * 1000);
  if (!limiter.allowed) {
    res.setHeader("Retry-After", 60);
    return res.status(429).json({ error: "Too many requests" });
  }

  // Prefer DB-backed entries with cache fallback
  const { readCostEntries } = await import("@/lib/monitoring/costsStore");
  const entries = await readCostEntries(500);

  const totals = entries.reduce(
    (acc, e) => {
      acc.calls += 1;
      acc.prompt_tokens += e.prompt_tokens;
      acc.completion_tokens += e.completion_tokens;
      acc.total_tokens += e.total_tokens;
      acc.input_cost_usd += e.input_cost_usd;
      acc.output_cost_usd += e.output_cost_usd;
      acc.total_cost_usd += e.total_cost_usd;
      return acc;
    },
    {
      calls: 0,
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
      input_cost_usd: 0,
      output_cost_usd: 0,
      total_cost_usd: 0,
    }
  );

  const by_model = entries.reduce(
    (acc, e) => {
      const m = e.model || "unknown";
      acc[m] ??= {
        calls: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        input_cost_usd: 0,
        output_cost_usd: 0,
        total_cost_usd: 0,
      } as ModelStats;
      acc[m].calls += 1;
      acc[m].prompt_tokens += e.prompt_tokens;
      acc[m].completion_tokens += e.completion_tokens;
      acc[m].total_tokens += e.total_tokens;
      acc[m].input_cost_usd += e.input_cost_usd;
      acc[m].output_cost_usd += e.output_cost_usd;
      acc[m].total_cost_usd += e.total_cost_usd;
      return acc;
    },
    {} as Record<
      string,
      {
        calls: number;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        input_cost_usd: number;
        output_cost_usd: number;
        total_cost_usd: number;
      }
    >
  );

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  return res.status(200).json({ entries, totals, by_model });
}
