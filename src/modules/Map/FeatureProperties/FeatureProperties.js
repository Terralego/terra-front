import React from 'react';

import log from '../services/log';
import fetchFeatures from './fetchFeatures';

export class FeatureProperties extends React.Component {
  constructor (props) {
    super(props);
    const { properties } = props;
    this.state = { properties };
  }

  componentDidMount () {
    const { id, url } = this.props;
    if (id && url) {
      this.fetchProperties();
    }
  }

  componentDidUpdate ({ properties: prevProperties }) {
    const { properties } = this.props;
    if (properties !== prevProperties) {
      this.fetchProperties();
    }
  }

  async fetchProperties () {
    const { id, url, properties = {} } = this.props;

    if (!properties) return;

    this.setState({
      properties: {
        ...properties,
        loading: true,
      },
    });

    const idValue = properties[id];

    if (!idValue) {
      log(`no id "${id}" found in`, properties);
      this.setState({
        properties: {
          ...properties,
          loading: false,
        },
      });
      return;
    }

    const fetchUrl = url.replace('{{id}}', idValue);

    try {
      const allProperties = await fetchFeatures(fetchUrl);
      this.setState({
        properties: {
          ...properties,
          ...allProperties,
          loading: false,
        },
      });
    } catch (error) {
      log(`Cannot fetch ${fetchUrl}`, error);
      this.setState({
        properties: {
          ...properties,
          loading: false,
          error,
        },
      });
    }
  }

  render () {
    const { children } = this.props;
    const { properties } = this.state;

    return children(properties);
  }
}

export default FeatureProperties;
