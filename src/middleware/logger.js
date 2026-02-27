const { version } = require("react");
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH-mm-ss",
    }),
    winston.format.errors({
      stack: true,
    }),
    winston.format.json(),
  ),
  defaultMeta: {
    service: "readify-bookstore-api",
    version: env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  transports: [
    new wiston.transports.Console({
      format: wiston.format.combine(
        winston.format.colorize(),
        wiston.format.simple(),
      ),
      silent: process.env.NODE_ENV === "production",
    }),
    new wiston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 20971520,
      maxFiles: 14,
    }),
    new winston.transports.File({
      filename: "logs/conbined.log",
      maxsize: 20971520,
      maxFiles: 30,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.exceptions.handle(
    new wiston.transports.File({
      filename: "logs/exceptions.log",
    }),
  );
  logger.rejections.handle(
    new wiston.transports.File({
      filename: "logs/rejections.log",
    }),
  );
}

module.exports = logger;
