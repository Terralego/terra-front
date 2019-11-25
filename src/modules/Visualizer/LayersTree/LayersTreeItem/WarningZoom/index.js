import React from 'react';
import compose from '../../../../../utils/compose';
import { processWarningAccordingToZoom } from '../../../services/warningZoom';
import WarningZoom from './WarningZoom';
import { connectLayersTree } from '../../LayersTreeProvider/context';

const withWarningAccordingToZoom = WrappedComponent => props => {
  const { map, layer, isActive, children } = props;
  if (!isActive) return children;
  const { showWarning, minZoomLayer } = processWarningAccordingToZoom(map, layer);
  return (
    <WrappedComponent display={showWarning} minZoomLayer={minZoomLayer} {...props}>
      {children}
    </WrappedComponent>
  );
};

export default compose(
  withWarningAccordingToZoom,
  connectLayersTree('translate'),
)(WarningZoom);
