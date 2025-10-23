import OpenAI from "openai";
import cache from "./cache";
import { QuizQuestion } from "@/types";
import { calculateOpenAICost } from "./costs";
import { appendCostEntry } from "./monitoring/costsStore";
import { getQuestionsFromDatabase } from "./questionService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateQuestionsOptions {
  count: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  excludeQuestions?: string[];
}

/**
 * Generates Vim quiz questions using AI with a fallback to the database if AI generation fails.
 * Implements caching to improve performance for repeated requests.
 */
export async function generateVimQuestions({
  count = 10,
  difficulty = "intermediate",
  excludeQuestions = [],
}: GenerateQuestionsOptions): Promise<QuizQuestion[]> {
  const cacheKey = `questions:${difficulty}:${count}`;

  // Try to get questions from cache first
  try {
    const cached = await cache.get<QuizQuestion[]>(cacheKey);
    if (cached) {
      const filteredCached = cached.filter(
        (q) => !excludeQuestions.includes(q.question)
      );
      if (filteredCached.length >= count) {
        return filteredCached.slice(0, count);
      }
    }
  } catch {
    // Continue with AI generation if cache fails
  }

  // Try AI generation with database fallback
  return generateWithAIFallback(count, difficulty, excludeQuestions, cacheKey);
}

/**
 * Generates questions using AI with a fallback to the database if AI generation fails
 */
async function generateWithAIFallback(
  count: number,
  difficulty: "beginner" | "intermediate" | "advanced",
  excludeQuestions: string[],
  cacheKey: string
): Promise<QuizQuestion[]> {
  try {
    console.log("[AI] Attempting to generate questions with AI:", {
      count,
      difficulty,
    });
    const aiQuestions = await generateWithAI(
      count,
      difficulty,
      excludeQuestions
    );

    console.log("[AI] Successfully generated questions with AI");
    // Cache the AI-generated questions
    await cache.set(cacheKey, aiQuestions, 3600); // Cache for 1 hour

    return aiQuestions;
  } catch (error) {
    console.log("[AI] Failed to generate questions with AI:", error);
    console.log("[AI] Falling back to database");
    try {
      return await getQuestionsFromDatabase(
        count,
        difficulty,
        excludeQuestions
      );
    } catch (dbError) {
      console.error("[AI] Database fallback also failed:", dbError);
      throw new Error(
        "Failed to generate questions and database fallback failed"
      );
    }
  }
}

/**
 * Generates questions using OpenAI's API
 */
async function generateWithAI(
  count: number,
  difficulty: "beginner" | "intermediate" | "advanced",
  excludeQuestions: string[]
): Promise<QuizQuestion[]> {
  const prompt = `Generate ${count} unique Vim quiz questions for ${difficulty} users.
  Each question should have:
  - A clear, specific question about Vim usage or concepts
  - 1 correct answer (must be a valid Vim command or concept)
  - 3 incorrect but plausible answers
  - Difficulty level: ${difficulty}
  - Format as a valid JSON array of objects with these exact properties:
    - question: string
    - correct_answer: string
    - incorrect_answers: string[] (exactly 3 items)
  
  Example:
  [{
    "question": "How do you delete the current line in Vim?",
    "correct_answer": "dd",
    "incorrect_answers": ["dl", "D", "d$"]
  }]
  
  Important:
  - Only include valid Vim commands and concepts
  - Make sure answers are technically accurate
  - Questions should be varied and cover different aspects of Vim
  - Exclude these questions: ${excludeQuestions.slice(0, 5).join("; ")}...`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a Vim expert creating quiz questions. Be precise and technically accurate.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Track API usage and costs
  const promptTokens = response.usage?.prompt_tokens ?? 0;
  const completionTokens = response.usage?.completion_tokens ?? 0;
  const totalTokens =
    response.usage?.total_tokens ?? promptTokens + completionTokens;

  const { inputCost, outputCost, totalCost } = calculateOpenAICost(
    "gpt-3.5-turbo",
    promptTokens,
    completionTokens
  );

  // Log the API usage
  await appendCostEntry({
    timestamp: new Date().toISOString(),
    endpoint: "chat.completions",
    model: "gpt-3.5-turbo",
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: totalTokens,
    input_cost_usd: inputCost,
    output_cost_usd: outputCost,
    total_cost_usd: totalCost,
  });

  // Process the AI response
  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content in AI response");
  }

  // Extract JSON from markdown code block if present
  const codeBlockMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
  const jsonContent = codeBlockMatch?.[1] ?? content;

  try {
    // Parse and validate the response
    const questions = JSON.parse(jsonContent) as QuizQuestion[];

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Empty or invalid questions array from AI");
    }

    // Validate each question
    const validQuestions = questions.filter(
      (q) =>
        q.question &&
        q.correct_answer &&
        Array.isArray(q.incorrect_answers) &&
        q.incorrect_answers.length === 3
    );

    if (validQuestions.length === 0) {
      throw new Error("No valid questions in AI response");
    }

    // Filter out excluded questions
    return validQuestions.filter((q) => !excludeQuestions.includes(q.question));
  } catch {
    throw new Error("Invalid response format from AI");
  }
}
