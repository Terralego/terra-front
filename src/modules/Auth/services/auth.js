import Api, { POST, EVENT_FAILURE } from '../../Api';
import log from './log';

const TOKEN_KEY = 'tf:auth:token';
const ENDPOINT_OBTAIN_TOKEN = 'auth/obtain-token/';
const ENDPOINT_REFRESH_TOKEN = 'auth/refresh-token/';

export async function obtainToken (email, password) {
  log('auth request start');
  const { token } = await Api.request(ENDPOINT_OBTAIN_TOKEN, {
    method: POST,
    body: { email, password },
  });

  Api.token = token;
  global.localStorage.setItem(TOKEN_KEY, token);

  return token;
}

export function getToken () {
  return global.localStorage.getItem(TOKEN_KEY);
}

export async function refreshToken () {
  const currentToken = getToken();
  const { token } = await Api.request(ENDPOINT_REFRESH_TOKEN, {
    method: POST,
    body: { token: currentToken },
  });
  return token;
}

export function invalidToken () {
  global.localStorage.removeItem(TOKEN_KEY);
  delete Api.token;
}

export function parseToken (token) {
  const [, payload = ''] = token.split('.');
  const base64 = payload.replace('-', '+').replace('_', '/');

  try {
    return JSON.parse(atob(base64));
  } catch (e) {
    return {};
  }
}

Api.token = global.localStorage.getItem(TOKEN_KEY);

Api.on(EVENT_FAILURE, response => {
  if (response.status === 401) {
    invalidToken();
  }
});