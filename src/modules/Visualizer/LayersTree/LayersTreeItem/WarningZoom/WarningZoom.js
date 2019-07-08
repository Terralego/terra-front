import React from 'react';

import {
  Intent,
  Tooltip,
} from '@blueprintjs/core';
import translateMock from '../../../../../utils/translate';

export const WarningZoom = props => {
  const {
    display,
    isActive,
    minZoomLayer,
    children,
    translate = translateMock({
      'visualizer.layerstree.warningzoom.message': 'Visible from zoom {{minzoom}}',
    }),
  } = props;

  if (!display || !isActive) return children;
  return (
    <Tooltip
      className="layerNode-tooltip-warning"
      content={(<span>{translate('visualizer.layerstree.warningzoom.message', { minzoom: minZoomLayer })}</span>)}
      intent={Intent.WARNING}
      usePortal={false}
    >
      {children}
    </Tooltip>
  );
};

export default WarningZoom;
