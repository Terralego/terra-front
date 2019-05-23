import LayersTreeGroup from './LayersTreeGroup';
import { connectLayersTree } from '../LayersTreeProvider/context';

export default connectLayersTree(({ getLayerState }, { layer: { layers } }) => ({
  isHidden: layers.reduce((prev, layer) =>
    prev || getLayerState({ layer }).hidden, false),
}))(LayersTreeGroup);
