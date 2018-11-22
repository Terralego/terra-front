import React from 'react';
import { Card, Switch, Elevation } from '@blueprintjs/core';

import './styles.scss';

const LayerNode = ({ label, onToggleChange, isActive }) => (
  <Card
    className="layerNode-container"
    elevation={Elevation.TWO}
    style={{ opacity: isActive ? 1 : 0.7 }}
  >
    <Switch
      checked={isActive}
      label={label}
      onChange={onToggleChange}
    />
  </Card>
);

export default LayerNode;
