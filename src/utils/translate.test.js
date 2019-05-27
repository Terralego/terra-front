import translate from './translate';

it('should be a mock', () => {
  expect(translate({
    foo: 'bar',
  })('foo')).toBe('bar');
  expect(translate()('foo')).toBe('foo');
});
