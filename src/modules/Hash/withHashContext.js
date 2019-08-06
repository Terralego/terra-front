import React from 'react';

/**
 * HOC for getting values and updating from location hash.
 *
 * @param hashDef string|string[] A list of keys to set and get from hash
 */
export const withHashContext = hashDef => WrappedComponent =>
  class WithDeviceSize extends React.Component {
    constructor (props) {
      super(props);
      this.hashParts = Array.isArray(hashDef) ? hashDef : [hashDef];
    }

    getHashContext = () => {
      /**
       * Returns the entries hash included in hashDef.
       *
       * @return object
       */
      const params = new URLSearchParams(window.location.hash.slice(1));
      return Object.fromEntries(Array.from(params.entries()).filter(
        pair => this.hashParts.includes(pair[0]),
      ));
    };

    setHashContext = values => {
      /**
       * Update the hash with values, filtered by hashDef
       */
      const mapping = values || {};
      const params = new URLSearchParams(window.location.hash.slice(1));
      this.hashParts.forEach(hashPart => {
        if (typeof mapping[hashPart] === 'undefined') {
          params.delete(hashPart);
        } else {
          params.set(hashPart, mapping[hashPart]);
        }
      });
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
      const { setHashContext, getHashContext } = this;

      return (
        <WrappedComponent
          {...props}
          getHashContext={getHashContext}
          setHashContext={setHashContext}
        />
      );
    }
  };

export default withHashContext;
