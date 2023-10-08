import * as path from 'path';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { KeyChain, Matcher, ObjectLiteral } from '.';
import { collect } from './utils/collect';
import { matchDataKeyValue } from './utils/match-data-key-value';
import { createItemFromKeys } from './utils/create-items-from-keys';
import { DatabaseError, FileNotFoundError } from './lib/Errors';

/**
 * Represents a simple JSON database with query capabilities.
 * @template T - Type of the database items.
 */
export default class LuxDB<T extends object> {
  private readonly filePath: string;
  private _size = 0;

  /**
   * The number of items in the database.
   */
  get size() {
    return this._size;
  }

  /**
 * Creates a new LuxDB instance.
 *
 * @param {string} fileName - The name of the database file (without extension).
 * @param {string} location - The location for the database (default is 'db' if not specified).
 * @throws {FileNotFoundError} Throws a custom error if the database file is not found.
 * @throws {DatabaseError} Throws a custom error for other initialization errors.
 */
  constructor(
    private fileName: string,
    private location = 'db',
  ) {
    // Construct the file path
    this.filePath = path.resolve(__dirname, location, `${fileName}.json`);

    try {
      // Ensure the location folder exists; create it if it doesn't
      const locationPath = path.resolve(__dirname, location);
      if (!fs.existsSync(locationPath)) {
        fs.mkdirSync(locationPath, { recursive: true });
      }

      // Check if the database file exists
      if (!fs.existsSync(this.filePath)) {
        // Create the database file if it doesn't exist
        fs.writeFileSync(this.filePath, JSON.stringify([]), {
          encoding: 'utf-8',
        });
        console.log(`Database file created at ${this.filePath}`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Throw a custom FileNotFoundError if the file doesn't exist
        throw new FileNotFoundError(this.filePath, error.code);
      } else {
        // Throw a DatabaseError for other errors
        throw new DatabaseError(`Failed to initialize database: ${error.message}`, -1);
      }
    }
  }

  /**
   * Insert new data into the database.
   * @param item - The item to be inserted.
   * @returns Promise resolving to the inserted item.
   */
  public async insert(items: T | T[]): Promise<T | T[]> {
    if (Array.isArray(items)) {
      await this.save(items);
      this._size += items.length;
      return items;
    }
    await this.save(items);
    this._size += 1;
    return items;
  }

  /**
   * Retrieve a single item from the database based on specified keys.
   * @param keys - Keys to match for retrieving the item.
   * @returns Promise resolving to the retrieved item, or null if not found.
   */
  public getOne(...keys: KeyChain<T>[]) {
    return collect<T, Promise<T | Partial<T> | null>>(async (matchers: Matcher<T>[]) => {
      const item = (await this.read()).find((item) => {
        return matchers.every((matcher) => matchDataKeyValue(item, matcher));
      });

      if (item) {
        if (keys.length) {
          return createItemFromKeys(keys as string[], item as ObjectLiteral) as Partial<T>;
        }
        return item;
      }
      return null;
    });
  }

  /**
   * Retrieve multiple items from the database based on specified keys.
   * @param keys - Keys to match for retrieving items.
   * @returns Promise resolving to an array of retrieved items, or an array of partial items if keys are provided.
   */
  public getAll(...keys: KeyChain<T>[]) {
    return collect<T, Promise<T[] | Partial<T>[]>>(async (matchers: Matcher<T>[]) => {
      const items = (await this.read()).filter((item) => {
        return matchers.every((matcher) => matchDataKeyValue(item, matcher));
      });

      if (keys.length) {
        return items.map((item) => {
          return createItemFromKeys(keys as string[], item as ObjectLiteral) as Partial<T>;
        });
      }

      return items;
    });
  }

  /**
   * Update a single item in the database based on specified matchers (keys).
   * @param data - Partial data with fields to update in the matching item.
   * @returns Promise resolving to the updated item, or null if no match found.
   */
  public updateOne(data: Partial<T>) {
    return collect<T, Promise<T | null>>(async (matchers: Matcher<T>[]) => {
      const list = await this.read();
      const itemIndex = list.findIndex((item) => {
        return matchers.every((matcher) => matchDataKeyValue(item, matcher));
      });

      if (itemIndex >= 0) {
        list[itemIndex] = { ...list[itemIndex], ...data };
        await this.save(list);
        return list[itemIndex];
      }
      return null;
    });
  }

  /**
   * Update multiple items in the database based on specified matchers (keys).
   * @param data - Partial data with fields to update in the matching items.
   * @returns Promise resolving to an array of updated items.
   */
  public updateAll(data: Partial<T>) {
    return collect<T, Promise<T[]>>(async (matchers: Matcher<T>[]) => {
      const updateItems: T[] = [];
      const list = (await this.read()).map((item) => {
        if (matchers.every((matcher) => matchDataKeyValue(item, matcher))) {
          const updateItem = { ...item, ...data };
          updateItems.push(updateItem);
          return updateItem;
        }
        return item;
      });

      await this.save(list);

      return updateItems;
    });
  }

  /**
   * Delete a single item from the database based on specified matchers (keys).
   * @returns Promise resolving to the deleted item, or null if no match found.
   */
  public deleteOne() {
    return collect<T, Promise<T | null>>(async (matchers: Matcher<T>[]) => {
      const list = await this.read();
      const itemIndex = list.findIndex((item) => {
        return matchers.every((matcher) => matchDataKeyValue(item, matcher));
      });

      if (itemIndex >= 0) {
        const deletedItem = list.splice(itemIndex, 1)[0]; // Remove the item at itemIndex
        await this.save(list);
        return deletedItem;
      }
      return null;
    });
  }

  /**
   * Delete multiple items from the database based on specified matchers (keys).
   * @returns Promise resolving to an array of deleted items.
   */
  public deleteAll() {
    return collect<T, Promise<T[]>>(async (matchers: Matcher<T>[]) => {
      const deleteItems: T[] = [];
      const list = (await this.read()).filter((item) => {
        const toDelete = matchers.every((matcher) => matchDataKeyValue(item, matcher));
        if (toDelete) {
          deleteItems.push(item);
          return !deleteItems;
        }
        return item;
      });

      await this.save(list);

      return deleteItems;
    });
  }

  /**
   * Read the database file and parse its content.
   * @returns Promise resolving to an array of database items.
   * @private
   */
  private async read(): Promise<Array<T>> {
    return JSON.parse(await readFile(this.filePath, 'utf-8'));
  }

  /**
   * Save data to the database file.
   * @param data - Data to be saved (single item or array of items).
   * @private
   */
  private async save(data: T | Array<T>) {
    try {
      let content = data;
      if (!Array.isArray(data)) {
        content = await this.read();
        content.push(data);
      }
      await writeFile(this.filePath, JSON.stringify(content));
    } catch (error) {
      console.error(`Error saving data to file: ${this.filePath}`, error);
      throw new DatabaseError(`Failed to save data to ${this.fileName}`);
    }
  }

  public filter() {}
  private indexing() {}

  private count() {}
  private cache() {}
}
