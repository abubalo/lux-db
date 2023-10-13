import LuxDB from './utils/LuxDB';
import { createId } from '@paralleldrive/cuid2';

// Singleton instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: LuxDB<any>;

/**
 * Create and return a single/global instance of the LuxDB.
 * @param fileName - The name of the database file (without extension).
 * @param destination - The folder where the databases will be located.
 * @returns The LuxDB instance.
 */
const luxdb = <T extends object>(fileName: string, destination?: string): LuxDB<T> => {
  if (!instance) {
    instance = new LuxDB<T>(fileName, destination);
  }
  return instance;
};

const autoId = (): string => createId();

export { luxdb as default, autoId };


