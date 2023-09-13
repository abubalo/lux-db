import { ObjectLiteral } from "../../types/index";

/**
 * Create a new object by selecting specific keys from a source object
 * based on a provided list of key chains.
 *
 * @param {string[]} keys - An array of key chains to select from the source object.
 * @param {ObjectLiteral} data - The source object from which to select keys.
 * @returns {ObjectLiteral} - A new object containing selected keys and their values.
 * @throws {Error} If a key in the key chain does not exist in the source object.
 */
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
      target = target[key] as ObjectLiteral;
      source = value;
    });
  });

  return partialItem;
};
