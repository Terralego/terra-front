import LayersTreeItemFilters from './LayersTreeItemFilters';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree(({
  getLayerState, setLayerState, translate,
}, {
  layer, layer: { exclusive, layers },
}) => {
  const activeLayer = exclusive
    ? layers.find(l => getLayerState({ layer: l }).active) || layer
    : layer;

  return {
    filtersValues: getLayerState({ layer: activeLayer }).filters || {},
    setLayerState,
    activeLayer,
    translate,
  };
})(LayersTreeItemFilters);
