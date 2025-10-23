import { useState } from "react";
import { FiAward, FiCode, FiClock, FiPlay, FiLayers } from "react-icons/fi";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface WelcomeSectionProps {
  onStartQuiz: (difficulty: Difficulty) => void;
  isLoading: boolean;
  error: string | null;
  currentDifficulty?: Difficulty;
}
export default function WelcomeSection({
  onStartQuiz,
  isLoading,
  error,
  currentDifficulty = "beginner",
}: WelcomeSectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>(currentDifficulty);

  const handleStartQuiz = () => {
    onStartQuiz(selectedDifficulty);
  };

  return (
    <section className="w-full py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="w-full">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Welcome to the <span className="text-vim-keyword">Vim</span>&nbsp;
              <span className="text-vim-type">Quizzer</span>!
            </h1>

            <p className="text-lg mb-8 text-center text-gray-200">
              Test your knowledge of&nbsp;{" "}
              <strong className="text-vim-string">Vim</strong> with our
              AI-powered quiz and find out if you&apos;re a&nbsp;{" "}
              <span className="text-vim-success font-medium">
                <i className="fas fa-hat-wizard mr-2"></i>Vim Wizard
              </span>{" "}
              &nbsp; or a&nbsp;{" "}
              <span className="text-vim-info font-medium">
                <i className="fas fa-user-graduate mr-2"></i>Vim Rookie
              </span>
            </p>

            <div className="bg-vim-bg-light p-4 sm:p-6 rounded-lg mb-8 max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4 text-vim-keyword">
                <FiAward className="inline mr-2" />
                Quiz Details
              </h3>

              <ul className="space-y-3">
                <li className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiCode className="text-vim-string mr-2" />
                    <span className="font-medium text-vim-keyword">
                      Questions
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-vim-constant">10</span>
                    <span className="text-gray-300 ml-1">
                      (AI-generated for your skill level)
                    </span>
                  </div>
                </li>
                <li className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiLayers className="text-vim-string mr-2" />
                    <span className="font-medium text-vim-keyword">Type</span>
                  </div>
                  <span className="text-gray-300">
                    Multiple Choice (with detailed explanations)
                  </span>
                </li>
                <li className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiClock className="text-vim-string mr-2" />
                    <span className="font-medium text-vim-keyword">Time</span>
                  </div>
                  <span className="text-gray-300">
                    Take your time to master each concept
                  </span>
                </li>
              </ul>

              <div className="mt-12 text-center">
                <label className="block text-sm font-medium text-vim-keyword mb-2">
                  Select Difficulty:
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedDifficulty(level)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          selectedDifficulty === level
                            ? "bg-vim-selection text-white"
                            : "bg-vim-bg-darker hover:bg-vim-bg-dark text-gray-300"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                  className="bg-vim-insert text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 inline-flex items-center justify-center mx-auto whitespace-nowrap relative group"
                >
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-3">Generating Questions...</span>
                    </div>
                  ) : (
                    <>
                      <FiPlay className="mr-2 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        Start&nbsp;{" "}
                        {selectedDifficulty.charAt(0).toUpperCase() +
                          selectedDifficulty.slice(1)}{" "}
                        &nbsp; Quiz
                      </span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 text-red-400 text-sm">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
