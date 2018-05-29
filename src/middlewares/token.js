import settings from 'front-settings';
import tokenService from 'services/tokenService';
import { REQUEST_TOKEN, RECEIVE_TOKEN, SET_ERROR_MESSAGE } from 'modules/authentication';

/**
 * Deserialize JSON Web Token
 * @param  {string} token
 */
function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

/**
 * Fetch JWT (new or refreshed)
 * @param  {string} endpoint
 * @param  {data} body
 */
function tokenApi (endpoint, body) {
  return fetch(settings.api_url + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(response => response.json());
}

export const TOKEN_API = Symbol('Token API');

export default () => next => action => {
  const tokenAction = action[TOKEN_API];

  // So the middleware doesn't get applied to every single action
  if (typeof tokenAction === 'undefined') {
    return next(action);
  }

  const { endpoint, type, body } = tokenAction;
  next({ type });

  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  return tokenApi(endpoint, body)
    .then(
      response => {
        tokenService.setToken(response.token);
        return next({
          type: RECEIVE_TOKEN,
          response,
          isAuthenticated: !!response.token,
          receivedAt: Date.now(),
        });
      },
      error => next({
        error: error.message || 'There was an error.',
        type: SET_ERROR_MESSAGE,
      }),
    );
};
