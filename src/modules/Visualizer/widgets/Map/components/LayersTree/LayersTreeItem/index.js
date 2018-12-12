import LayersTreeItem from './LayersTreeItem';
import connectWidgetMap from '../../../connect';

export * from './LayersTreeItem';

export default connectWidgetMap(({ getLayerState, setLayerState }, { layer }) => ({
  isActive: getLayerState({ layer }).active,
  opacity: getLayerState({ layer }).opacity,
  setLayerState,
}))(LayersTreeItem);
