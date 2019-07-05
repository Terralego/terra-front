import LayersTreeSubItemsList from './LayersTreeSubItemsList';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree(({ getLayerState }, { layer }) => ({
  layerState: getLayerState({ layer }),
}))(LayersTreeSubItemsList);
