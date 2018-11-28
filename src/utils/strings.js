// Set the first character to uppercase
export function capitalize (str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`;
}

export default capitalize;
