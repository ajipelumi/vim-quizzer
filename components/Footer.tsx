interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`w-full py-4 border-t border-gray-700 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-center text-sm text-gray-400">
          &copy; 2023 Vim Quizzer. All rights reserved. Created By:{" "}
          <a
            href="https://github.com/ajipelumi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-vim-insert hover:underline"
          >
            Ajisafe Oluwapelumi
          </a>
        </p>
      </div>
    </footer>
  );
}
