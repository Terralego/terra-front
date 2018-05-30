import apiService from 'services/apiService';

export const CALL_API = Symbol('Call API');

export default () => next => action => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { endpoint, types, config } = callAPI;
  const [requestType, successType, errorType] = types;

  next({ type: requestType });

  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  return apiService.request(endpoint, config)
    .then(response =>
      next({ data: response.data, type: successType }))
    .catch(error =>
      next({ error: error.message || 'There was an error.', type: errorType }));
};
