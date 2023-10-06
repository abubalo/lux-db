import { Matcher, ObjectLiteral, Comparator } from '../types';
import { getKeyChainValue } from './get-key-chain-values';

/**
 * Match a specific data key-value pair against a provided data object using the given comparator.
 *
 * @template T - The type of data being matched.
 * @param {T} data - The data object to match against.
 * @param {Matcher<T>} matcher - The matcher object containing the key, comparator, and value to match.
 * @returns {boolean} - True if the data matches the provided criteria; otherwise, false.
 */
export const matchDataKeyValue = <T>(data: T, { comparator, key, value }: Matcher<T>): boolean => {
  const val = getKeyChainValue(key as string, data as ObjectLiteral);

  switch (comparator) {
    case Comparator.Equals:
      return val === value;

    case Comparator.NotEqual:
      return val !== value;

    case Comparator.Between:
      return Number(val) > Number((value as Array<number>)[0]) && Number(val) < Number((value as Array<number>)[1]);

    case Comparator.GreaterOrEqual:
      return Number(val) >= Number(value);

    case Comparator.LessThanOrEqual:
      return Number(val) <= Number(value);

    case Comparator.GreaterThan:
      return Number(val) > Number(value);

    case Comparator.LessThan:
      return Number(val) < Number(value);

    case Comparator.Matches:
      return typeof value === 'string' ? new RegExp(value).test(`${val}`) : (value as RegExp).test(`${val}`);

    default:
      return false;
  }
};
