import React from 'react';
import connect from 'react-ctx-connect';

export const context = React.createContext();

const { Provider } = context;

export const TerraFrontProvider = ({ children, config }) => (
  <Provider value={config}>
    {children}
  </Provider>
);

export const connectTerraFrontProvider = connect(context);

export default TerraFrontProvider;
