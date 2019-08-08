import React from 'react';
import { parse, stringify } from 'query-string';

/**
 * HOC for getting and updating values from location hash.
 *
 * @param parameters string|string[]
 *   A list of parameters names to set and get from hash.
 */
export const withHashParameters = (...parameters) => WrappedComponent =>
  class WithHashParameters extends React.Component {
    options = {
      encode: false,
      arrayFormat: 'comma',
      sort: false,
      parseNumbers: true,
      parseBooleans: true,
    };

    constructor (props) {
      super(props);
      // Normalize parameters from possible string to array
      this.parameters = parameters.length > 1 ? parameters :
        (typeof parameters[0] === 'string' && parameters[0].split(',')) || parameters[0];
    }

    /**
     * Return a filtered object with keys from `this.parameters`
     *
     * @param {{}} values
     * @return {{}}
     */
    getFilteredParams (values) {
      return Object.entries(values).reduce((obj, [key, value]) => {
        const newObj = obj;
        if (this.parameters.includes(key)) {
          newObj[key] = value;
        }
        return newObj;
      }, {});
    }

    /**
     * Returns the filtered entries from hash.
     *
     * @return {{}}
     */
    getHashParameters = () => {
      const params = parse(window.location.hash, this.options);
      return this.getFilteredParams(params);
    };

    /**
     * Update the hash with values object, filtered by parameters
     *
     * If the values does not contain a parameter name or prameter is null,
     * it will be removed from hash.
     *
     * @param {{}} values
     * @return void
     */
    setHashParameters = values => {
      // Filter hash values on parameters
      const params = {
        ...parse(window.location.hash, this.options),
        ...this.getFilteredParams(values),
      };

      // Rebuild string and set hash
      window.history.replaceState(window.history.state, '', `#${stringify(params, this.options)}`);
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
