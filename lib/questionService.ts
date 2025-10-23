import DatabaseConnection from "./database";
import { QuizQuestion } from "@/types";

export async function getQuestionsFromDatabase(
  count: number,
  difficulty: "beginner" | "intermediate" | "advanced",
  excludeQuestions: string[] = []
): Promise<QuizQuestion[]> {
  try {
    // First check if the difficulty column exists
    const checkColumn = await DatabaseConnection.query<{
      exists_check: number;
    }>(
      `SELECT COUNT(*) as exists_check 
       FROM information_schema.columns 
       WHERE table_schema = DATABASE()
       AND table_name = 'questions' 
       AND column_name = 'difficulty'`
    );

    const hasDifficultyColumn =
      Array.isArray(checkColumn) &&
      checkColumn[0] &&
      (checkColumn[0] as { exists_check: number }).exists_check > 0;

    // Step 1: Get random question IDs
    const query = hasDifficultyColumn
      ? `SELECT id FROM questions 
         WHERE difficulty = '${difficulty}' 
         ORDER BY RAND() 
         LIMIT ${count}`
      : `SELECT id FROM questions 
         ORDER BY RAND() 
         LIMIT ${count}`;

    const questionIds = await DatabaseConnection.query<{ id: string }>(query);

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw new Error("No questions found in the database");
    }

    // Step 2: Get full question details with incorrect answers
    const idList = questionIds.map((q) => `'${q.id}'`).join(",");
    const detailsQuery = `
      SELECT 
        q.id,
        q.question,
        q.correct_answer,
        ia.incorrect_answer
      FROM questions q
      LEFT JOIN incorrect_answers ia ON q.id = ia.question_id
      WHERE q.id IN (${idList})
      ORDER BY q.id, ia.incorrect_answer`;

    const questions = await DatabaseConnection.query<{
      id: string;
      question: string;
      correct_answer: string;
      incorrect_answer: string | null;
    }>(detailsQuery);

    // Step 3: Group questions and their incorrect answers
    const questionMap = new Map<string, QuizQuestion>();

    questions.forEach((row) => {
      if (!questionMap.has(row.id)) {
        questionMap.set(row.id, {
          question: row.question,
          correct_answer: row.correct_answer,
          incorrect_answers: [],
        });
      }

      if (row.incorrect_answer) {
        const question = questionMap.get(row.id)!;
        if (question.incorrect_answers.length < 3) {
          question.incorrect_answers.push(row.incorrect_answer);
        }
      }
    });

    return Array.from(questionMap.values());
  } catch (error) {
    throw new Error("Failed to fetch questions from database");
  }
}
