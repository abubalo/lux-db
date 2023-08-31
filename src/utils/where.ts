import { Collector, Comparator, KeyChain } from "../../types";

export const where = <T, R>(collector: Collector<T>, runner: ()=> Promise<R>) => {
  return (key: KeyChain<T>) => {
    return {
      equals(val: unknown) {
        collector(key, Comparator.Equals, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      notEqual(val: unknown) {
        collector(key, Comparator.NotEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      greaterThan(val: unknown) { 
        collector(key, Comparator.GreaterThan, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      lessThan(val: unknown) {
        collector(key, Comparator.LessThan, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      greaterOrEqual(val: unknown) {
        collector(key, Comparator.GreaterOrEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      lessThanOrEqual(val: unknown) {
        collector(key, Comparator.LessThanOrEqual, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      in(val: Array<unknown>) {
        collector(key, Comparator.In, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      between(val: [number, number]) {
        collector(key, Comparator.Between, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
      matches(val: string | RegExp) {
        collector(key, Comparator.Matches, val);
        return { where: where<T, R>(collector, runner), run: runner };
      },
    };
  };
};
