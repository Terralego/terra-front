import React, { Component } from 'react';
import PropTypes from 'prop-types';

import layersTreePropsTypes from '../../../../propTypes/LayersTreePropTypes';
import LayersTreeRenderer from './LayersTreeRenderer';

export class LayersTree extends Component {
  static propTypes = {
    layersTree: layersTreePropsTypes.isRequired,
    title: PropTypes.string,
    render: PropTypes.func,
  };

  static defaultProps = {
    title: 'Couches cartographiques',
    render: LayersTreeRenderer,
  };

  state = {
    areActives: new Set(this.props.layersTree
      .map(layer => ((layer.initialState || {}).active ? layer : null))
      .filter(a => a)),
  };

  onToggleChange = layer => () => {
    const { onChange } = this.props;
    const { areActives } = this.state;
    const isActive = areActives.has(layer);
    const styleToApply = isActive ? layer.inactive : layer.active;
    if (isActive) {
      areActives.delete(layer);
    } else {
      areActives.add(layer);
    }
    this.setState({ areActives: new Set(areActives) });
    onChange(styleToApply);
  }

  isActive = layer => {
    const areActives = new Set(this.state.areActives);
    return areActives.has(layer);
  }

  render () {
    const { render: Render, layersTree, title } = this.props;
    const { onToggleChange, isActive } = this;
    const props = {
      layersTree,
      title,
      onToggleChange,
      isActive,
    };

    return <Render {...props} />;
  }
}

export default LayersTree;
