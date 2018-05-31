import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import api from 'middlewares/api';
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

export default store;
