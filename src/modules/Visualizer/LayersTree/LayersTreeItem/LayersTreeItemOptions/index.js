import React from 'react';
import LayersTreeItemOptionsDesktop from './LayersTreeItemOptionsDesktop';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';
import withDeviceSize from '../withDeviceSize';

export const LayersTreeItemOptions  = ({ isTabletSized, ...props }) => (
  isTabletSized
    ? <LayersTreeItemOptionsTablet {...props} />
    : <LayersTreeItemOptionsDesktop {...props} />
);
export default withDeviceSize(LayersTreeItemOptions);
