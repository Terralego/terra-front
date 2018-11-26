export default function objectGet (o = {}, path) {
  const [firstPart, ...otherParts] = `${path}`.split(/\./);
  const value = o[firstPart];
  if (otherParts.length) {
    return objectGet(value, otherParts.join('.'));
  }
  return value;
}
