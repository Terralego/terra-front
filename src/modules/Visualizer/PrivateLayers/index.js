import compose from '../../../utils/compose';
import { connectAuthProvider } from '../../Auth';
import { connectLayersTree } from '../LayersTree';

import PrivateLayers from './PrivateLayers';

export default compose(
  connectAuthProvider('authenticated'),
  connectLayersTree('setLayerState', 'layersTreeState'),
)(PrivateLayers);
