import React from 'react';
import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE } from '../../../../Forms/Filters';

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
    } = this.props;
    form.forEach(property => {
      const { type } = property;
      switch (type) {
        case TYPE_SINGLE:
        case TYPE_MANY:
          return this.fetchEnum(layer, property);
        case TYPE_RANGE:
        default:
          return this.fetchRange(layer, property);
      }
    });
  }

  fetchEnum (layer, property) {
    const {
      fetchPropertyValues,
    } = this.props;
    if (!property.fetchValues || property.values) return;
    fetchPropertyValues(layer, property);
  }

  fetchRange (layer, property) {
    const {
      fetchPropertyRange,
    } = this.props;
    if (!property.fetchValues || property.min !== undefined) return;
    fetchPropertyRange(layer, property);
  }

  render () {
    return null;
  }
}

export default LayerFetchValues;
