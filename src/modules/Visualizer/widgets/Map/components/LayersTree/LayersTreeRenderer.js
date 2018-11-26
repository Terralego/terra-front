import React from 'react';
import { Card, H4 } from '@blueprintjs/core';

import LayerNode from './LayerNode';

import './styles.scss';

export const LayersTreeRenderer = ({ title, layersTree, onToggleChange }) => (
  <Card
    className="layerstree-panel-container bp3-dark"
  >
    <H4>{title}</H4>
    {layersTree.map(layer => (
      <LayerNode
        key={layer.label}
        label={layer.label}
        onToggleChange={onToggleChange(layer)}
        isActive={layer.isActive}
      />
    ))}
  </Card>
);

export default LayersTreeRenderer;
