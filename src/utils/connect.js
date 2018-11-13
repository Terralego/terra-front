import React from 'react';

export const connect = ({ Consumer }) => mapContextToProps => WrappedComponent => {
  class Connect extends React.Component {
    state = {};

    componentDidMount () {
      this.updateFromContext();
    }

    shouldComponentUpdate ({ context }) {
      return !!this.getNewState(context);
    }

    componentDidUpdate ({ context: prevContext }) {
      if (this.props.context !== prevContext) {
        this.updateFromContext();
      }
    }

    getNewState (context) {
      const state = mapContextToProps(context);
      const hasChanged = Object.keys(state).reduce((changed, key) =>
        changed || state[key] !== this.state[key], false);
      return hasChanged ? state : false;
    }

    updateFromContext () {
      const state = this.getNewState(this.props.context);

      if (state) {
        this.setState(state);
      }
    }

    render () {
      const { context, ...props } = this.props;
      return <WrappedComponent {...this.state} {...props} />;
    }
  }

  return props => <Consumer>{(value = {}) => <Connect context={value} {...props} />}</Consumer>;
}

export default connect;
