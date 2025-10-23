interface ProgressIndicatorProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showScore?: boolean;
  score?: number;
  className?: string;
}

export default function ProgressIndicator({
  current,
  total,
  showPercentage = true,
  showScore = false,
  score = 0,
  className = "",
}: ProgressIndicatorProps) {
  const completedQuestions = current - 1;
  const percentage = Math.round((completedQuestions / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      {/* Header with Question Count and Score */}
      <div className="flex flex-col items-center justify-center -mt-4 mb-2 space-y-2">
        <span className="text-vim-keyword font-medium text-center">
          Question {current} of {total}
        </span>
        <div className="flex items-center justify-center space-x-4">
          {showPercentage && (
            <span className="text-vim-fg-dim text-sm">{percentage}%</span>
          )}
          {showScore && (
            <span className="text-vim-constant font-semibold">
              Score: {score}
            </span>
          )}
        </div>
      </div>

      {/* New Progress Bar Design */}
      <div className="w-full grid grid-cols-10 gap-1 -mb-8">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className="relative h-2 group"
            title={`Question ${index + 1}`}
          >
            <div
              className={`
                w-full h-full rounded transition-all duration-300
                ${
                  index < completedQuestions
                    ? "bg-gradient-to-r from-vim-accent to-vim-keyword"
                    : index === completedQuestions
                    ? "bg-vim-selection"
                    : "bg-vim-bg-lighter"
                }
                ${index === current - 1 ? "animate-pulse" : ""}
              `}
            />
            {/* Hover Label */}
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                          opacity-0 group-hover:opacity-100 transition-opacity
                          text-xs bg-vim-bg-dark px-2 py-1 rounded whitespace-nowrap"
            >
              Question {index + 1}
              {index < completedQuestions && (
                <span className="ml-1 text-vim-accent">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
