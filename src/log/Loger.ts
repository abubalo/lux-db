import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

try {
  // ...
} catch (error: any) {
  logger.error(error.message, { stack: error.stack, timestamp: new Date() });
}