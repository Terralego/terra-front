import { PREFIX_SOURCE } from '../../Map/services/cluster';

export const INITIAL_FILTERS = new Map();

export const isCluster = (source, layerId) => !!source.match(new RegExp(`^${layerId}-${PREFIX_SOURCE}-[0-9]+`));

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
  if (newLayerState.table) {
    // Easiest to to read as transform Map in Array and run a .map() on it
    // eslint-disable-next-line no-param-reassign
    layersTreeState.forEach(layState => { layState.table = false; });
  }
  layersTreeState.set(layer, {
    ...prevLayerState,
    ...newLayerState,
  });
  return layersTreeState;
}

export function layersTreeStatesHaveChanged (layersTreeState, prevLayersTreeState, fields = ['active']) {
  return !fields.reduce((all, field) =>
    all && Array.from(layersTreeState).reduce((suball, [layer, state = {}]) =>
      suball && state[field] === (prevLayersTreeState.get(layer) || {})[field],
    all),
  true);
}

export function selectSublayerAction (layer, sublayer, prevLayersTreeState) {
  const layersTreeState = new Map(prevLayersTreeState);
  const layerState = layersTreeState.get(layer);
  layerState.sublayers = layerState.sublayers.map((_, k) => k === sublayer);
  layersTreeState.set(layer, { ...layerState });
  return layersTreeState;
}

export const filterLayersStatesFromLayersState = (
  layersTreeState = [],
  check = ({ active }) => !!active,
) => Array
  .from(layersTreeState)
  .reduce((allLayers, [layer, state]) =>
    ((check(state)) ? [...allLayers, [layer, state]] : allLayers), []);

export const filterLayersFromLayersState = (layersTreeState, check) =>
  filterLayersStatesFromLayersState(layersTreeState, check)
    .filter(([{ filters: { layer } = {} }]) => layer)
    .map(([{ filters: { layer } }]) => layer);

export const hasTable = layersTreeState =>
  filterLayersFromLayersState(layersTreeState, ({ table }) => table).length > 0;

export const hasWidget = layersTreeState =>
  filterLayersStatesFromLayersState(layersTreeState, ({ widgets = [] }) => widgets.length > 0)
    .length > 0;

export const filterFeatures = (
  map,
  features/* = [ { layer: String, features: [id1, id2, …] } ] */,
  layersTreeState,
) => {
  Array.from(layersTreeState).forEach(([{
    layers, filters: { layer } = {},
  }, {
    active,
  }]) => {
    if (!active || !layers) return;
    const layerFeatures = features
      .find(({ layer: fLayer }) => fLayer === layer);
    const { features: ids = [] } = layerFeatures || {};

    const filter = ids.length ? ['match', ['get', '_id'], ids, true, false] : null;
    layers.forEach(layerId => {
      const paintLayer = map.getLayer(layerId);
      if (!paintLayer) return;

      if (isCluster(paintLayer.source, layerId)) {
        // Force to upgrade cluster data
        map.fire('refreshCluster');
        return;
      }

      if (!INITIAL_FILTERS.has(layerId)) {
        INITIAL_FILTERS.set(layerId, map.getFilter(layerId));
      }
      map.setFilter(layerId, layerFeatures ? filter : INITIAL_FILTERS.get(layerId));
    });
  });
};

export const resetFilters = (map, layersTreeState) => {
  Array.from(layersTreeState).forEach(([{
    layers = [], filters,
  }]) => {
    if (!filters) return;

    layers.forEach(layerId => {
      const paintLayer = map.getLayer(layerId);

      if (!map.getLayer(layerId)) return;

      if (isCluster(paintLayer.source, layerId)) {
        // Force to upgrade cluster data
        map.fire('refreshCluster');
        return;
      }
      if (!INITIAL_FILTERS.has(layerId)) return;
      map.setFilter(layerId, INITIAL_FILTERS.get(layerId));
    });
  });
};

export default {
  initLayersStateAction,
  selectSublayerAction,
  setLayerStateAction,
  filterLayersFromLayersState,
  hasTable,
  hasWidget,
  filterFeatures,
  resetFilters,
};
