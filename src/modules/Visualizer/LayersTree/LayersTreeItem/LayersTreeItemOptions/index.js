import React from 'react';
import LayersTreeItemOptionsDesktop from './LayersTreeItemOptionsDesktop';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';
import withDeviceSize from '../../../../../utils/withDeviceSize';

export const LayersTreeItemOptions  = ({ isMobileSized, isPhoneSized, ...props }) => (
  isMobileSized
    ? <LayersTreeItemOptionsTablet {...props} />
    : <LayersTreeItemOptionsDesktop {...props} />
);
export default withDeviceSize()(LayersTreeItemOptions);
