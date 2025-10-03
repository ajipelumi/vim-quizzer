export interface Question {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  created_at: string;
  updated_at: string;
}

export interface IncorrectAnswer {
  id: string;
  question_id: string;
  incorrect_answer: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizResponse {
  response_code: number;
  results: QuizQuestion[];
}

export interface QuizState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  questions: QuizQuestion[];
  answers: string[];
  isComplete: boolean;
}

export interface AnswerChoice {
  value: string;
  isCorrect: boolean;
  isSelected: boolean;
}
