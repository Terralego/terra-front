import capitalize from './strings';

it('should capitalize', () => {
  expect(capitalize('hello world')).toBe('Hello world');
});
