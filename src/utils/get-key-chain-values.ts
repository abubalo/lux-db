import { ObjectLiteral } from "../../types/index";

/**
 * Get the value associated with a given key chain from a source object.
 *
 * @param {string} keyChain - The dot-separated key chain to traverse within the source object.
 * @param {ObjectLiteral} data - The source object from which to retrieve the value.
 * @returns {unknown} - The value associated with the specified key chain.
 * @throws {Error} If the key chain is invalid or if a key in the chain does not exist in the source object.
 */
export const getKeyChainValue = (
  keyChain: string,
  data: ObjectLiteral
): unknown => {
  const parts = keyChain.split(".");
  const key = parts.shift() as string;
  const value = data[key] as ObjectLiteral;

  if (parts.length) {
    if (value && typeof value === "object") {
      return getKeyChainValue(parts.join("."), value);
    }

    throw new Error(`Cannot get "${parts.join(".")}" of ${value}`);
  }

  return value;
};
