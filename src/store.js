import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import apiService, { SIGNATURE_HAS_EXPIRED } from 'services/apiService';
import api from 'middlewares/api';
import { resetToken } from 'modules/authentication';
import { disableTimerRefreshToken } from 'modules/authenticationTimer';
import rootReducer from 'root-reducer';

export const history = createHistory();

const enhancers = [];
const middleware = [
  thunk,
  api,
];

/**
 * Add dev tools extension to enhancers
 * only if available in `window` scope
 * and if current ENV `is development`
 */
if (process.env.NODE_ENV === 'development') {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

/**
 * Compose the enhancers
 */
const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
);

export const store = createStore(
  rootReducer,
  composedEnhancers,
);

/**
 * Handler for API
 * Useful to redirect on login page if a 403 is detected
 */
apiService.setErrorHandler(error => {
  if (error.response
    && (error.response.status === 401 || error.response.status === 403)
    && error.response.data
    && ((error.response.data.detail && error.response.data.detail === SIGNATURE_HAS_EXPIRED) ||
      (error.response.data.non_field_errors
        && error.response.data.non_field_errors[0] === SIGNATURE_HAS_EXPIRED))
  ) {
    store.dispatch(resetToken());
    store.dispatch(disableTimerRefreshToken());
    // window.location = '#/login';
  } else if (!(
    error.response
    && error.response.request
    && error.response.request.responseURL
    && (
      error.response.request.responseURL.indexOf('login') > -1
    )
  )) {
    // store.dispatch(setError(error.message));
  } else {
    // console.warn('Nothing to be done for this error... Too bad.');
  }
});

export default store;
