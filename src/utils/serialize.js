/**
 * Serialize given object to string even if it's a map.
 * Can be used for deep comparison.
 *
 * @param {object|Map} obj Object to serialize
 *
 * @returns {string} Serialized version of object
 */
export const serialize = obj => {
  if (obj instanceof Map) {
    return JSON.stringify(Array.from(obj.entries()));
  }
  return JSON.stringify(obj);
};

export default serialize;
