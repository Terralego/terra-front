import * as lib from '.';

jest.mock('maplibre-gl', () => ({}));

it('should export each modules', () => {
  expect(lib.Api).toBeDefined();
  expect(lib.Auth).toBeDefined();
  expect(lib.Map).toBeDefined();
});
