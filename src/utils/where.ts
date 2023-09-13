import { Collector, Comparator, KeyChain } from "../../types";

/**
 * Create a query builder for filtering data based on key-value comparisons.
 *
 * @template T - The type of data being filtered.
 * @template R - The return type of the query builder.
 * @param {Collector<T>} collector - A function for collecting filter conditions.
 * @param {function(): Promise<R>} runner - A function for executing the query.
 * @returns {function(KeyChain<T>): object} - A function that generates filter conditions for a specific key.
 */
export const where = <T, R>(
  collector: Collector<T>,
  runner: () => Promise<R>
) => {
  return (key: KeyChain<T>) => {
    return {
      /**
       * Add an 'equals' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'equals' applied.
       */
      equals(val: unknown) {
        collector(key, Comparator.Equals, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'notEqual' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'notEqual' applied.
       */
      notEqual(val: unknown) {
        collector(key, Comparator.NotEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'greaterThan' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'greaterThan' applied.
       */
      greaterThan(val: unknown) {
        collector(key, Comparator.GreaterThan, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'lessThan' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'lessThan' applied.
       */
      lessThan(val: unknown) {
        collector(key, Comparator.LessThan, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'greaterOrEqual' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'greaterOrEqual' applied.
       */
      greaterOrEqual(val: unknown) {
        collector(key, Comparator.GreaterOrEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'lessThanOrEqual' filter condition for the specified key.
       *
       * @param {unknown} val - The value to compare with.
       * @returns {object} - A new filter condition object with 'lessThanOrEqual' applied.
       */
      lessThanOrEqual(val: unknown) {
        collector(key, Comparator.LessThanOrEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add an 'in' filter condition for the specified key.
       *
       * @param {Array<unknown>} val - The array of values to compare with.
       * @returns {object} - A new filter condition object with 'in' applied.
       */
      in(val: Array<unknown>) {
        collector(key, Comparator.In, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'between' filter condition for the specified key.
       *
       * @param {[number, number]} val - The range of values to compare with.
       * @returns {object} - A new filter condition object with 'between' applied.
       */
      between(val: [number, number]) {
        collector(key, Comparator.Between, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      /**
       * Add a 'matches' filter condition for the specified key.
       *
       * @param {string | RegExp} val - The string or regular expression to match with.
       * @returns {object} - A new filter condition object with 'matches' applied.
       */
      matches(val: string | RegExp) {
        collector(key, Comparator.Matches, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
    };
  };
};
