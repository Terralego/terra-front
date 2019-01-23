import { Api, EVENT_FAILURE, EVENT_SUCCESS } from './api';

global.fetch = jest.fn(path => {
  if (path === '/wrongpath') {
    return {
      status: 404,
    };
  }
  return {
    status: 200,
  };
});

it('should build url', () => {
  const api = new Api();
  api.host = 'http://foo.bar';
  expect(api.buildUrl({ endpoint: '' })).toBe('http://foo.bar/');
  expect(api.buildUrl({ endpoint: 'foo/bar' })).toBe('http://foo.bar/foo/bar');
  expect(api.buildUrl({ endpoint: 'foo//bar' })).toBe('http://foo.bar/foo/bar');
  expect(api.buildUrl({ endpoint: 'foo', querystring: { bar: 'bar' } })).toBe('http://foo.bar/foo?bar=bar');
});

it('should fetch a request', async done => {
  const api = new Api();
  api.host = 'http://foo.bar';
  await api.request('');

  expect(global.fetch).toHaveBeenCalledWith('http://foo.bar/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  done();
});

it('should request a formData', async done => {
  const api = new Api();
  api.host = '';
  const body = new FormData();
  await api.request('', { body });
  expect(global.fetch).toHaveBeenCalledWith('/', {
    method: 'GET',
    headers: {},
    body,
  });
  done();
});


it('should catch a failed fetch', async done => {
  const api = new Api();
  api.host = '';
  let error;
  try {
    await api.request('wrongpath');
  } catch (e) {
    error = e;
  }
  expect(error.constructor).toBe(Error);
  done();
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

it('should off event', () => {
  const api = new Api();
  const off = api.on('foo', () => null);
  expect(api.listeners.length).toBe(1);
  off();
  expect(api.listeners.length).toBe(0);
  off();
  expect(api.listeners.length).toBe(0);
});

it('should build headers', () => {
  const api = new Api();
  const headers = api.buildHeaders({ foo: 'bar' });
  expect(headers).toEqual({ foo: 'bar' });

  api.token = 'token';
  const headersWithToken = api.buildHeaders({ foo: 'bar' });
  expect(headersWithToken).toEqual({ foo: 'bar', Authorization: 'JWT token' });
});

it('should fire and catch an event', () => {
  const api = new Api();
  const listener = jest.fn();
  api.on('foo', listener);
  api.fire('foo', 'bar');
  expect(listener).toHaveBeenCalledWith('bar');
});
