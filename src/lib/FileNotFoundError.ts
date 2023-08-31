class FileNotFoundError extends Error {
    constructor(filePath: string) {
      super(`File not found: ${filePath}`);
      this.name = "FileNotFoundError";
    }
  }