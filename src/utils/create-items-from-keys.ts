import { ObjectLiteral } from "../../types";

export const createItemFromKeys = (
  keys: string[],
  data: ObjectLiteral
): ObjectLiteral => {
  const partialItem: ObjectLiteral = {};

  keys.forEach((keyChain) => {
    let target = partialItem;
    let source = data;

    keyChain.split(".").forEach((key, index, parts) => {
      const value = source[key] as ObjectLiteral;

      if (value === undefined) {
        throw new Error(
          `Key ${key} does not exist in ${JSON.stringify(source)}`
        );
      }

      const isLastKey = parts.length - 1;
      target[key] =
        target[key] ?? (isLastKey ? value : Array.isArray(value) ? [] : {});
        target  = target[key] as ObjectLiteral;
        source = value;
    });
  });

  return partialItem;
};
