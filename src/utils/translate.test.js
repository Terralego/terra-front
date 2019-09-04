import translate from './translate';

it('should be a mock', () => {
  const trads = {
    foo: 'bar',
    bar: 'with some {{param}}',
    bar_baz: 'with some context {{param}}',
  };
  expect(translate()('foo')).toBe('foo');
  expect(translate(trads)('foo')).toBe('bar');
  expect(translate(trads)('bar', { param: 'bar' })).toBe('with some bar');
  expect(translate(trads)('bar', { context: 'baz', param: 'bar' })).toBe('with some context bar');
  expect(translate(trads)('bar', { context: 'foo', param: 'foo' })).toBe('with some foo');
});
