import React from 'react';

import connect from '../../utils/connect';

export const context = React.createContext();

const { Provider } = context;

export const AuthModuleProvider = ({ children, config }) => (
  <Provider value={config}>
    {children}
  </Provider>
);

export const connectModuleProvider = connect(context);

export default AuthModuleProvider;
