import * as path from "path";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { where } from "./util/where";

export class JsonAPI<T extends object> {
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
  
  public async create(name: string, data: T | Array<T>): Promise<T | Array<T>>{
    const filePath = path.join(__dirname + "/types", `${name}.d.ts`);
  
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), {
        encoding: "utf-8",
      });
    }
    return await T
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
