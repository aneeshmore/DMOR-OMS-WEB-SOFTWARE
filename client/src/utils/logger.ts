type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = import.meta.env.DEV;

const format = (level: LogLevel, message?: any, ...optionalParams: any[]) => {
  const prefix = `[${level.toUpperCase()}]`;
  if (optionalParams && optionalParams.length) {
    return [prefix, message, ...optionalParams];
  }
  return [prefix, message];
};

export const logger = {
  debug: (message?: any, ...optionalParams: any[]) => {
    if (isDev) console.debug(...format("debug", message, ...optionalParams));
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (isDev) console.info(...format("info", message, ...optionalParams));
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (isDev) console.warn(...format("warn", message, ...optionalParams));
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (isDev) console.error(...format("error", message, ...optionalParams));
  },
};

export default logger;
