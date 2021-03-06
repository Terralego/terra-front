import b64u from 'base64url';

import Api from '../../Api';
import { obtainToken, refreshToken, getToken, clearToken, createToken } from './auth';
import { getTokenPayload } from '../../../utils/jwt';

export const MOCKED_PAYLOAD = { exp: 1516239022, user: { id: 42 } };
export const MOCKED_TOKEN = `xxx.${b64u(JSON.stringify({ ...MOCKED_PAYLOAD }))}.xxx`;
export const IMPERISHABLE_TOKEN = `imp.${b64u(JSON.stringify({ ...MOCKED_PAYLOAD, exp: 99999999999 }))}.xxx`;
export const EXPIRED_TOKEN = `exp.${b64u(JSON.stringify({ ...MOCKED_PAYLOAD, exp: 0 }))}.xxx`;

jest.mock('../../Api', () => {
  // eslint-disable-next-line global-require
  const b64uM = require('base64url');

  return {
    EVENT_FAILURE: 'failure',
    on: jest.fn((event, fn) => {
      fn({ status: 401 });
      fn({ status: 200 });
    }),
    request: jest.fn((endpoint, { body: { token } }) => {
      if (endpoint === 'auth/obtain-token/') {
        return { token: 'newToken' };
      }

      if (endpoint === 'auth/refresh-token/') {
        const [, b64Payload] = token.split('.');
        const payload = JSON.parse(b64uM.decode(b64Payload));
        const isValid = (payload.exp * 1000) >= Date.now();

        if (token === 'invalid' || !isValid) {
          throw new Error('Invalid token');
        }

        return { token: 'refreshedToken' };
      }

      return {};
    }),
    POST: 'POST',
  };
});

it('should add a listener to Api', () => {
  expect(Api.on).toHaveBeenCalled();
});

it('should not refresh token', async done => {
  const token = await refreshToken();
  expect(token).toBe(null);
  done();
});

it('should request a token', async done => {
  const token = await obtainToken('foo@bar', 'bar');
  expect(Api.request).toHaveBeenCalledWith('auth/obtain-token/', {
    method: 'POST',
    body: { email: 'foo@bar', password: 'bar' },
  });
  expect(token).toBe('newToken');
  expect(global.localStorage.getItem('tf:auth:token')).toBe('newToken');
  done();
});

it('should refresh token', async done => {
  global.localStorage.setItem('tf:auth:token', IMPERISHABLE_TOKEN);

  const token = await refreshToken();
  expect(Api.request).toHaveBeenCalledWith('auth/refresh-token/', {
    method: 'POST',
    body: { token: IMPERISHABLE_TOKEN },
  });
  expect(token).toBe('refreshedToken');
  global.localStorage.clear();
  done();
});

it('should get token', () => {
  global.localStorage.setItem('tf:auth:token', IMPERISHABLE_TOKEN);
  const token = getToken();
  expect(token).toBe(IMPERISHABLE_TOKEN);
  global.localStorage.clear();
});

it('should invalidate token', () => {
  global.localStorage.setItem('tf:auth:token', IMPERISHABLE_TOKEN);
  clearToken();
  expect(getToken()).toBeFalsy();
  global.localStorage.clear();
});

it('should parse token', () => {
  const data = getTokenPayload(MOCKED_TOKEN);
  expect(data).toEqual(MOCKED_PAYLOAD);
});

it('should parse an invalid token', () => {
  const data = getTokenPayload('foo');
  expect(data).toEqual({});
});

it('should create a token', () => {
  const properties = { foo: 'bar' };
  createToken(properties);
  expect(Api.request).toHaveBeenCalledWith('accounts/register/', {
    method: 'POST',
    body: { foo: 'bar' },
  });
});

it('should delete invalid token on refresh', async done => {
  global.localStorage.setItem('tf:auth:token', 'invalid');
  await refreshToken();
  expect(getToken()).not.toBeDefined();
  global.localStorage.clear();
  done();
});
