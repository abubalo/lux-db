import { Comparator, Matcher, KeyChain } from "../../types/index";
import { where } from "./where";

/**
 * Factory function to create a query builder for filtering data.
 *
 * @template T - The type of data being filtered.
 * @template R - The return type of the query builder.
 * @param {function(res: Array<Matcher<T>>): R} done - A callback function to be executed when the query is done.
 * @returns {object} - An object with methods for building the query.
 */
export const collect = <T, R>(done: (res: Array<Matcher<T>>) => R) => {
  const matchers: Array<Matcher<T>> = [];

  /**
   * Execute the query and call the 'done' callback.
   *
   * @returns {R} - The result of the query.
   */
  const run = async () => done(matchers);

  return {
    /**
     * Add a filter condition to the query.
     *
     * @param {KeyChain<T>} key - The key or property to filter on.
     * @param {Comparator} comparator - The comparison operator (e.g., 'equals', 'greaterThan').
     * @param {unknown} value - The value to compare against.
     */
    where: where<T, R>((key: KeyChain<T>, comparator: Comparator, value: unknown) => {
      matchers.push({ key, comparator, value });
    }, run),
    run,
  };
};
