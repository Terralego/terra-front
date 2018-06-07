import apiService from 'services/apiService';
import { actions } from 'react-redux-form';

export const CALL_API = Symbol('Call API');

export default () => next => action => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { endpoint, types, config, form } = callAPI;
  const [requestType, successType, errorType] = types;

  next({ type: requestType });
  if (form) {
    next(actions.setPending(form, true));
  }
  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  return apiService.request(endpoint, config)
    .then(response => {
      next({ data: response.data, type: successType });
      if (form) {
        next(actions.setPending(form, false));
        next(actions.setSubmitted(form, true));
      }
    })
    .catch(error => {
      next({ error: error.message || 'There was an error.', type: errorType });
      if (form) {
        next(actions.setPending(form, false));
        next(actions.setSubmitFailed(form));
      }
    });
};
