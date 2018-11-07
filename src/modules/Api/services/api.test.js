import { Api, EVENT_FAILURE, EVENT_SUCCESS } from './api';

global.fetch = jest.fn();

it('should build url', () => {
  const api = new Api();
  api.host = 'http://foo.bar';
  expect(api.buildUrl({ endpoint: '' })).toBe('http://foo.bar/');
  expect(api.buildUrl({ endpoint: 'foo/bar' })).toBe('http://foo.bar/foo/bar');
  expect(api.buildUrl({ endpoint: 'foo//bar' })).toBe('http://foo.bar/foo/bar');
});

it('should fetch a request', () => {
  const api = new Api();
  api.host = 'http://foo.bar';
  api.request('');
  expect(global.fetch).toHaveBeenCalledWith('http://foo.bar/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
});

it('should fire events', () => {
  const api = new Api();
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  api.on(EVENT_FAILURE, listener1);
  api.on(EVENT_SUCCESS, listener2);
  api.handleError({});
  expect(listener1).toHaveBeenCalled();
  api.handleSuccess({});
  expect(listener2).toHaveBeenCalled();
});
