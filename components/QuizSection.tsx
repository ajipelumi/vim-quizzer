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

      const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];

      // Ensure we have exactly 4 answers for consistent display
      let finalAnswers = [...allAnswers];

      // If we have more than 4, take the first 4 (including correct answer)
      if (finalAnswers.length > 4) {
        // Ensure correct answer is included
        const correctAnswer = currentQuestion.correct_answer;
        const incorrectAnswers = currentQuestion.incorrect_answers.filter(
          (a) => a !== correctAnswer
        );

        // Take 3 incorrect + 1 correct = 4 total
        finalAnswers = [...incorrectAnswers.slice(0, 3), correctAnswer];
      }

      // If we have less than 4, pad with generic options
      while (finalAnswers.length < 4) {
        const genericOptions = [":q", ":w", ":x", ":!", ":help", ":version"];
        const unusedOptions = genericOptions.filter(
          (opt) => !finalAnswers.includes(opt)
        );
        if (unusedOptions.length > 0 && unusedOptions[0]) {
          finalAnswers.push(unusedOptions[0]);
        } else {
          break; // Prevent infinite loop
        }
      }

      // Shuffle answers while ensuring we have exactly 4
      const shuffled = finalAnswers
        .slice(0, 4)
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
