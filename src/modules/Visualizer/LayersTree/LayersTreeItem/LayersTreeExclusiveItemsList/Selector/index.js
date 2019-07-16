import Selector from './Selector';
import { connectLayersTree } from '../../../LayersTreeProvider/context';

export default connectLayersTree(({
  getLayerState, translate,
}, {
  layer: { layers, selectors },
}) => ({
  selectors,
  layers,
  activeLayer: layers.find(layer => getLayerState({ layer }).active),
  translate,
}))(Selector);
