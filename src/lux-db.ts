import {LuxDB} from './lib/LuxDB';
import crypto from 'crypto';

// Singleton instance
let instance: LuxDB<any> | null = null;

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
  return instance as LuxDB<T>;
};

const autoId = (): string => {
  return crypto.randomBytes(10).toString('hex');
};

export { luxdb as default, autoId };
