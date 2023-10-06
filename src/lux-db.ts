import JSONDatabase from "../src/JsonAPI"
import createID from "./lib/generateId";

// Singleton instance
let instance: JSONDatabase<any>;

/**
 * Create and return a single/global instance of the JSONDatabase.
 * @param fileName - The name of the database file (without extension).
 * @returns The JSONDatabase instance.
 */
const luxdb = <T extends object>(fileName: string) => {
  if (!instance) {
    instance = new JSONDatabase<T>(fileName);
  }
  return instance as JSONDatabase<T>;
};

export default luxdb;




export const autoId = (length?: string)=> createID()