import { useState, useCallback } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import WelcomeSection from "@/components/WelcomeSection";
import QuizSection from "@/components/QuizSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import AccessibilityManager from "@/components/AccessibilityManager";
import ErrorBoundary from "@/components/ErrorBoundary";
import logger from "@/lib/logger";
import { QuizState, QuizQuestion } from "@/types";

type Difficulty = "beginner" | "intermediate" | "advanced";

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(
    new Set()
  );

  const startQuiz = async (selectedDifficulty: Difficulty = difficulty) => {
    setIsLoading(true);
    setError(null);
    setDifficulty(selectedDifficulty);

    try {
      const response = await fetch(
        `/api/v1/questions?difficulty=${selectedDifficulty}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const { results: questions } = await response.json();

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }

      // Filter out previously answered questions
      const availableQuestions = questions.filter(
        (q: QuizQuestion) => !answeredQuestionIds.has(q.question)
      );

      // If we've answered most questions, reset the tracking
      const questionsToUse =
        availableQuestions.length >= 5 ? availableQuestions : questions;

      if (availableQuestions.length < 5) {
        setAnsweredQuestionIds(new Set());
      }

      // Shuffle the questions
      const shuffledQuestions = [...questionsToUse].sort(
        () => Math.random() - 0.5
      );

      setQuizState({
        currentQuestion: 0,
        totalQuestions: shuffledQuestions.length,
        score: 0,
        questions: shuffledQuestions,
        answers: [],
        isComplete: false,
      });

      logger.info("Quiz loaded successfully", {
        questionCount: questions.length,
        sessionId: logger.getSessionId(),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      logger.error("Failed to load quiz", {
        error: errorMessage,
        sessionId: logger.getSessionId(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!quizState) return;

      const currentQuestion = quizState.questions[quizState.currentQuestion];
      if (!currentQuestion) return;

      const isCorrect = answer === currentQuestion.correct_answer;

      const newAnswers = [...quizState.answers, answer];
      const newScore = isCorrect ? quizState.score + 1 : quizState.score;

      const isComplete =
        quizState.currentQuestion === quizState.totalQuestions - 1;

      // Log answer
      logger.info("Question answered", {
        questionNumber: quizState.currentQuestion + 1,
        isCorrect,
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correct_answer,
        sessionId: logger.getSessionId(),
      });

      // Track this question as answered
      setAnsweredQuestionIds((prev) => {
        const updated = new Set(prev);
        updated.add(currentQuestion.question);
        return updated;
      });

      setQuizState({
        ...quizState,
        currentQuestion: isComplete
          ? quizState.currentQuestion
          : quizState.currentQuestion + 1,
        score: newScore,
        answers: newAnswers,
        isComplete,
      });
    },
    [quizState]
  );

  const resetQuiz = useCallback(() => {
    logger.info("Quiz reset", { sessionId: logger.getSessionId() });
    setQuizState(null);
    setError(null);
  }, []);

  return (
    <>
      <Head>
        <title>Vim Quizzer - Test Your Vim Knowledge</title>
        <meta
          name="description"
          content="Test your knowledge of Vim commands with our interactive quiz! Perfect for developers and Vim enthusiasts."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="vim, quiz, commands, editor, developer, programming"
        />
        <meta
          property="og:title"
          content="Vim Quizzer - Test Your Vim Knowledge"
        />
        <meta
          property="og:description"
          content="Interactive Vim quiz to test your command knowledge"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ErrorBoundary>
        <AccessibilityManager>
          <Layout
            onRestart={resetQuiz}
            showRestartButton={!!quizState && !quizState.isComplete}
          >
            {isLoading && !quizState ? (
              <div className="container">
                <div className="row">
                  <div className="col-md-12 mt-12 text-center py-5">
                    <LoadingSpinner
                      size="lg"
                      text="Loading quiz questions..."
                    />
                  </div>
                </div>
              </div>
            ) : !quizState ? (
              <WelcomeSection
                onStartQuiz={startQuiz}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <QuizSection
                quizState={quizState}
                onAnswer={handleAnswer}
                onReset={resetQuiz}
              />
            )}
          </Layout>
        </AccessibilityManager>
      </ErrorBoundary>
    </>
  );
}
