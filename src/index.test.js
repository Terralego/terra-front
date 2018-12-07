import * as lib from '.';

jest.mock('mapbox-gl', () => ({}));

it('should export each modules', () => {
  expect(lib.Api).toBeDefined();
  expect(lib.Auth).toBeDefined();
  expect(lib.Visualizer).toBeDefined();
});
