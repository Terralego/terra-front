import React from 'react';
import { Card, Switch, Elevation } from '@blueprintjs/core';

import './styles.scss';

const activedStyle = isActive => (
  isActive === true ? { opacity: 1 } : { opacity: 0.7 }
);

const LayerNode = ({ label, activityChange, isActive }) => (
  <Card
    className="dataLayerContainer"
    elevation={Elevation.TWO}
    style={activedStyle(isActive)}
  >
    <Switch
      checked={isActive}
      label={label}
      onChange={activityChange}
    />
  </Card>
);

export default LayerNode;
