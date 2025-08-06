export function filterFalsyProps(obj) {
  return Object.entries(obj)
    .filter(([key, value]) => value) // Filter out falsy values
    .reduce((acc, [key, value]) => {
      acc[key] = value; // Add key-value pair to the accumulator object
      return acc;
    }, {}); // Initialize the accumulator as an empty object
}

export const objToAntdSelectArr = (obj) =>
  Object.entries(obj).map(([key, value]) => ({ label: value, value: key }));
