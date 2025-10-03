import { useEffect } from "react";

interface AccessibilityManagerProps {
  children: React.ReactNode;
}

export default function AccessibilityManager({
  children,
}: AccessibilityManagerProps) {
  useEffect(() => {
    // Announce page changes to screen readers
    const announcePageChange = (message: string) => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    // Add keyboard navigation improvements
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with Alt + M
      if (event.altKey && event.key === "m") {
        event.preventDefault();
        const mainContent = document.querySelector("main, [role='main']");
        if (mainContent) {
          (mainContent as HTMLElement).focus();
          announcePageChange("Skipped to main content");
        }
      }

      // Skip to navigation with Alt + N
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        const navigation = document.querySelector("nav, [role='navigation']");
        if (navigation) {
          (navigation as HTMLElement).focus();
          announcePageChange("Skipped to navigation");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Add focus management for quiz questions
    const manageFocus = () => {
      const questionButtons = document.querySelectorAll(
        ".answer-options button"
      );
      if (questionButtons.length > 0) {
        // Ensure first button is focusable
        (questionButtons[0] as HTMLElement).focus();
      }
    };

    // Run focus management after component updates
    const observer = new MutationObserver(manageFocus);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

// Hook for managing focus in quiz components
export function useFocusManagement() {
  const focusNextQuestion = () => {
    const nextButton = document.querySelector("button[data-action='next']");
    if (nextButton) {
      (nextButton as HTMLElement).focus();
    }
  };

  const focusAnswerOptions = () => {
    const answerButtons = document.querySelectorAll(".answer-options button");
    if (answerButtons.length > 0) {
      (answerButtons[0] as HTMLElement).focus();
    }
  };

  const announceCorrectness = (isCorrect: boolean) => {
    const message = isCorrect ? "Correct answer!" : "Incorrect answer.";
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "assertive");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return {
    focusNextQuestion,
    focusAnswerOptions,
    announceCorrectness,
  };
}


