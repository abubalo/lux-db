import LuxDB from "../src/LuxDB";
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

describe('LuxDB', () => {
  let db: LuxDB<{ id: string; name: string }>;

  beforeAll(() => {
    // Create a temporary test file
    writeFileAsync('test-db.json', '[]', 'utf-8');
  });

  afterAll(() => {
    // Clean up the temporary test file
    fs.unlinkSync('test-db.json');
  });

  beforeEach(() => {
    // Instantiate the LuxDB class before each test
    db = new LuxDB<{ id: string; name: string }>('test-db');
  });

  afterEach(async () => {
    // Clear the database after each test
    await db.deleteAll();
  });

  it('should insert a single item', async () => {
    const item = await db.insert({ id: '1', name: 'Item 1' });
    expect(item).toEqual({ id: '1', name: 'Item 1' });
  });

  it('should insert multiple items', async () => {
    const items = await db.insert([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
    expect(items).toEqual([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
  });

  it('should retrieve a single item', async () => {
    await db.insert({ id: '1', name: 'Item 1' });
    const item = await db.getOne('id', 'name').where('id').equals('1').run();
    expect(item).toEqual({ id: '1', name: 'Item 1' });
  });

  it('should retrieve multiple items', async () => {
    await db.insert([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
    const items = await db.getAll('id', 'name').where('id').equals('1').run();
    expect(items).toEqual([{ id: '1', name: 'Item 1' }]);
  });

});
