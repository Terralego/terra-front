import settings from 'front-settings';
import { checkStatus, parseJSON } from 'helpers/fetchHelpers';
import tokenService from 'services/tokenService';

function callApi (endpoint, authenticated, config) {
  const token = tokenService.getToken();

  return fetch(settings.api_url + endpoint, {
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    ...config,
  })
    .then(checkStatus)
    .then(parseJSON);
}

export const CALL_API = Symbol('Call API');

export default () => next => action => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { endpoint, types, authenticated, config } = callAPI;
  const [requestType, successType, errorType] = types;

  next({ type: requestType });

  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  return callApi(endpoint, authenticated, config)
    .then(
      response => next({ response, authenticated, type: successType }),
      error => next({ error: error.message || 'There was an error.', type: errorType }),
    );
};
