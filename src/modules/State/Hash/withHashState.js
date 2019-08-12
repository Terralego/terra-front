import PropTypes from 'prop-types';
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
 */
export const withHashState = () => WrappedComponent =>
  class WithHashState extends React.Component {
    static propTypes = {
      listenHash: PropTypes.bool,
      updateHash: PropTypes.bool,
    };

    static defaultProps = {
      listenHash: true,
      updateHash: true,
    };

    options = DEFAULT_OPTIONS;

    constructor (props) {
      super(props);
      const { listenHash } = this.props;
      if (listenHash) {
        window.addEventListener('hashchange', this.forceUpdate, false);
      }
    }

    getCurrentHashString = state => `#${stringify(state, this.options)}`;

    updateHashString = state => {
      const { updateHash } = this.props;
      if (updateHash) {
        window.history.replaceState(window.history.state, '', `#${stringify(state, this.options)}`);
      }
    };


    render () {
      const { listenHash, updateHash, ...props } = this.props;
      const initialState = parse(window.location.hash, this.options);
      return (
        <WrappedComponent
          initialState={initialState}
          {...props}
          getCurrentHashString={this.getCurrentHashString}
          onStateChange={this.updateHashString}
        />
      );
    }
  };

export default withHashState;
