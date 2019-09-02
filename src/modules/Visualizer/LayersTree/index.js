import React from 'react';

import LayersTreeProvider from './LayersTreeProvider';
import UnconnectedLayersTree from './LayersTree';

import { connectLayersTree } from './LayersTreeProvider/context';

const ConnectedLayersTree = connectLayersTree('layersTree')(UnconnectedLayersTree);

export { connectLayersTree, LayersTreeProvider, ConnectedLayersTree as LayersTree };

const LayersTree = props => (
  <LayersTreeProvider {...props}><ConnectedLayersTree /></LayersTreeProvider>
);
export default LayersTree;
