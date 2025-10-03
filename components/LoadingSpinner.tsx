interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-2 border-vim-border border-t-vim-accent rounded-full"></div>
      </div>
      {text && (
        <p className={`mt-2 text-vim-fg-dim ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}


