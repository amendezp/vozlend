// ============================================
// Echo Bank — Structured Logger
// JSON-formatted logs for production observability
// ============================================

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  [key: string]: unknown;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: "echobank",
    ...context,
  };
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry = createLogEntry(level, message, context);

  if (IS_PRODUCTION) {
    // Structured JSON for log aggregation (Vercel, Datadog, etc.)
    const output = JSON.stringify(entry);
    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  } else {
    // Human-readable format for development
    const prefix = `[EchoBank] [${level.toUpperCase()}]`;
    const contextStr = context
      ? ` ${JSON.stringify(context, null, 0)}`
      : "";
    switch (level) {
      case "error":
        console.error(`${prefix} ${message}${contextStr}`);
        break;
      case "warn":
        console.warn(`${prefix} ${message}${contextStr}`);
        break;
      case "debug":
        console.debug(`${prefix} ${message}${contextStr}`);
        break;
      default:
        console.log(`${prefix} ${message}${contextStr}`);
    }
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) =>
    log("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) =>
    log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) =>
    log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) =>
    log("error", message, context),
};
