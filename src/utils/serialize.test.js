import serialize from './serialize';

it('should serialize an object', () => {
  expect(serialize({ a: 42 })).toBe('{"a":42}');
});

it('should serialize a map', () => {
  expect(serialize(new Map([['a', 42]]))).toBe('[["a",42]]');
});
