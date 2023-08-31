class DatabaseError extends Error {
    errorCode: number;
    timestamp: Date;

    constructor(message: string, errorCode: number) {
      super(message);
      this.name = "DatabaseError";
      this.errorCode = errorCode;
      this.timestamp = new Date();
    }
  }
  