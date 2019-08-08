import { stringify, parse } from 'query-string';
import React from 'react';


export const DEFAULT_OPTIONS = {
  encode: false,
  arrayFormat: 'comma',
  sort: false,
  parseNumbers: true,
  parseBooleans: true,
};

/**
 * Decorator for getting an initialState from hash.
 *
 * @param {bool} updateHash Update the hash when onStateChange is called
 * @param {bool} listenHash Reload initialSate when hash is changed
 */
export const withHashState = ({ updateHash, listenHash } = {}) => WrappedComponent =>
  class WithHashState extends React.Component {
    options = DEFAULT_OPTIONS;

    constructor (props) {
      super(props);
      if (listenHash) {
        window.addEventListener('hashchange', this.forceUpdate, false);
      }
    }

    getCurrentHashString = state => `#${stringify(state, this.options)}`;

    updateHashString = state => {
      if (updateHash) {
        window.history.replaceState(window.history.state, '', `#${stringify(state, this.options)}`);
      }
    };


    render () {
      const initialState = parse(window.location.hash, this.options);
      return (
        <WrappedComponent
          initialState={initialState}
          {...this.props}
          getCurrentHashString={this.getCurrentHashString}
          onStateChange={this.updateHashString}
        />
      );
    }
  };

export default withHashState;
