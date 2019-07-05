import React from 'react';

import {
  Intent,
  Tooltip,
} from '@blueprintjs/core';

export const WarningZoom = props => {
  const { display, isActive, minZoomLayer, children } = props;

  if (!display || !isActive) return children;
  return (
    <Tooltip
      className="layerNode-tooltip-warning"
      content={(<span>Visible à partir du zoom {minZoomLayer}</span>)}
      intent={Intent.WARNING}
      usePortal={false}
    >
      {children}
    </Tooltip>
  );
};

export default WarningZoom;
