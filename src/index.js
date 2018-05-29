import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { setAuthentication, refreshToken } from 'modules/authentication';

import './index.css';
import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

if (module.hot) {
  module.hot.accept('./App', () => render(App));
}

// init the store with the localStorage / sessionStorage data
store.dispatch(setAuthentication());
// enabling refresh token if user already authenticated
store.getState().authentication.isAuthenticated && store.dispatch(refreshToken());

/**
 * Initial rendering
 */
render(App);

registerServiceWorker();
