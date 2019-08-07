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

    getHashParameters = () => {
      /**
       * Returns the entries hash included in parameters.
       *
       * @return object
       */
      const params = parse(window.location.hash, this.options);
      return Object.entries(params).reduce((obj, [key, value]) => {
        const newObj = obj;
        if (this.parameters.includes(key)) {
          newObj[key] = value;
        }
        return newObj;
      }, {});
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
      const params = parse(window.location.hash, this.options);

      // Filter hash values on parameters
      const newParams = {
        ...params,
        ...values,
      };

      // Rebuild string and set hash
      window.history.replaceState(window.history.state, '', `#${stringify(newParams, this.options)}`);
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
