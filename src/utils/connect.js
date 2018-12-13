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
      ...(prop === '*'
        ? objectGet(context, mapContextToProps[prop])
        : { [prop]: objectGet(context, mapContextToProps[prop]) }),
    }), {});
  }

  return {};
}

export const connect = ({ Consumer }) => (...mapContextToPropsList) => WrappedComponent => {
  const mapContextToProps = (mapContextToPropsList.length > 1 || typeof mapContextToPropsList[0] === 'string')
    ? mapContextToPropsList
    : mapContextToPropsList[0];

  class Connect extends React.Component {
    static defaultProps = {
      context: {},
    }

    constructor (props) {
      super(props);

      this.state = {};
      this.state = this.getNewState(props.context, props.props);
    }

    shouldComponentUpdate ({ context, props: newProps }) {
      const { props } = this.props;
      return newProps !== props || !!this.getNewState(context, props);
    }

    componentDidUpdate ({ context: prevContext }) {
      const { context } = this.props;
      if (context !== prevContext) {
        this.updateFromContext();
      }
    }

    getNewState (context, props) {
      const { state } = this;
      const newState = parseMapContextToProps(mapContextToProps, context, props);
      const hasChanged = Object.keys(newState).reduce((changed, key) =>
        changed || newState[key] !== state[key], false);
      return hasChanged ? newState : false;
    }

    updateFromContext () {
      const { context, props } = this.props;
      const state = this.getNewState(context, props);
      if (state) {
        this.setState(state);
      }
    }

    render () {
      const { state, props: { props } } = this;
      return <WrappedComponent {...state} {...props} />;
    }
  }

  return props => <Consumer>{value => <Connect context={value} props={props} />}</Consumer>;
};

export default connect;
