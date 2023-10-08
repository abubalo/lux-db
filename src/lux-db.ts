import LuxDB from "./LuxDB"
import {createId} from "@paralleldrive/cuid2"


// Singleton instance
let instance: LuxDB<any>;

/**
 * Create and return a single/global instance of the LuxDB.
 * @param fileName - The name of the database file (without extension).
 * @returns The LuxDB instance.
 */
const luxdb = <T extends object>(fileName: string): LuxDB<T> => {
  if (!instance) {
    instance = new LuxDB<T>(fileName);
  }
  return instance;
};

export default luxdb;




export const autoId = (): string => createId()