import fetchFeatures, { clear } from './fetchFeatures';

beforeEach(clear);

it('should fetch features', async done => {
  const expected = {};
  const fetched = {
    json: () => expected,
  };
  global.fetch = jest.fn(() => fetched);

  const resp = await fetchFeatures('some/url/1');

  expect(resp).toBe(expected);

  done();
});

it('should cache response', () => {
  const resp1 = fetchFeatures('some/url/2');
  const resp2 = fetchFeatures('some/url/2');
  expect(resp1).toBe(resp2);
});


it('should fail to fetch features', async done => {
  const fetched = {
    status: 404,
    statusText: 'not found',
  };
  global.fetch = jest.fn(() => fetched);

  try {
    await fetchFeatures('some/url/3');
    expect(true).not.toBe(true);
  } catch (e) {
    expect(e.message).toBe('not found');
  }

  done();
});
