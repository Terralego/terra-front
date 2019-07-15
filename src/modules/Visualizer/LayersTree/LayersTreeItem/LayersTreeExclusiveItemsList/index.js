import LayersTreeExclusiveItemsList from './LayersTreeExclusiveItemsList';
import { connectLayersTree } from '../../LayersTreeProvider/context';

export const onChange = (layers, setLayerState, getLayerState) => selected => {
  const prevSelected = layers.reduce((prev, layer, index, all, state = getLayerState({ layer })) =>
    (state.active ? state : prev), {});

  layers
    .filter(({ label }) => label)
    .forEach((layer, index) =>
      setLayerState({
        layer,
        state: index === +selected
          ? { ...prevSelected, active: true }
          : { active: false },
        reset: true,
      }));
};


export default connectLayersTree(({
  getLayerState, setLayerState,
}, {
  layer: { layers = [] },
}) => ({
  onChange: onChange(layers, setLayerState, getLayerState),
  selected: layers
    .filter(({ label }) => label)
    .findIndex(layer => getLayerState({ layer }).active),
}))(LayersTreeExclusiveItemsList);
