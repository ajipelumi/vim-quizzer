interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={className}>
      <div className="container">
        <p className="mb-1">
          &copy; 2023 Vim Quizzer. All rights reserved. Created By:{" "}
          <a
            href="https://github.com/ajipelumi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ajisafe Oluwapelumi
          </a>
        </p>
      </div>
    </footer>
  );
}
