import settings from 'front-settings';

function callApi (endpoint, authenticated, config) {
  const token = localStorage.getItem('token') || null;
  let options = { ...config };

  if (authenticated) {
    if (token) {
      options = { headers: { Authorization: `JWT ${token}` } };
    } else {
      throw new Error('No token saved!');
    }
  }

  return fetch(settings.api_url + endpoint, options).then(response => response.json());
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
