import React from 'react';
import { Card, H4 } from '@blueprintjs/core';

import LayerNode from './LayerNode';

import './styles.scss';

export const LayersTreeRenderer = ({
  layersTree,
  onToggleChange,
  isActive,
  LayersTree,
  onChange,
  getOpacity,
  onOpacityChange,
}) => (
  <Card
    className="layerstree-panel-container bp3-dark"
  >
    {layersTree.map(layer => (layer.group
      ? (
        <div key={layer.group}>
          <H4>{layer.group}</H4>
          <LayersTree layersTree={layer.layers} onChange={onChange} />
        </div>
      )
      : (
        <LayerNode
          key={layer.label}
          label={layer.label}
          onToggleChange={onToggleChange(layer)}
          isActive={isActive(layer)}
          opacity={getOpacity(layer)}
          onOpacityChange={onOpacityChange(layer)}
        />
      )))}
  </Card>
);

export default LayersTreeRenderer;
