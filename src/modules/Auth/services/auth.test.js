import { obtainToken, refreshToken, getToken, invalidToken, parseToken } from './auth';
import Api from '../../Api';

const MOCKED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0Mn0sImV4cCI6MTUxNjIzOTAyMn0.mPABaxD6A5yFiIFWjNDFFEhtDsrtDPVsDKHCW6ljCNs';

jest.mock('../../Api', () => ({
  on: jest.fn(),
  request: jest.fn(endpoint => {
    if (endpoint === 'auth/obtain-token/') {
      return { token: 'newToken' };
    }

    if (endpoint === 'auth/refresh-token/') {
      return { token: 'refreshedToken' };
    }
    throw new Error('invalid endpoint');
  }),
  POST: 'POST',
}));

Date.now = () => 1539956249578;

it('should add a listener to Api', () => {
  expect(Api.on).toHaveBeenCalled();
});

it('should request a token', async done => {
  const token = await obtainToken('foo@bar', 'bar');
  expect(Api.request).toHaveBeenCalledWith('auth/obtain-token/', {
    method: 'POST',
    body: { email: 'foo@bar', password: 'bar' },
  });
  expect(token).toBe('newToken');
  expect(global.localStorage.getItem('tf:auth:token')).toBe('newToken');
  expect(Api.token).toBe('newToken');
  done();
});

it('should refresh token', async done => {
  global.localStorage.setItem('tf:auth:token', 'someToken');
  const token = await refreshToken();
  expect(Api.request).toHaveBeenCalledWith('auth/refresh-token/', {
    method: 'POST',
    body: { token: 'someToken' },
  });
  expect(token).toBe('refreshedToken');
  done();
});

it('should get token', () => {
  global.localStorage.setItem('tf:auth:token', 'storedToken');
  const token = getToken();
  expect(token).toBe('storedToken');
});

it('should invalid token', () => {
  global.localStorage.setItem('tf:auth:token', 'storedToken');
  invalidToken();
  expect(global.localStorage.getItem('tf:auth:token')).toBe(null);
  expect(Api.token).not.toBeDefined();
});

it('should parse token', () => {
  const data = parseToken(MOCKED_TOKEN);
  expect(data).toEqual({
    user: { id: 42 },
    exp: 1516239022,
  });
});
