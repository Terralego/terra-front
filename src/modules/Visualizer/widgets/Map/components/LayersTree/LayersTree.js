import React, { Component } from 'react';
import { Card, H4 } from '@blueprintjs/core';

import layersTreeProps from '../../LayersTreeProps';
import LayerNode from './LayerNode';
import './styles.scss';

class LayersTree extends Component {

  static propTypes = layersTreeProps;
  static defaultProps = { layersTreeProps };

  activityChange = layer => () => {
    const { onChange } = this.props;
    const styleToApply = layer.isActive ? layer.active : layer.inactive;
    layer.isActive = !layer.isActive;
    onChange(styleToApply);
  }

  render () {
    const { layersTree } = this.props;

    return (
      <Card
        className="layersTreePanelContainer bp3-dark"
      >
        <H4>Couches cartographique</H4>
        { layersTree.map(layer => (
          <LayerNode
            label={layer.label}
            activityChange={this.activityChange(layer)}
            isActive={layer.isActive}
          />
      ))}
      </Card>
    );
  }
}

export default LayersTree;
