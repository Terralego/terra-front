import settings from 'front-settings';
import { parseJSON } from 'helpers/fetchHelpers';
import tokenService from 'services/tokenService';
import { RECEIVE_TOKEN, SET_ERROR_MESSAGE } from 'modules/authentication';

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
  })
    // .then(checkStatus)
    .then(parseJSON);
}

function interceptTokenError (response) {
  let errorMessage = '';

  if (response.password) {
    errorMessage += 'Password : ' + response.password[0];
  }
  if (response.username) {
    errorMessage += 'Login : ' + response.username[0];
  }
  if (response.non_field_errors) {
    errorMessage += response.non_field_errors[0];
  }

  return errorMessage;
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
        const errors = interceptTokenError(response);
        console.log(errors);
        if (errors) {
          return next({
            error: errors,
            type: SET_ERROR_MESSAGE,
          });
        }

        tokenService.setToken(response.token);
        const user = parseJwt(response.token);
        return next({
          type: RECEIVE_TOKEN,
          user,
          isAuthenticated: !!response.token,
          receivedAt: Date.now(),
        });
      },
      error => next({
        error: error || 'There was an error.',
        type: SET_ERROR_MESSAGE,
      }),
    );
};
