import React from 'react';

import LayersTreeProvider from './LayersTreeProvider';
import UnconnectedLayersTree from './LayersTree';

import { connectLayersTree } from './LayersTreeProvider/context';

const LayersTree = connectLayersTree('layersTree')(UnconnectedLayersTree);

export { connectLayersTree, LayersTreeProvider, LayersTree };

export default props => <LayersTreeProvider {...props}><LayersTree /></LayersTreeProvider>;
