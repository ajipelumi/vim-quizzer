// interface LogLevel {
//   ERROR: "error";
//   WARN: "warn";
//   INFO: "info";
//   DEBUG: "debug";
// }

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private static instance: Logger;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private createLogEntry(
    level: string,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      context,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };
  }

  private log(
    level: string,
    message: string,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(level, message, context);

    // Console logging
    const consoleMethod =
      level === "error"
        ? "error"
        : level === "warn"
        ? "warn"
        : level === "info"
        ? "info"
        : "log";

    console[consoleMethod](
      `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
      context ? context : ""
    );

    // In production, you might want to send logs to a monitoring service
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry): void {
    // This is where you would integrate with services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for application monitoring
    // - Custom analytics service

    // For now, we'll just store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
      logs.push(entry);

      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem("app_logs", JSON.stringify(logs));
    } catch (error) {
      console.error("Failed to store log entry:", error);
    }
  }

  public error(message: string, context?: Record<string, unknown>): void {
    this.log("error", message, context);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, context);
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem("app_logs") || "[]");
    } catch (error) {
      console.error("Failed to retrieve logs:", error);
      return [];
    }
  }

  public clearLogs(): void {
    localStorage.removeItem("app_logs");
  }
}

export default Logger.getInstance();
