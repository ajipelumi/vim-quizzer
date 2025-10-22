import OpenAI from "openai";
import cache from "./cache";
import { QuizQuestion } from "@/types";
import { calculateOpenAICost } from "./costs";
import { appendCostEntry } from "./monitoring/costsStore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateQuestionsOptions {
  count: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  excludeQuestions?: string[];
}

export async function generateVimQuestions({
  count = 10,
  difficulty = "intermediate",
  excludeQuestions = [],
}: GenerateQuestionsOptions): Promise<QuizQuestion[]> {
  const cacheKey = `questions:${difficulty}:${count}`;
  const cached = await cache.get<QuizQuestion[]>(cacheKey);

  if (cached) {
    return cached.filter((q) => !excludeQuestions.includes(q.question));
  }

  try {
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

    // Cost/usage tracking
    const promptTokens = response.usage?.prompt_tokens ?? 0;
    const completionTokens = response.usage?.completion_tokens ?? 0;
    const totalTokens =
      response.usage?.total_tokens ?? promptTokens + completionTokens;

    const { inputCost, outputCost, totalCost } = calculateOpenAICost(
      "gpt-3.5-turbo",
      promptTokens,
      completionTokens
    );

    const costEntry = {
      timestamp: new Date().toISOString(),
      endpoint: "chat.completions",
      model: "gpt-3.5-turbo",
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      input_cost_usd: inputCost,
      output_cost_usd: outputCost,
      total_cost_usd: totalCost,
    };

    // Persist entry to DB (with cache fallback inside)
    await appendCostEntry(costEntry);

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    // Extract JSON from markdown code block if present
    const codeBlockMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
    const jsonContent = codeBlockMatch?.[1] ?? content;

    let questions: QuizQuestion[];
    try {
      // Trim any whitespace and parse the JSON
      questions = JSON.parse(jsonContent.trim());
      if (!Array.isArray(questions)) {
        throw new Error("Expected an array of questions");
      }
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to generate questions. Please try again.");
    }

    // Cache the generated questions for 1 hour
    await cache.set(cacheKey, questions, 3600);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please try again later.");
  }
}
