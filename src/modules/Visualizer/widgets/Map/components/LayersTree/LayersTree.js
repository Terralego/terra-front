import React from 'react';
import { Button, Card, Classes, Tooltip } from '@blueprintjs/core';

import LayersTreeGroup from './LayersTreeGroup';
import LayersTreeItem from './LayersTreeItem';

import './styles.scss';

export const LayersTree = ({ layersTree, onToggle, toggleLabel }) => (
  <Card
    className={`layerstree-panel-container ${Classes.DARK}`}
  >
    <Tooltip
      content={toggleLabel}
    >
      <Button
        className="layerstree-panel-button"
        onClick={onToggle}
        icon="arrow-right"
        minimal
      />
    </Tooltip>
    <div className="layerstree-panel-list">
      {layersTree.map(layer => (layer.group
        ? (
          <LayersTreeGroup
            key={layer.group}
            title={layer.group}
            layers={layer.layers}
          />
        )
        : (
          <LayersTreeItem
            key={layer.label}
            layer={layer}
          />
        )
      ))}
    </div>
  </Card>
);
LayersTree.defaultProps = {
  onToggle () {},
};
export default LayersTree;
