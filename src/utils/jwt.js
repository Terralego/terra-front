import b64u from 'base64url';

/**
 * Returns decoded JWT token payload
 */
export const getTokenPayload = token => {
  if (!token) {
    return {};
  }

  const [, payload = ''] = token.split('.');
  const base64url = payload.replace('-', '+').replace('_', '/');

  try {
    return JSON.parse(b64u.decode(base64url));
  } catch (e) {
    return {};
  }
};

/**
 * Return wether given JWT token is still valid
 */
export const checkTokenValidity = token => {
  if (!token) {
    return null;
  }

  const { exp } = getTokenPayload(token);
  const hasExpired = Date.now() >= (exp * 1000);

  if (!exp || hasExpired) {
    return false;
  }

  return true;
};
