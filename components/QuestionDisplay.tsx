import { QuizQuestion, AnswerChoice } from "@/types";
import { useFocusManagement } from "./AccessibilityManager";

interface QuestionDisplayProps {
  question: QuizQuestion;
  shuffledAnswers: AnswerChoice[];
  selectedAnswer: string | null;
  showResult: boolean;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  isLastQuestion?: boolean;
}

export default function QuestionDisplay({
  question,
  shuffledAnswers,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  onNext,
  isLastQuestion = false,
}: QuestionDisplayProps) {
  const { announceCorrectness } = useFocusManagement();

  const getAnswerClass = (answer: AnswerChoice) => {
    if (!showResult) {
      return answer.isSelected
        ? "btn-outline-primary"
        : "btn-outline-secondary";
    }

    if (answer.value === selectedAnswer) {
      return answer.isCorrect ? "btn-success" : "btn-danger";
    }

    if (answer.isCorrect) {
      return "btn-success";
    }

    return "btn-outline-secondary";
  };

  const handleAnswerClick = (answer: AnswerChoice) => {
    onAnswerSelect(answer.value);
    announceCorrectness(answer.isCorrect);
  };

  return (
    <div className="question-container">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title mb-4" id="question-text" aria-live="polite">
            {question.question}
          </h3>

          <div
            className="answer-options"
            role="radiogroup"
            aria-labelledby="question-text"
            aria-describedby={showResult ? "answer-feedback" : undefined}
          >
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                className={`btn btn-lg w-100 mb-3 ${getAnswerClass(answer)}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={showResult}
                role="radio"
                aria-checked={answer.value === selectedAnswer}
                aria-describedby={
                  showResult ? `answer-${index}-status` : undefined
                }
                tabIndex={showResult ? -1 : 0}
              >
                <span className="answer-text">{answer.value}</span>
                {showResult && answer.value === selectedAnswer && (
                  <span
                    className="ms-2"
                    id={`answer-${index}-status`}
                    aria-label={
                      answer.isCorrect ? "Correct answer" : "Incorrect answer"
                    }
                  >
                    {answer.isCorrect ? (
                      <i className="fas fa-check" aria-hidden="true"></i>
                    ) : (
                      <i className="fas fa-times" aria-hidden="true"></i>
                    )}
                  </span>
                )}
                {showResult &&
                  answer.isCorrect &&
                  answer.value !== selectedAnswer && (
                    <span className="ms-2" aria-label="Correct answer">
                      <i className="fas fa-check" aria-hidden="true"></i>
                    </span>
                  )}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="text-center mt-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={onNext}
                data-action={isLastQuestion ? "finish" : "next"}
                aria-describedby="answer-feedback"
              >
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
              </button>
            </div>
          )}

          {showResult && (
            <div id="answer-feedback" className="sr-only" aria-live="polite">
              {selectedAnswer &&
                (shuffledAnswers.find((a) => a.value === selectedAnswer)
                  ?.isCorrect
                  ? "Correct! Well done."
                  : "Incorrect. The correct answer was highlighted.")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
