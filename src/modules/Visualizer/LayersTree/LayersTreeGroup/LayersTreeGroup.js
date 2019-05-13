import React from 'react';
import { H5 } from '@blueprintjs/core';

import LayersTreeItem from '../LayersTreeItem';

export const LayersTreeGroup = ({
  title,
  layers,
}) => (
  <div className="layers-tree-group">
    <H5>{title}</H5>
    {layers.map(layer => (
      <LayersTreeItem
        key={layer.label}
        layer={layer}
      />
    ))}
  </div>
);

export default LayersTreeGroup;
