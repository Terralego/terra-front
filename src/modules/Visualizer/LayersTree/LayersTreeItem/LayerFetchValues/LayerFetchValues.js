import React from 'react';

export class LayerFetchValues extends React.Component {
  componentDidMount () {
    this.fetchValues();
  }

  componentDidUpdate ({ layer: prevLayer }) {
    const { layer } = this.props;

    if (layer !== prevLayer) {
      this.fetchValues();
    }
  }

  fetchValues () {
    const {
      layer: { filters: { layer, form = [] } = {} },
      fetchPropertiesValues,
    } = this.props;
    const properties = form.filter(property => property.fetchValues);
    if (properties.length) {
      fetchPropertiesValues(layer, properties);
    }
  }

  render () {
    return null;
  }
}

export default LayerFetchValues;
