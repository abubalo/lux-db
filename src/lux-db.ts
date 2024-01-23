import { LuxDB } from './lib/LuxDB';
import crypto from 'crypto';

function luxdb<T extends object>(filename: string, destination?: string) {
  return LuxDB.creatInstance<T>(filename, destination);
}

const autoId = (length = 10): string => {
  return crypto.randomBytes(length).toString('hex');
};

export { luxdb, autoId };
