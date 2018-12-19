export function initLayersStateAction (layersTree) {
  const layersTreeState = new Map();
  function reduceLayers (group, map) {
    return group.reduce((layersStateMap, layer) => {
      const { initialState = {}, sublayers } = layer;
      const { active } = initialState;
      if (sublayers) {
        initialState.sublayers = initialState.sublayers || sublayers.map((_, k) =>
          (k === 0 && !!active));
      }
      if (layer.group) {
        return reduceLayers(layer.layers, layersStateMap);
      }
      initialState.opacity = initialState.opacity === undefined
        ? 1
        : initialState.opacity;
      layersStateMap.set(layer, {
        active: false,
        opacity: 1,
        ...initialState,
      });
      return layersStateMap;
    }, map);
  }
  return reduceLayers(layersTree, layersTreeState);
}

export function setLayerStateAction (layer, layerState, prevLayersTreeState) {
  const layersTreeState = new Map(prevLayersTreeState);
  const prevLayerState = layersTreeState.get(layer);
  const newLayerState = { ...layerState };

  if (!prevLayerState) return prevLayersTreeState;

  if (prevLayerState.sublayers && !prevLayerState.sublayers.find(sl => sl)) {
    newLayerState.sublayers = [...prevLayerState.sublayers];
    newLayerState.sublayers[0] = true;
  }

  layersTreeState.set(layer, {
    ...prevLayerState,
    ...newLayerState,
  });
  return layersTreeState;
}

export function selectSublayerAction (layer, sublayer, prevLayersTreeState) {
  const layersTreeState = new Map(prevLayersTreeState);
  const layerState = layersTreeState.get(layer);
  layerState.sublayers = layerState.sublayers.map((_, k) => k === sublayer);
  layersTreeState.set(layer, { ...layerState });
  return layersTreeState;
}

export default { initLayersStateAction, selectSublayerAction, setLayerStateAction };
