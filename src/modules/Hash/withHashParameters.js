import React from 'react';

/**
 * HOC for getting and updating values from location hash.
 *
 * @param parameters string|string[]
 *   A list of parameters names to set and get from hash.
 */
export const withHashParameters = (...parameters) => WrappedComponent =>
  class WithHashParameters extends React.Component {
    constructor (props) {
      super(props);
      // Normalize parameters from possible string to array
      this.parameters = parameters.values().length > 1 ? parameters :
        (typeof parameters[0] === 'string' && parameters[0].split(','));
    }

    getHashParameters = () => {
      /**
       * Returns the entries hash included in parameters.
       *
       * @return object
       */
      const params = new URLSearchParams(window.location.hash.slice(1));
      return Object.fromEntries(Array.from(params.entries()).filter(
        pair => this.parameters.includes(pair[0]),
      ));
    };

    setHashParameters = values => {
      /**
       * Update the hash with values object, filtered by parameters
       *
       * If the values does not contain a parameter name, it will be removed
       * from hash
       *
       * @return object
       */
      const mapping = typeof values === 'object' || {};
      const params = new URLSearchParams(window.location.hash.slice(1));

      // Filter hash values on parameters
      this.parameters.forEach(hashPart => {
        if (typeof mapping[hashPart] === 'undefined') {
          params.delete(hashPart);
        } else {
          params.set(hashPart, mapping[hashPart]);
        }
      });

      // Rebuild string and set hash
      let hash = '#';
      const components = [];
      params.forEach((value, key) => {
        components.push(`${key}=${value}`);
      });
      hash += components.join('&');
      window.history.replaceState(window.history.state, '', hash);
    };

    render () {
      const { ...props } = this.props;
      const { setHashParameters, getHashParameters } = this;

      return (
        <WrappedComponent
          {...props}
          getHashParameters={getHashParameters}
          setHashParameters={setHashParameters}
        />
      );
    }
  };

export default withHashParameters;
