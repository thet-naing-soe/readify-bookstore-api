const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({
      stack: true,
    }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: "readify-bookstore-api",
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
      silent: process.env.NODE_ENV === "production",
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 20971520,
      maxFiles: 14,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 20971520,
      maxFiles: 30,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.exceptions.handle(
    new winston.transports.File({
      filename: "logs/exceptions.log",
    }),
  );
  logger.rejections.handle(
    new winston.transports.File({
      filename: "logs/rejections.log",
    }),
  );
}

module.exports = logger;
