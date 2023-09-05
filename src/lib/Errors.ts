export class DatabaseError extends Error {
  errorCode: number;
  timestamp: Date;

  constructor(message: string, errorCode: number) {
    super(message);
    this.name = "DatabaseError";
    this.errorCode = errorCode;
    this.timestamp = new Date();
  }
}
export class StackTraceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StackTraceError";
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
    this.name = "FileNotFoundError";
  }
}
