import LayersTreeGroup from './LayersTreeGroup';
import { connectLayersTree } from '../LayersTreeProvider/context';
import { isGroupHidden } from './utils';

export default connectLayersTree(({ getLayerState, layersExtent, isDetailsVisible }, { layer: { layers } }) => ({
  isHidden: isGroupHidden(layers, getLayerState),
  layersExtent,
  isDetailsVisible,
}))(LayersTreeGroup);
