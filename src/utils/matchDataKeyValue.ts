import { Matcher, ObjectLiteral, Comparator } from "../types/types";
import { getKeyChainValue } from "./getKeyChainValues";
export const matchDataKayValue = <T>(
  data: T,
  { comparator, key, value }: Matcher<T>
) => {
  const val = getKeyChainValue(key as string, data as ObjectLiteral);

  switch (comparator) {
    case Comparator.Equals:
      return val === value;

    case Comparator.NotEqual:
      return val !== value;

    case Comparator.Between:
      return (
        Number(val) > Number((value as Array<number>)[0]) &&
        Number(val) < Number((value as Array<number>)[1])
      );

    case Comparator.GreaterOrEqual:
      return Number(val) >= Number(value);

    case Comparator.LessThanOrEqual:
      return Number(val) <= Number(value);

    case Comparator.GreaterThan:
      return Number(val) > Number(value);

    case Comparator.LessThan:
      return Number(val) < Number(value);

    case Comparator.Matches:
      return typeof value === "string"
        ? new RegExp(value).test(`${val}`)
        : (value as RegExp).test(`${val}`);

    default:
      return false;
  }
};
