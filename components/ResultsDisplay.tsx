import { QuizState } from "@/types";

interface ResultsDisplayProps {
  quizState: QuizState;
  onReset: () => void;
}

export default function ResultsDisplay({
  quizState,
  onReset,
}: ResultsDisplayProps) {
  const percentage = Math.round(
    (quizState.score / quizState.totalQuestions) * 100
  );

  const getResultMessage = () => {
    if (percentage >= 90) {
      return {
        title: "Vim Wizard! 🧙‍♂️",
        message: "Outstanding! You're a true Vim master!",
        color: "text-vim-success",
      };
    } else if (percentage >= 70) {
      return {
        title: "Vim Expert! 🎯",
        message: "Great job! You know your Vim commands well!",
        color: "text-vim-accent",
      };
    } else if (percentage >= 50) {
      return {
        title: "Vim Apprentice! 📚",
        message: "Not bad! Keep practicing to improve your Vim skills!",
        color: "text-vim-warning",
      };
    } else {
      return {
        title: "Vim Rookie! 🎓",
        message:
          "Don't worry! Every Vim master started as a rookie. Keep learning!",
        color: "text-vim-info",
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <div className="card text-center results-card">
          <div className="card-body">
            <h2 className={`card-title ${result.color}`}>{result.title}</h2>

            <div className="mb-4">
              <div className="display-1 fw-bold text-vim-accent">
                {quizState.score}/{quizState.totalQuestions}
              </div>
              <div className="h3 text-vim-fg-dim">{percentage}%</div>
            </div>

            <p className="card-text mb-4">{result.message}</p>

            <div className="mb-4">
              <div className="progress mb-2" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${percentage}%` }}
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-lg" onClick={onReset}>
                <i className="fas fa-redo me-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
