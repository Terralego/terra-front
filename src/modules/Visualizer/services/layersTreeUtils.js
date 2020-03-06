
import searchService, { MAX_SIZE } from './search';

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
export const initLayersStateAction = (layersTree, { layers: hashLayers, table } = {}) => {
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

      if (hashLayers) {
        initialState.active = (
          Array.isArray(hashLayers) && hashLayers.includes(layerId))
          || hashLayers === layerId;
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

/**
 * Compute new `newLayersTreeState` from `prevLayersTreeState`
 * with updated `layerState` for `layer`. If we want to `reset` state.
 * Do not update state.
 */
export const setLayerStateAction = (layer, layerState, prevLayersTreeState, reset) => {
  if (layer.group) return setGroupLayerStateAction(layer, layerState, prevLayersTreeState);

  const newLayersTreeState = new Map(prevLayersTreeState);
  // Clone layer current state
  const prevLayerState = newLayersTreeState.get(layer);
  if (!prevLayerState) return prevLayersTreeState;

  const newLayerState = { ...layerState };

  if (newLayerState.table) {
    // Easiest to to read as transform Map in Array and run a .map() on it
    // eslint-disable-next-line no-param-reassign
    newLayersTreeState.forEach(layState => { layState.table = false; });
  }
  newLayersTreeState.set(layer, {
    ...reset ? {} : prevLayerState,
    ...newLayerState,
  });
  return newLayersTreeState;
};

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

const filterFromFeatureIds = ids => {
  if (!Array.isArray(ids)) {
    return null;
  }

  if (!ids.length) {
    return false;
  }

  return ['match', ['get', '_id'], ids, true, false];
};

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
    const { features: ids } = layerFeatures || {};

    const filter = filterFromFeatureIds(ids);

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

const flattenLayersTreeLayersId = layersTree => layersTree.reduce((all, { group, layers }) => [
  ...all,
  ...(group ? flattenLayersTreeLayersId(layers) : layers),
], []);

export const sortCustomLayers = (customLayers, layersTree) => {
  const newCustomLayers = [...customLayers];
  const flattenLayersTree = flattenLayersTreeLayersId(layersTree);
  flattenLayersTree.forEach(layerId => {
    const pos = newCustomLayers.findIndex(({ id }) => id === layerId);
    if (pos > -1) {
      newCustomLayers.push(...newCustomLayers.splice(pos, 1));
    }
  });
  // Reverse order as we want first layer come over next layer
  return newCustomLayers.reverse();
};

/**
 * Fetch property values list
 * @param {String} layer Layer id to fetch
 * @param {Object} property Property to fetch
 * @return Mixed[]
 */
export const fetchPropertyValues = async (layer, { property }) => {
  const results = await searchService.search({
    index: layer,
    aggregations: [{
      type: 'terms',
      field: `${property}.keyword`,
      name: 'values',
      options: {
        size: MAX_SIZE,
      },
    }],
    size: 0,
  });
  const { aggregations: { values: { buckets } } } = results;
  return buckets.map(({ key }) => key);
};

/**
 * Fetch property's min and max values
 * @param {String} layer Layer id to fetch
 * @param {Object} property Property to fetch
 * @return { min: Number, max: Number }
 */
export const fetchPropertyRange = async (layer, { property }) => {
  const results = await searchService.search({
    index: layer,
    aggregations: [{
      type: 'max',
      field: `${property}`,
      name: 'max',
    }, {
      type: 'min',
      field: `${property}`,
      name: 'min',
    }],
    size: 0,
  });
  const { aggregations: { min: { value: min } = {}, max: { value: max } = {} } } = results;

  return { min: min && Math.round(min), max: max && Math.round(max) };
};

/**
 * Transform a layersTree into a flat array of layers
 */
const flattenLayersTreeGroup = tree => {
  const layers = [];

  tree.forEach(treeNode => {
    if (treeNode.label) {
      layers.push(treeNode);
    }

    if (treeNode.layers) {
      layers.push(...flattenLayersTreeGroup(treeNode.layers));
    }
  });

  return layers;
};

/**
 * Story type view needs a specfic format.
 */
export const layersTreeToStory = layersTree => {
  const arrayOfLayers = flattenLayersTreeGroup(layersTree);

  const story = arrayOfLayers.reduce(({
    beforeEach: [beforeEachConfig],
    slides,
  }, {
    label: title,
    content = '',
    layers = [],
    ...layerAttrs
  }) => ({
    beforeEach: [{
      ...beforeEachConfig,
      layers: [
        ...beforeEachConfig.layers,
        ...layers.filter(layer => typeof layer === 'string'),
      ],
    }],
    slides: [
      ...slides, {
        title,
        content,
        layouts: [{
          layers: layers.filter(layer => typeof layer === 'string'),
          active: true,
        }],
        ...layerAttrs,
      }],
  }), {
    beforeEach: [{
      layers: [],
      active: false,
    }],
    slides: [],
  });

  return story;
};

export default {
  initLayersStateAction,
  setLayerStateAction,
  filterLayersFromLayersState,
  hasTable,
  hasWidget,
  filterFeatures,
  resetFilters,
  sortCustomLayers,
  fetchPropertyValues,
  fetchPropertyRange,
  layersTreeToStory,
};
