import LayersTreeExclusiveItemsList from './LayersTreeExclusiveItemsList';
import { connectLayersTree } from '../../LayersTreeProvider/context';

const onChange = (layers, setLayerState) => selected =>
  layers
    .filter(({ label }) => label)
    .forEach((layer, index) =>
      setLayerState({ layer, state: { active: index === +selected }, reset: true }));


export default connectLayersTree(({
  getLayerState, setLayerState,
}, {
  layer: { layers = [] },
}) => ({
  onChange: onChange(layers, setLayerState),
  selected: layers
    .filter(({ label }) => label)
    .findIndex(layer => getLayerState({ layer }).active),
}))(LayersTreeExclusiveItemsList);
