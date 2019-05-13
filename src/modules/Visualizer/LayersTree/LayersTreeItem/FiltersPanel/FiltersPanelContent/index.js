import FiltersPanelContent from './FiltersPanelContent';

import { connectLayersTree } from '../../../LayersTreeProvider/context';

export default connectLayersTree(({ getLayerState }, { layer }) => ({
  filtersValues: getLayerState({ layer }).filters || {},
}))(FiltersPanelContent);
