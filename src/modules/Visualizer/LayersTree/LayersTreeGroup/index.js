import LayersTreeGroup from './LayersTreeGroup';
import { connectLayersTree } from '../LayersTreeProvider/context';
import { isGroupHidden } from './utils';

export default connectLayersTree(({ getLayerState, layersExtent }, { layer: { layers } }) => ({
  isHidden: isGroupHidden(layers, getLayerState),
  layersExtent,
}))(LayersTreeGroup);
