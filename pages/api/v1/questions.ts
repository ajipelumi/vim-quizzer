import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/database";
import cache from "@/lib/cache";
import rateLimiter from "@/lib/rateLimiter";
import {
  addSecurityHeaders,
  validateRequest,
  SecurityManager,
} from "@/lib/security";
import { getRandomQuestions } from "@/lib/mockData";
import { QuizResponse, Question } from "@/types";

// Cache questions for 5 minutes
const QUESTIONS_CACHE_TTL = 5 * 60 * 1000;
const CACHE_KEY = "quiz_questions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuizResponse | { error: string }>
) {
  // Add security headers
  addSecurityHeaders(res);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate request
  const validation = validateRequest(req);
  if (!validation.valid) {
    SecurityManager.logSecurityEvent(
      "INVALID_REQUEST",
      {
        reason: validation.reason,
        method: req.method,
        url: req.url,
      },
      req
    );
    return res.status(400).json({ error: "Invalid request" });
  }

  // Rate limiting
  const clientId = SecurityManager.getClientIP(req);
  const rateLimit = rateLimiter.isAllowed(clientId, 60, 15 * 60 * 1000); // 60 requests per 15 minutes

  if (!rateLimit.allowed) {
    res.setHeader("X-RateLimit-Limit", "60");
    res.setHeader("X-RateLimit-Remaining", rateLimit.remaining.toString());
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(rateLimit.resetTime).toISOString()
    );
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
    } as { error: string; retryAfter: number });
  }

  // Set rate limit headers
  res.setHeader("X-RateLimit-Limit", "60");
  res.setHeader("X-RateLimit-Remaining", rateLimit.remaining.toString());
  res.setHeader(
    "X-RateLimit-Reset",
    new Date(rateLimit.resetTime).toISOString()
  );

  try {
    // Check cache first
    const cachedQuestions = cache.get<QuizResponse>(CACHE_KEY);
    if (cachedQuestions) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cachedQuestions);
    }

    // First, get a random set of 10 question IDs
    const questionIds = await db.query<{ id: string }>(`
      SELECT id FROM questions
      ORDER BY RAND()
      LIMIT 10
    `);

    if (questionIds.length === 0) {
      return res.status(404).json({ error: "No questions found" });
    }

    // Then get all questions with their incorrect answers in one go
    const questions = await db.query<Question & { incorrect_answer: string }>(
      `
      SELECT 
        q.id,
        q.question,
        q.correct_answer,
        q.created_at,
        q.updated_at,
        ia.incorrect_answer
      FROM questions q
      LEFT JOIN incorrect_answers ia ON q.id = ia.question_id
      WHERE q.id IN (${questionIds.map(() => '?').join(',')})
      ORDER BY q.id, ia.incorrect_answer
      `,
      questionIds.map(q => q.id)
    );

    // Group questions and their incorrect answers
    const questionMap = new Map<string, Question>();

    questions.forEach((row) => {
      if (!questionMap.has(row.id)) {
        questionMap.set(row.id, {
          id: row.id,
          question: row.question,
          correct_answer: row.correct_answer,
          incorrect_answers: [],
          created_at: row.created_at,
          updated_at: row.updated_at,
        });
      }

      if (row.incorrect_answer) {
        questionMap.get(row.id)!.incorrect_answers.push(row.incorrect_answer);
      }
    });

    // Convert to array
    const selectedQuestions = Array.from(questionMap.values());

    // Remove internal fields for API response
    const formattedQuestions = selectedQuestions.map((q) => ({
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
    }));

    const response: QuizResponse = {
      response_code: 200,
      results: formattedQuestions,
    };

    // Cache the response
    cache.set(CACHE_KEY, response, QUESTIONS_CACHE_TTL);
    res.setHeader("X-Cache", "MISS");

    res.status(200).json(response);
  } catch (error) {
    console.error("Database error:", error);

    // Fall back to mock data when database is not available
    console.log("Falling back to mock data for development");
    const mockQuestions = getRandomQuestions(10);

    const response: QuizResponse = {
      response_code: 200,
      results: mockQuestions,
    };

    res.setHeader("X-Cache", "FALLBACK");
    res.status(200).json(response);
  }
}
