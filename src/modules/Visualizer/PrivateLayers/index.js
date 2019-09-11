import { connectAuthProvider } from '../../Auth';
import { connectLayersTree } from '../LayersTree';

import PrivateLayers from './PrivateLayers';

export default connectAuthProvider('authenticated')(
  connectLayersTree('setLayerState', 'layersTreeState')(
    PrivateLayers,
  ),
);
