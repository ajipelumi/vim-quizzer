interface HeaderProps {
  onRestart?: () => void;
  showRestartButton?: boolean;
}

export default function Header({ onRestart, showRestartButton = false }: HeaderProps) {
  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand" href="#">
            <span className="text-vim-keyword">Vim</span>{" "}
            <span className="text-vim-type">Quizzer</span>
          </a>
          {showRestartButton && onRestart && (
            <button 
              className="restart-button" 
              onClick={onRestart}
            >
              Restart Quiz
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
