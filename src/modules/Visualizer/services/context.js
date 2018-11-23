import React from 'react';

import connect from '../../../utils/connect';

const context = React.createContext();
export const { Provider, Consumer } = context;

export const connectVisualizerProvider = connect(context);

export default context;
