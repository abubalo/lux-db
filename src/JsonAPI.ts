import * as path from "path";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { where } from "./utils/where";
import { KeyChain, Matcher, ObjectLiteral } from "../types";
import { collect } from "./utils/collect";
import { matchDataKayValue } from "./utils/match-data-key-value";
import { createItemFromKeys } from "./utils/create-items-from-keys";

export class JSONDatatbase<T extends object> {
  private readonly filePath: string;
  private _size = 0;

  get size() {
    return this._size;
  }

  constructor(private fileName: string) {
    this.filePath = path.join(__dirname + "/db", `${fileName}.json`);

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), {
        encoding: "utf-8",
      });
    }
  }

  public async insert(item: T): Promise<T> {
    await this.save(item);
    this._size += 1;
    return item;
  }

  public getOne(...keys: KeyChain<T>[]) {
    return collect<T, Promise<T | Partial<T> | null>>(
      async (matchers: Matcher<T>[]) => {
        const item = (await this.read()).find((item) => {
          return matchers.every((matcher) => matchDataKayValue(item, matcher));
        });

        if (item) {
          if (keys.length) {
            return createItemFromKeys(
              keys as string[],
              item as ObjectLiteral
            ) as Partial<T>;
          }
          return item;
        }
        return null;
      }
    );
  }
  public getAll(...keys: KeyChain<T>[]) {
    return collect<T, Promise<T[] | Partial<T>[]>>(
      async (matchers: Matcher<T>[]) => {
        const items = (await this.read()).filter((item) => {
          return matchers.every((matcher) => matchDataKayValue(item, matcher));
        });

        if (keys.length) {
          return items.map((item) => {
            return createItemFromKeys(
              keys as string[],
              item as ObjectLiteral
            ) as Partial<T>;
          });
        }

        return items;
      }
    );
  }

  public updateOne(data: Partial<T>) {
    return collect<T, Promise<T | null>>(async (matchers: Matcher<T>[]) => {
      const list = await this.read();
      const itemIndex = list.findIndex((item) => {
        return matchers.every((matcher) => matchDataKayValue(item, matcher));
      });

      if (itemIndex >= 0) {
        list[itemIndex] = { ...list[itemIndex], ...data };
        await this.save(list);
        return list[itemIndex];
      }
      return null;
    });
  }

  public updateAll(data: Partial<T>) {
    return collect<T, Promise<T[]>>(async (matchers: Matcher<T>[]) => {
      const updateItems: T[] = [];
      const list = (await this.read()).map((item) => {
        if (matchers.every((matcher) => matchDataKayValue(item, matcher))) {
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

  public deleteOne() {
    return collect<T, Promise<T | null>>(async (matchers: Matcher<T>[]) => {
      const list = await this.read();
      const itemIndex = list.findIndex((item) => {
        return matchers.every((matcher) => matchDataKayValue(item, matcher));
      });

      if (itemIndex >= 0) {
        const deletedItem = list.splice(itemIndex, 1)[0]; // Remove the item at itemIndex
        await this.save(list);
        return deletedItem;
      }
      return null;
    });
  }

  

  private async read(): Promise<Array<T>> {
    return JSON.parse(await readFile(this.filePath, "utf-8"));
  }

  private async save(data: T | Array<T>) {
    try {
      let content = data;
      if (!Array.isArray(data)) {
        content = await this.read();
        content.push(data);
      }
      return writeFile(this.filePath, JSON.stringify(content));
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to save data to ${this.fileName}`);
    }
  }
}
