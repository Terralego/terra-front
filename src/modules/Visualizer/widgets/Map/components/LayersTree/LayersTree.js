import React, { Component } from 'react';
import { Card, H4 } from '@blueprintjs/core';

import layersTreeProps from '../../LayersTreeProps';
import LayerNode from './LayerNode';
import './styles.scss';

class LayersTree extends Component {

  static propTypes = layersTreeProps;
  static defaultProps = {
    title: 'Couches cartographiques',
    label: '',
    active: {},
    inactive: {},
  };

  onToggleChange = layer => () => {
    const { onChange } = this.props;
    const styleToApply = layer.isActive ? layer.inactive : layer.active;
    layer.isActive = !layer.isActive;
    onChange(styleToApply);
  }

  render () {
    const { layersTree, title } = this.props;
    return (
      <Card
        className="layerstree-panel-container bp3-dark"
      >
        <H4>{title}</H4>
        { layersTree.map(layer => (
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
