import React from 'react';
import { H4 } from '@blueprintjs/core';

import LayersTreeItem from '../LayersTreeItem';

export const LayersTreeGroup = ({ title, layers }) => (
  <div className="layers-tree-group">
    <H4>{title}</H4>
    {layers.map(layer => (
      <LayersTreeItem
        key={layer.label}
        layer={layer}
      />
    ))}
  </div>
);

export default LayersTreeGroup;
