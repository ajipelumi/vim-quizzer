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
  const percentage = Math.round((current / total) * 100);
  const progress = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-vim-keyword font-medium">
          Question {current} of {total}
        </span>
        <div className="flex items-center space-x-4">
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

      {/* Progress Bar Visual */}
      <div className="w-full bg-vim-bg-lighter rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-vim-accent to-vim-keyword transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index < current
                ? "bg-vim-accent"
                : index === current - 1
                ? "bg-vim-keyword"
                : "bg-vim-border"
            }`}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


