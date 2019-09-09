import React from 'react';

import {
  Intent,
} from '@blueprintjs/core';
import translateMock from '../../../../../utils/translate';
import Tooltip from '../../../../../components/Tooltip';


export const WarningZoom = props => {
  const {
    display,
    isActive,
    minZoomLayer,
    children,
    translate = translateMock({
      'terralego.visualizer.layerstree.warningzoom.message': 'Visible from zoom {{minzoom}}',
    }),
  } = props;

  if (!display || !isActive) return children;
  return (
    <Tooltip
      className="layerstree-node-content__item-tooltip-warning"
      content={(<span>{translate('terralego.visualizer.layerstree.warningzoom.message', { minzoom: minZoomLayer })}</span>)}
      intent={Intent.WARNING}
      usePortal={false}
    >
      {children}
    </Tooltip>
  );
};

export default WarningZoom;
