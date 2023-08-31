import  JSONDatabase  from "./src/JsonAPI";

// Mock for fs.promises.writeFile
jest.mock("fs/promises", () => ({
  writeFile: jest.fn(),
}));

// Mock for fs.promises.readFile
jest.mock("fs/promises", () => ({
  ...jest.requireActual("fs/promises"),
  readFile: jest.fn(),
}));

describe("JSONDatabase", () => {
  const mockWriteFile = (jest.requireMock("fs/promises") as any).writeFile;
  const mockReadFile = (jest.requireMock("fs/promises") as any).readFile;

  beforeEach(() => {
    mockWriteFile.mockClear();
    mockReadFile.mockClear();
  });

  it("should insert an item into the database", async () => {
    // Arrange
    const db = new JSONDatabase<{ id: number; name: string }>("testDB");
    const item = { id: 1, name: "John" };

    // Act
    await db.insert(item);

    // Assert
    expect(mockWriteFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify([item]), "utf-8");
    expect(db.size).toBe(1);
  });

  it("should retrieve a single item from the database", async () => {
    // Arrange
    const db = new JSONDatabase<{ id: string; name: string }>("testDB");
    const item = { id: 1, name: "John" };
    const matchers = [{ name: "John" }];

    mockReadFile.mockResolvedValueOnce(JSON.stringify([item]));

    // Act
    const retrievedItem = await db.getOne(...matchers);

    // Assert
    expect(retrievedItem).toEqual(item);
    expect(mockReadFile).toHaveBeenCalledWith(expect.any(String), "utf-8");
  });

  // Todo: Add more tests for other methods
});
