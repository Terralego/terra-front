import * as lib from './';

it('should export each modules', () => {
  expect(lib.Api).toBeDefined();
  expect(lib.Auth).toBeDefined();
});
