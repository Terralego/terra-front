import * as PropTypes from 'prop-types';
import React from 'react';
import context from './context';

const { Provider } = context;

export class StateProvider extends React.Component {
  static propTypes = {
    onStateChange: PropTypes.func,
  };

  static defaultProps = {
    onStateChange () {},
  };

  componentWillMount () {
    const { initialState } = this.props;
    this.setState(initialState);
  }

  setCurrentState = state => {
    const { onStateChange } = this.props;
    this.setState(state, () => onStateChange(this.state));
  };

  render () {
    const { children } = this.props;
    return (
      <Provider value={{
        initialState: this.state,
        setCurrentState: this.setCurrentState,
      }}
      >
        {children}
      </Provider>
    );
  }
}

export default StateProvider;
