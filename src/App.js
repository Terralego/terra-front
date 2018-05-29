import React from 'react';

import {
  LocaleProvider,
} from 'antd';

import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';

import Main from 'components/Main/Main';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';

const AppWrapper = () => (
  <LocaleProvider locale={fr}>
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  </LocaleProvider>
);

export default AppWrapper;
