import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, H4 } from '@blueprintjs/core';

import layersTreeProps from '../../LayersTreeProps';
import LayerNode from './LayerNode';
import './styles.scss';

export class LayersTree extends Component {
  static propTypes = {
    layersTree: layersTreeProps.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Couches cartographiques',
  };

  onToggleChange = layer => () => {
    const { onChange } = this.props;
    const styleToApply = layer.isActive ? layer.inactive : layer.active;
    layer.isActive = !layer.isActive; // eslint-disable-line
    onChange(styleToApply);
  }

  render () {
    const { layersTree, title } = this.props;
    return (
      <Card
        className="layerstree-panel-container bp3-dark"
      >
        <H4>{title}</H4>
        {layersTree.map(layer => (
          <LayerNode
            label={layer.label}
            onToggleChange={this.onToggleChange(layer)}
            isActive={layer.isActive}
          />
        ))}
      </Card>
    );
  }
}

export default LayersTree;
