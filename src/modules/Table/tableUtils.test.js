import { getRows } from './tableUtils';

it('should get rows', () => {
  const data = [['foo', 'foo'], ['bar', 'bar']];
  expect(getRows([{ cols: [0, 0], rows: [0, 0] }], data)).toEqual([0]);
  expect(getRows([{ cols: [0, 0], rows: [1, 1] }], data)).toEqual([1]);
  expect(getRows([{ cols: [1, 1], rows: [0, 1] }], data)).toEqual([0, 1]);
  expect(getRows([{ cols: [1, 1] }], data)).toEqual([0, 1]);
  expect(getRows([], data)).toEqual([0, 1]);
});
