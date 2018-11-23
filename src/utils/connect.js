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
  const mapContextToProps = (mapContextToPropsList.length > 1 || typeof mapContextToPropsList[0] === 'string')
    ? mapContextToPropsList
    : mapContextToPropsList[0];

  class Connect extends React.Component {
    constructor (props) {
      super(props);

      this.state = {};
      this.state = this.getNewState(props.context, props.props);
    }

    shouldComponentUpdate ({ context }) {
      return !!this.getNewState(context, this.props.props);
    }

    componentDidUpdate ({ context: prevContext }) {
      if (this.props.context !== prevContext) {
        this.updateFromContext();
      }
    }

    getNewState (context, props) {
      const state = parseMapContextToProps(mapContextToProps, context, props);
      const hasChanged = Object.keys(state).reduce((changed, key) =>
        changed || state[key] !== this.state[key], false);
      return hasChanged ? state : false;
    }

    updateFromContext () {
      const { context, props } = this.props;
      const state = this.getNewState(context, props);

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
