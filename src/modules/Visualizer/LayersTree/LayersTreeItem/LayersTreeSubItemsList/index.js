import LayersTreeSubItemsList from './LayersTreeSubItemsList';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export default connectLayersTree(({ selectSublayer, getLayerState }, { layer }) => ({
  layerState: getLayerState({ layer }),
  selectSublayer,
}))(LayersTreeSubItemsList);
