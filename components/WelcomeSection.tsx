interface WelcomeSectionProps {
  onStartQuiz: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function WelcomeSection({
  onStartQuiz,
  isLoading,
  error,
}: WelcomeSectionProps) {
  return (
    <section className="quiz-section">
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="welcome-content">
            <h2>
              Welcome to the <span className="text-vim-keyword">Vim</span>{" "}
              <span className="text-vim-type">Quizzer</span>!
            </h2>
            <p>
              Test your knowledge of{" "}
              <strong className="text-vim-string">Vim</strong> with our quiz and
              find out if you&apos;re a{" "}
              <span className="text-vim-success">
                <i className="fas fa-hat-wizard me-2"></i>Vim Wizard
              </span>{" "}
              or a{" "}
              <span className="text-vim-info">
                <i className="fas fa-user-graduate me-2"></i>Vim Rookie
              </span>
            </p>
            <ul>
              <li>
                <span className="text-vim-keyword font-semibold">
                  Number of Questions:{" "}
                </span>
                <span className="text-vim-constant">10</span> (enough to
                challenge even Vim Wizards)
              </li>
              <li>
                <span className="text-vim-keyword font-semibold">Type: </span>
                Multiple Choice (because choosing just one Vim command is hard)
              </li>
              <li>
                <span className="text-vim-keyword font-semibold">
                  Time Allowed:{" "}
                </span>
                As long as it takes to craft the perfect command
              </li>
            </ul>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={onStartQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading Questions...
                </>
              ) : (
                "Begin Your Vim Quest"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
