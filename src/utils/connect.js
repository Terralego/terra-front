import React from 'react';

import objectGet from './objectGet';

function parseMapContextToProps (mapContextToProps, context, props) {
  if (typeof mapContextToProps === 'function') {
    return mapContextToProps(context, props);
  }
  if (Array.isArray(mapContextToProps)) {
    return mapContextToProps.reduce((ret, prop) => ({
      ...ret,
      [prop]: context[prop],
    }), {});
  }
  if (typeof mapContextToProps === 'object') {
    return Object.keys(mapContextToProps).reduce((ret, prop) => ({
      ...ret,
      [prop]: objectGet(context, mapContextToProps[prop]),
    }), {});
  }

  return {};
}

export const connect = ({ Consumer }) => (...mapContextToPropsList) => WrappedComponent => {
  const mapContextToProps = mapContextToPropsList.length > 1
    ? mapContextToPropsList
    : mapContextToPropsList[0];

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
      const { props } = this.props;
      const state = parseMapContextToProps(mapContextToProps, context, props);
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
      return <WrappedComponent {...this.state} {...this.props.props} />;
    }
  }

  return props => <Consumer>{(value = {}) => <Connect context={value} props={props} />}</Consumer>;
};

export default connect;
