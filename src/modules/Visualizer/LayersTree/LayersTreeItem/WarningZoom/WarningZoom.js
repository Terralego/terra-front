import React from 'react';

import {
  Intent,
  Tooltip,
} from '@blueprintjs/core';
import translateMock from '../../../../../utils/translate';

export const WarningZoom = props => {
  const { display, isActive, minZoomLayer, children } = props;
  const translate = translateMock({
    'visualizer.layerstree.warningzoom.message': `Visible à partir du zoom ${minZoomLayer}`,
  });

  if (!display || !isActive) return children;
  return (
    <Tooltip
      className="layerNode-tooltip-warning"
      content={(<span>{translate('visualizer.layerstree.warningzoom.message')}</span>)}
      intent={Intent.WARNING}
      usePortal={false}
    >
      {children}
    </Tooltip>
  );
};

export default WarningZoom;
