import LayersTreeItemFilters from './LayersTreeItemFilters';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree(({ getLayerState, setLayerState }, { layer }) => ({
  filtersValues: getLayerState({ layer }).filters || {},
  setLayerState,
}))(LayersTreeItemFilters);
