import React from 'react';

import { connectLayersTree } from '../../LayersTreeProvider/context';
import LayersTreeItemOptionsDesktop from './LayersTreeItemOptionsDesktop';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';
import withDeviceSize from '../../../../../utils/withDeviceSize';

export const LayersTreeItemOptions  = connectLayersTree('translate')(({ isMobileSized, isPhoneSized, ...props }) => (
  isMobileSized
    ? <LayersTreeItemOptionsTablet {...props} />
    : <LayersTreeItemOptionsDesktop {...props} />
));
export default withDeviceSize()(LayersTreeItemOptions);
