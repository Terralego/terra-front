import LayersTreeItem from './LayersTreeItem';
import { connectLayersTree } from '../LayersTreeProvider/context';

const getState = (getLayerState, layer) => {
  const { exclusive, layers } = layer;
  if (exclusive) {
    return layers.reduce((activeState, sublayer) => {
      if (activeState) return activeState;
      const state = getLayerState({ layer: sublayer });
      if (state.active) return state;
      return activeState;
    }, null) || {};
  }

  return getLayerState({ layer });
};

export default connectLayersTree(({
  getLayerState, setLayerState, map,
}, {
  layer,
}) => {
  const {
    active: isActive,
    opacity,
    table: isTableActive,
    filters: filtersValues = {},
    widgets = [],
    total,
    hidden,
  } = getState(getLayerState, layer);

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
  };
})(LayersTreeItem);
