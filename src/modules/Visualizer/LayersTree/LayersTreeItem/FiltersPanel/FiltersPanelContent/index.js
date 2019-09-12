import FiltersPanelContent from './FiltersPanelContent';

import { connectLayersTree } from '../../../LayersTreeProvider/context';

export default connectLayersTree((context, props) => {
  const { getLayerState, translate } = context;
  const { layer, layer: { exclusive, layers } } = props;
  const activeLayer = exclusive
    ? layers.find(l => getLayerState({ layer: l }).active) || layer
    : layer;

  return {
    filtersValues: getLayerState({ layer: activeLayer }).filters || {},
    activeLayer,
    translate,
  };
})(FiltersPanelContent);
