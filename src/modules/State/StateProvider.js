import PropTypes from 'prop-types';
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

  // eslint-disable-next-line react/destructuring-assignment
  state = this.props.initialState;

  setCurrentState = state => {
    const { onStateChange } = this.props;
    this.setState(state, () => onStateChange(this.state));
  };

  render () {
    const { children, forceFitBounds, setForceFitBounds } = this.props;
    return (
      <Provider value={{
        initialState: this.state,
        setCurrentState: this.setCurrentState,
        forceFitBounds,
        setForceFitBounds,
      }}
      >
        {children}
      </Provider>
    );
  }
}

export default StateProvider;
