import LayersTreeItem from './LayersTreeItem';
import { connectLayersTree } from '../LayersTreeProvider/context';

export default connectLayersTree(({ getLayerState, setLayerState }, { layer }) => {
  const {
    active: isActive,
    opacity,
    table: isTableActive,
    filters: filtersValues = {},
    widgets = [],
    total,
    hidden,
  } = getLayerState({ layer });
  return {
    isActive,
    opacity,
    isTableActive,
    filtersValues,
    widgets,
    setLayerState,
    total,
    hidden,
  };
})(LayersTreeItem);
