import winston from "winston";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.resolve(__dirname, "..", "..", "logs");

// ── Custom format: readable console output ──────────────────────────
const consoleFormat = winston.format.printf(({ level, message, timestamp, label }) => {
  const tag = label ? `[${label}]` : "";
  return `${timestamp} ${tag} ${message}`;
});

// ── Transports ──────────────────────────────────────────────────────
const transports: winston.transport[] = [
  // Console: colored, human-readable
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "HH:mm:ss" }),
      consoleFormat
    ),
  }),
  // File: full JSON, one file per run (timestamped filename)
  new winston.transports.File({
    dirname: logsDir,
    filename: `session-${new Date().toISOString().replace(/[:.]/g, "-")}.log`,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// ── Create the base logger ──────────────────────────────────────────
const winstonLogger = winston.createLogger({
  level: "info",
  transports,
});

// ── Convenience wrapper ─────────────────────────────────────────────
// Each component gets a labelled child so you can filter logs by source.

function createLogger(label: string) {
  return {
    info: (msg: string, meta?: Record<string, unknown>) =>
      winstonLogger.info(msg, { label, ...meta }),

    warn: (msg: string, meta?: Record<string, unknown>) =>
      winstonLogger.warn(msg, { label, ...meta }),

    error: (msg: string, error?: unknown) =>
      winstonLogger.error(msg, {
        label,
        error: error instanceof Error ? error.message : String(error ?? ""),
      }),

    success: (msg: string, meta?: Record<string, unknown>) =>
      winstonLogger.info(`✅ ${msg}`, { label, ...meta }),

    fail: (msg: string, meta?: Record<string, unknown>) =>
      winstonLogger.warn(`❌ ${msg}`, { label, ...meta }),
  };
}

// ── Named loggers for each component ────────────────────────────────
export const log = {
  server: createLogger("SERVER"),
  producer: createLogger("PRODUCER"),
  consumer: createLogger("CONSUMER"),
  db: createLogger("DB"),
};
