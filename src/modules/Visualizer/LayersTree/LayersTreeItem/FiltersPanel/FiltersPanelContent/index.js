import FiltersPanelContent from './FiltersPanelContent';

import { connectLayersTree } from '../../../LayersTreeProvider/context';

export default connectLayersTree('translate', ({ getLayerState }, { layer, layer: { exclusive, layers } }) => {
  const activeLayer = exclusive
    ? layers.find(l => getLayerState({ layer: l }).active) || layer
    : layer;

  return {
    filtersValues: getLayerState({ layer: activeLayer }).filters || {},
    activeLayer,
  };
})(FiltersPanelContent);
