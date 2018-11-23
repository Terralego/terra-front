import React from 'react';

import { Provider } from '../../services/context';

export class VisualizerProvider extends React.Component {
  state = {
    details: null,
  };

  setDetails = details => this.setState({ details });

  render () {
    const { children } = this.props;
    const { setDetails } = this;

    return (
      <Provider value={{ ...this.state, setDetails }}>
        {children}
      </Provider>
    );
  }
}

export default VisualizerProvider;
