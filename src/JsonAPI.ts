import * as path from "path";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { where } from "./utils/where";
import { KeyChain, Matcher } from "../types";
import { collect } from "./utils/collect";

export class JSONDatatbase<T extends object> {
  private readonly filePath: string;
  private _size = 0;

  
  get size(){
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
  
  public async select(){
    return {
      where: where(),
      run,
    }
  }

  getOne(...keys: KeyChain<T>[]){

    return collect<T, Promise<T | Partial<T> | null>>( async (matchers: (Matcher<T>)[])=>{
      console.log(matchers, keys);
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
