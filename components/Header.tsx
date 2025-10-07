interface HeaderProps {
  onRestart?: () => void;
  showRestartButton?: boolean;
}

export default function Header({ onRestart, showRestartButton = false }: HeaderProps) {
  return (
    <header className="h-16">
      <nav className="navbar h-full">
        <div className="container h-full flex items-center justify-between">
          <a className="navbar-brand" href="#">
            <span className="text-vim-keyword">Vim</span>{" "}
            <span className="text-vim-type">Quizzer</span>
          </a>
          
          <div className="flex items-center space-x-4">
            {showRestartButton && onRestart && (
              <button
                onClick={onRestart}
                className="px-4 py-1.5 text-sm font-medium text-white bg-vim-cterm-Comment rounded hover:bg-vim-cterm-Comment/90 transition-colors"
              >
                Restart Quiz
              </button>
            )}
            <a
              href="https://www.buymeacoffee.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-black bg-yellow-400 rounded hover:bg-yellow-500 transition-colors"
            >
              <span className="mr-1">☕</span> Buy me a coffee
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
