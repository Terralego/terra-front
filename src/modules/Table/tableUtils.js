export const getRows = (selection, data) => {
  if (!selection[0]) {
    return Array.from({ length: data.length }, (v, k) => k);
  }
  return [...new Set(selection.reduce((lines, { rows, rows: [start, end] = [] }) =>
    [
      ...lines,
      ...(rows
        ? Array.from({ length: end + 1 }, (v, k) => k).filter((v, k) => k >= start)
        : Array.from({ length: data.length }, (v, k) => k)),
    ], []))];
};

export default getRows;
