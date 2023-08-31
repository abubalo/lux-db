export type ObjectLiteral = Record<string, unknown>;

export type Collector<T> = (
  key: KeyChain<T>,
  comparator: Comparator,
  value: unknown
) => void;

export interface Matcher<T> {
  key: KeyChain<T>,
  comparator: Comparator,
  value: unknown
}
export type KeyChain<T> = keyof T | string;

export enum Comparator {
  Equals = 0,
  NotEqual = 1,
  GreaterThan = 2,
  LessThan = 3,
  GreaterOrEqual = 4,
  LessThanOrEqual = 5,
  In = 6,
  Between = 7,
  Matches = 8,
}
