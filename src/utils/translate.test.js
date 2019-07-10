import translate from './translate';

it('should be a mock', () => {
  const trads = {
    foo: 'bar',
    bar: 'with some {{param}}',
  };
  expect(translate()('foo')).toBe('foo');
  expect(translate(trads)('foo')).toBe('bar');
  expect(translate(trads)('bar', { param: 'bar' })).toBe('with some bar');
});
