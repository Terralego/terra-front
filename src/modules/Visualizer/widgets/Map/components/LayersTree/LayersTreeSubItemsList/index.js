import LayersTreeSubItemsList from './LayersTreeSubItemsList';
import connectWidgetMap from '../../../connect';

export * from './LayersTreeSubItemsList';
export default connectWidgetMap(({ selectSublayer, getLayerState }, { layer }) => ({
  layerState: getLayerState({ layer }),
  selectSublayer,
}))(LayersTreeSubItemsList);
