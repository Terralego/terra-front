import PropTypes from 'prop-types';
import { stringify, parse } from 'query-string';
import React from 'react';

/**
 * Default options for reading and writing from hash.
 */
export const DEFAULT_OPTIONS = {
  encode: false,
  arrayFormat: 'comma',
  sort: false,
  parseNumbers: true,
  parseBooleans: true,
};


const getCurrentHashState = () => parse(window.location.hash, DEFAULT_OPTIONS);

const getCurrentHashString = state => `#${stringify(state, DEFAULT_OPTIONS)}`;

/**
 * Decorator for getting an initialState from hash.
 */
export const withHashState = WrappedComponent => {
  class WithHashState extends React.Component {
    static propTypes = {
      /** @param {boolean} [listenHash=true] If initialState should be update when hash changes */
      listenHash: PropTypes.bool,
      /** @param {boolean} [updateHash=true] If hash should be updated when initialState changes */
      updateHash: PropTypes.bool,
    };

    static defaultProps = {
      listenHash: true,
      updateHash: true,
    };

    state = {
      initialState: getCurrentHashState(),
    }

    // To keep compatibility
    getCurrentHashString = getCurrentHashString;

    componentDidMount () {
      const { listenHash } = this.props;
      const { initialState } = this.state;

      if (listenHash) {
        window.addEventListener('hashchange', this.onHashChange, false);
      }

      this.setState({ forceFitBounds: !Object.keys(initialState).length });
    }

    componentWillUnmount () {
      this.isUnmount = true;
      window.removeEventListener('hashchange', this.onHashChange, false);
      document.addEventListener('DOMContentLoaded', this.forceFitBounds);
    }

    /**
     * Event listener on hash change, reloads the current state from hash
     */
    onHashChange = () => {
      if (!this.isUnmount) {
        this.setState({ initialState: getCurrentHashState() });
      }
    };

    /**
     * Callback when the state is changed, replace hash with current state
     *
     * @param state
     * @see StateProvider
     */
    updateHashString = state => {
      const { updateHash } = this.props;
      if (updateHash) {
        window.history.replaceState(window.history.state, '', getCurrentHashString(state));
      }
    };

    setForceFitBounds = forceFitBounds => this.setState({ forceFitBounds });

    render () {
      const { listenHash, updateHash, ...props } = this.props;
      const { initialState, forceFitBounds } = this.state;
      return (
        <WrappedComponent
          initialState={initialState}
          forceFitBounds={forceFitBounds}
          setForceFitBounds={this.setForceFitBounds}
          {...props}
          getCurrentHashString={getCurrentHashString}
          onStateChange={this.updateHashString}
        />
      );
    }
  }

  const name = WrappedComponent.displayName || WrappedComponent.name;
  WithHashState.displayName = `withHashState(${name})`;
  return WithHashState;
};

export default withHashState;
