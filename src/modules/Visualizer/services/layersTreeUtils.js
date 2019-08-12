import { PREFIX_SOURCE } from '../../Map/services/cluster';

export const INITIAL_FILTERS = new Map();

export const isCluster = (source, layerId) => !!source.match(new RegExp(`^${layerId}-${PREFIX_SOURCE}-[0-9]+`));

/**
 * Returns a flattened map of layers state from a layers tree
 *
 * @param {object} layersTree The layers tree config object
 * @param {string|string[]} layers Active layer(s) from hash
 * @param {string} table Active table from hash (layer id)
 * @return {Map} A reduced layer tree state
 */
export const initLayersStateAction = (layersTree, { layers, table } = {}) => {
  const layersTreeState = new Map();

  function reduceLayers (group, map) {
    return group.reduce((layersStateMap, layer) => {
      const { initialState = {}, layers: [layerId] = [] } = layer;
      if (layer.group) {
        return reduceLayers(layer.layers, layersStateMap);
      }
      initialState.opacity = initialState.opacity === undefined
        ? 1
        : initialState.opacity;

      if (layers) {
        initialState.active = (
          Array.isArray(layers) && layers.includes(layerId))
          || layers === layerId;
      }
      if (table && table === layerId) {
        initialState.table = true;
      }

      layersStateMap.set(layer, {
        active: false,
        opacity: 1,
        ...initialState,
      });
      return layersStateMap;
    }, map);
  }

  return reduceLayers(layersTree, layersTreeState);
};

export function setGroupLayerStateAction (layer, layerState, prevLayersTreeState) {
  const { layers } = layer;
  let layersTreeState = prevLayersTreeState;
  const defaultIndex = Math.max(0, layers.findIndex(({ default: isDefault }) => isDefault));

  layers.forEach((sublayer, index) => {
    const newLayerState = { ...layerState };
    if (newLayerState.active && index !== defaultIndex) {
      newLayerState.active = false;
    }
    // One must be before the other
    // eslint-disable-next-line no-use-before-define
    layersTreeState = setLayerStateAction(sublayer, newLayerState, layersTreeState);
  });
  return layersTreeState;
}

export function setLayerStateAction (layer, layerState, prevLayersTreeState, reset) {
  if (layer.group) return setGroupLayerStateAction(layer, layerState, prevLayersTreeState);

  const layersTreeState = new Map(prevLayersTreeState);
  const prevLayerState = layersTreeState.get(layer);
  const newLayerState = { ...layerState };

  if (!prevLayerState) return prevLayersTreeState;

  if (newLayerState.table) {
    // Easiest to to read as transform Map in Array and run a .map() on it
    // eslint-disable-next-line no-param-reassign
    layersTreeState.forEach(layState => { layState.table = false; });
  }
  layersTreeState.set(layer, {
    ...reset ? {} : prevLayerState,
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
    layers,
    filters: { layer } = {},
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
  setLayerStateAction,
  filterLayersFromLayersState,
  hasTable,
  hasWidget,
  filterFeatures,
  resetFilters,
};
