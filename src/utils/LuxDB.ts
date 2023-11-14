import * as path from 'path';
import fs, { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { KeyChain, Matcher, ObjectLiteral } from '../index';
import { collect } from './collect';
import { matchDataKeyValue } from './match-data-key-value';
import { createItemFromKeys } from './create-items-from-keys';
import { DatabaseError, FileNotFoundError } from '../lib/Errors';

/**
 * Represents a simple JSON database with query capabilities.
 *
 * @template T - Type of the database items.
 */
export default class LuxDB<T extends object> {
  private readonly filePath: string;
  private _size = 0;
  private cache: Map<string, T> = new Map();
  private indexes: Map<string, Map<string, T>> = new Map(); //indexes for different fields
  private isDirty = false;

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
   * @param {string} destination - The destination for the database (default is 'db' if not specified).
   */
  constructor(
    private fileName: string,
    private destination = 'db',
  ) {
    // Construct the full file path
    this.filePath = path.join(this.createDir(destination), `${fileName}.json`);

    this.loadCache();
  }

  /**
   * Creates the destination directory if it doesn't exist.
   *
   * @param {string} destinationDir - The destination directory path.
   * @throws {DatabaseError} Throws an error if the directory creation fails.
   * @returns {string} The destination directory path.
   */
  private createDir(destinationDir: string): string {
    try {
      if (!existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      return destinationDir;
    } catch (error) {
      throw new DatabaseError(`Unable to create folder ${destinationDir}: ${error}`);
    }
  }

  /**
   * Loads data from the database file into the cache.
   *
   * @throws {FileNotFoundError} Throws a custom error if the file doesn't exist.
   * @throws {DatabaseError} Throws a custom error for other initialization errors.
   */
  private async loadCache() {
    try {
      const fileData = await readFile(this.filePath, 'utf-8');
      const parseData = JSON.parse(fileData);
      this._size = parseData.length;

      parseData.forEach((item: T) => {
        // Add items to the cache using a unique key (e.g., ID)
        this.cache.set(this.getKeyForItem(item), item);
      });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Set Map to an empty Map
        this.cache = new Map();
        // Throw a custom FileNotFoundError if the file doesn't exist
        throw new FileNotFoundError(this.filePath, error.code);
      } else {
        // Throw a DatabaseError for other errors
        throw new DatabaseError(`Failed to initialize database: ${error.message}`, -1);
      }
    }
  }

  // Add to cache and mark it as dirty
  private addToCache(data: T | T[]): void {
    const items = Array.isArray(data) ? data : [data];
    items.forEach((item) => {
      const key = this.getKeyForItem(item);
      this.cache.set(key, item);

      // Update indexes for different fields
      for (const field in item) {
        const fieldValue = item[field] as unknown as string;
        if (!this.indexes.has(field)) {
          this.indexes.set(field, new Map());
        }
        this.indexes.get(field)?.set(fieldValue, item);
      }
    });

    // Mae database as dirty
    this.isDirty = true;

    //Update database size
    this._size = this.cache.size;
  }

  /**
   * Saves data from the cache to the database file on when it's mark as dirty.
   *
   * @throws {DatabaseError} Throws a custom error if data saving fails.
   */
  private async saveToDisk(): Promise<void> {
    if (this.isDirty) {
      const dataToWrite = Array.from(this.cache.values());
      try {
        await writeFile(this.filePath, JSON.stringify(dataToWrite));
      } catch (error) {
        throw new DatabaseError(`Failed to save data to ${this.fileName}`);
      }
    }
  }

  // Retrieve items using an index
  public getIndexedItems(key: string): T | null {
    const indexedItem = this.indexes.get(key);
    return indexedItem ? indexedItem.get(key) || null : null;
  }

  // Helper function to generate a unique key for an item
  private getKeyForItem(item: T): string {
    return (item as any).id;
  }

  public async insert(items: T | T[]): Promise<T | T[]> {
    this.addToCache(items);
    this.saveToDisk();
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
      throw new DatabaseError(`Failed to save data to ${this.fileName}`);
    }
  }
}
