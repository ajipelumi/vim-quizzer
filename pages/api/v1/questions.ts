import { NextApiRequest, NextApiResponse } from "next";
import rateLimiter from "@/lib/rateLimiter";
import { generateVimQuestions } from "@/lib/ai";
import { QuizQuestion } from "@/types";

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 60,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: QuizQuestion[] } | { error: string }>
) {
  // Set security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const forwardedFor = req.headers["x-forwarded-for"];
  const clientId =
    (Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : typeof forwardedFor === "string"
      ? forwardedFor
      : req.socket.remoteAddress) || "unknown-client";

  const rateLimit = rateLimiter.isAllowed(
    clientId,
    RATE_LIMIT.MAX_REQUESTS,
    RATE_LIMIT.WINDOW_MS
  );

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", Math.ceil(RATE_LIMIT.WINDOW_MS / 1000));
    return res.status(429).json({ error: "Too many requests" });
  }

  try {
    const difficulty =
      (req.query.difficulty as "beginner" | "intermediate" | "advanced") ||
      "intermediate";

    // Handle exclude query parameter
    const excludeQuestions = (() => {
      if (!req.query.exclude) return [];
      if (Array.isArray(req.query.exclude)) {
        return req.query.exclude as string[];
      }
      return [req.query.exclude as string];
    })();

    // Generate questions using AI
    const questions = await generateVimQuestions({
      count: 10,
      difficulty,
      excludeQuestions,
    });

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT.MAX_REQUESTS.toString());
    res.setHeader("X-RateLimit-Remaining", rateLimit.remaining.toString());
    res.setHeader(
      "X-RateLimit-Reset",
      Math.floor((Date.now() + RATE_LIMIT.WINDOW_MS) / 1000).toString()
    );

    return res.status(200).json({ results: questions });
  } catch (error) {
    console.error("Error in questions API:", error);
    return res.status(500).json({
      error: "Failed to generate questions. Please try again later.",
    });
  }
}
