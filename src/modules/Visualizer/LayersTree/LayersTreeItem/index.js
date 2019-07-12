import LayersTreeItem from './LayersTreeItem';
import { connectLayersTree } from '../LayersTreeProvider/context';

export default connectLayersTree(({
  getLayerState, setLayerState, map,
}, {
  layer,
  layer: { exclusive, layers },
}) => {
  const activeLayer = exclusive
    ? layers.find(l => getLayerState({ layer: l }).active) || layer
    : layer;

  const {
    active: isActive,
    opacity,
    table: isTableActive,
    filters: filtersValues = {},
    widgets = [],
    total,
    hidden,
  } = getLayerState({ layer: activeLayer });

  return {
    isActive,
    opacity,
    isTableActive,
    filtersValues,
    widgets,
    setLayerState,
    total,
    hidden,
    map,
    activeLayer,
  };
})(LayersTreeItem);
