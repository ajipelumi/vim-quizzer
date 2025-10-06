import { useState, useEffect } from "react";
import { QuizState, AnswerChoice } from "@/types";
import QuestionDisplay from "./QuestionDisplay";
import ResultsDisplay from "./ResultsDisplay";
import ProgressIndicator from "./ProgressIndicator";

interface QuizSectionProps {
  quizState: QuizState;
  onAnswer: (answer: string) => void;
  onReset: () => void;
}

export default function QuizSection({
  quizState,
  onAnswer,
  onReset,
}: QuizSectionProps) {
  const [shuffledAnswers, setShuffledAnswers] = useState<AnswerChoice[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!quizState.isComplete) {
      const currentQuestion = quizState.questions[quizState.currentQuestion];
      if (!currentQuestion) return;

      // Create an array with all possible answers (incorrect + correct)
      const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];

      // Remove duplicates (in case of any data issues)
      const uniqueAnswers = Array.from(new Set(allAnswers));

      // Create answer choices with their correctness status
      const shuffled = uniqueAnswers
        .map((answer) => ({
          value: answer,
          isCorrect: answer === currentQuestion.correct_answer,
          isSelected: false,
        }))
        .sort(() => Math.random() - 0.5);

      setShuffledAnswers(shuffled);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [quizState.currentQuestion, quizState.questions, quizState.isComplete]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    // Update answer choices with visual feedback
    setShuffledAnswers((prev) =>
      prev.map((choice) => ({
        ...choice,
        isSelected: choice.value === answer,
      }))
    );
  };

  const handleNext = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  const handleReset = () => {
    onReset();
  };

  if (quizState.isComplete) {
    return <ResultsDisplay quizState={quizState} onReset={handleReset} />;
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];
  // const progress =
  //   ((quizState.currentQuestion + 1) / quizState.totalQuestions) * 100;

  // Safety check - if no current question, return early
  if (!currentQuestion) {
    return <div>Error: No question available</div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        {/* Enhanced Progress Indicator */}
        <div className="progress-section">
          <ProgressIndicator
            current={quizState.currentQuestion + 1}
            total={quizState.totalQuestions}
            showPercentage={true}
            showScore={true}
            score={quizState.score}
          />
        </div>

        {/* Question Display */}
        <QuestionDisplay
          question={currentQuestion}
          shuffledAnswers={shuffledAnswers}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          isLastQuestion={
            quizState.currentQuestion === quizState.totalQuestions - 1
          }
        />
      </div>
    </div>
  );
}
