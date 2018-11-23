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

  onToggleChange = layer => () => {
    const { onChange } = this.props;
    const styleToApply = layer.isActive ? layer.inactive : layer.active;
    layer.isActive = !layer.isActive; // eslint-disable-line
    onChange(styleToApply);
  }

  render () {
    const { render: Render, layersTree, title } = this.props;
    const { onToggleChange } = this;
    const props = {
      layersTree,
      title,
      onToggleChange,
    };

    return <Render {...props} />;
  }
}

export default LayersTree;
