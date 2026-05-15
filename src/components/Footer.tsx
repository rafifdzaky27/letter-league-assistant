export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-border-default bg-bg-primary px-8 py-4 md:flex-row md:items-center">
      <p className="max-w-[672px] text-xs text-text-secondary">
        © 2024 Letter League Solver. Disclaimer: This tool is not affiliated
        with any official game. Dictionary data may vary from live game logic.
      </p>
      <div className="flex gap-4 text-xs text-text-secondary">
        <a href="#" className="no-underline hover:text-text-primary transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="no-underline hover:text-text-primary transition-colors">
          Terms of Service
        </a>
        <a href="#" className="no-underline hover:text-text-primary transition-colors">
          API Docs
        </a>
      </div>
    </footer>
  );
}
