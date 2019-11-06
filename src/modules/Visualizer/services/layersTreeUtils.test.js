import {
  initLayersStateAction,
  setLayerStateAction,
  filterLayersFromLayersState,
  hasTable,
  hasWidget,
  layersTreeStatesHaveChanged,
  isCluster,
  filterFeatures,
  resetFilters,
  sortCustomLayers,
  fetchPropertyValues,
  fetchPropertyRange,
  layersTreeToStory,
  INITIAL_FILTERS,
} from './layersTreeUtils';
import search from './search';

jest.mock('./search', () => ({
  MAX_SIZE: 10000,
  search: jest.fn(({ index }) => {
    if (index === 'witherror') {
      return {
        aggregations: {},
      };
    }
    return {
      aggregations: {
        values: {
          buckets: [{
            key: 'foo',
          }, {
            key: 'bar',
          }],
        },
        min: { value: 42 },
        max: { value: 123 },
      },
    };
  }),
}));

const layersTree = [{
  label: 'label1',
  initialState: {
    active: true,
    opacity: 0.3,
  },
  layers: ['layer1', 'layer2'],
}, {
  group: 'group2',
  layers: [{
    initialState: {
      active: true,
      opacity: 0,
    },
    label: 'label2.1',
    layers: ['layer2.1'],
  }, {
    label: 'label2.2',
    layers: ['layer2.2'],
  }],
}, {
  label: 'label3',
  initialState: {
    active: true,
  },
}, {
  group: 'group4',
  layers: [{
    label: 'label4.1',
    initialState: {
      active: false,
    },
  }, {
    label: 'label4.2',
    initialState: {
      active: false,
    },
    layers: ['layer4.2'],
  }],
}];
const initialLayersTreeState = new Map();
initialLayersTreeState.set(layersTree[0], { active: true, opacity: 0.3 });
initialLayersTreeState.set(layersTree[1].layers[0], { active: true, opacity: 0 });
initialLayersTreeState.set(layersTree[1].layers[1], { active: false, opacity: 1 });
initialLayersTreeState.set(layersTree[2], { active: true, opacity: 1 });
initialLayersTreeState.set(
  layersTree[3].layers[0],
  { active: false, opacity: 1 },
);
initialLayersTreeState.set(layersTree[3].layers[1], { active: false, opacity: 1 });

const layersTreeFilters = [{
  label: 'label1',
  initialState: {
    active: true,
    opacity: 0.3,
  },
  layers: ['layer1', 'layer2'],
  filters: { layer: 'layer1', fields: [], form: [] },
}, {
  group: 'group2',
  layers: [{
    initialState: {
      active: false,
      opacity: 0,
    },
    label: 'label2.1',
    layers: ['layer2.1'],
  }, {
    label: 'label2.2',
    layers: ['layer2.2'],
    filters: { layer: 'layer2.2', fields: [], form: [] },
  }],
}, {
  label: 'label3',
  initialState: {
    active: true,
  },
  sublayers: [{
    label: 'sublayer3.1',
    layers: ['layer3.1'],
  }, {
    label: 'sublayer3.2',
    layers: ['layer3.2'],
  }],
}, {
  group: 'group4',
  layers: [{
    initialState: {
      active: true,
      opacity: 0,
    },
    label: 'label4.1',
    layers: ['layer4.1'],
    filters: { layer: 'layer4.1', fields: [], form: [] },
  }, {
    label: 'label2.2',
    layers: ['layer2.2'],
    widgets: [{}],
  }],
}];
const layersTreeFilterState = new Map();
layersTreeFilterState.set(layersTreeFilters[0], { active: true });
layersTreeFilterState.set(layersTreeFilters[1].layers[0], { active: true });
layersTreeFilterState.set(layersTreeFilters[1].layers[1], { active: false });
layersTreeFilterState.set(layersTreeFilters[2], { active: true, sublayers: [true, false] });
layersTreeFilterState.set(layersTreeFilters[3].layers[0], { active: true, table: true });
layersTreeFilterState.set(
  layersTreeFilters[3].layers[1],
  {
    active: true,
    widgets: [layersTreeFilters[3].layers[1].widgets[0]],
  },
);

it('should init layers state', () => {
  const layersTreeState = initLayersStateAction(layersTree);

  expect(layersTreeState).toEqual(initialLayersTreeState);
});


it('should set layer state', () => {
  const newLayersTreeState = setLayerStateAction(
    layersTree[3].layers[0],
    { active: true, table: true },
    initialLayersTreeState,
  );
  expect(newLayersTreeState).not.toBe(initialLayersTreeState);
  expect(newLayersTreeState.get(layersTree[3].layers[0])).toEqual({
    active: true,
    opacity: 1,
    table: true,
  });
});

it('should reset layer state', () => {
  const layer = {};
  const state = new Map();
  state.set(layer, { foo: 'bar' });
  expect(setLayerStateAction(
    layer,
    { active: true },
    state,
  ).get(layer)).toEqual({ active: true, foo: 'bar' });

  expect(setLayerStateAction(
    layer,
    { active: true },
    state,
    true,
  ).get(layer)).toEqual({ active: true });
});

it('should set layer state and initial sublayers', () => {
  const newLayersTreeState1 = setLayerStateAction(
    layersTree[0],
    { active: false, table: false },
    initialLayersTreeState,
  );
  expect(newLayersTreeState1).not.toBe(initialLayersTreeState);
  expect(newLayersTreeState1.get(layersTree[0])).toEqual({
    active: false,
    opacity: 0.3,
    table: false,
  });

  const newLayersTreeState2 = setLayerStateAction(
    layersTree[0],
    { active: true, opacity: 1, table: true },
    newLayersTreeState1,
  );
  expect(newLayersTreeState2).not.toBe(newLayersTreeState1);
  expect(newLayersTreeState2.get(layersTree[0])).toEqual({
    active: true,
    opacity: 1,
    table: true,
  });

  const newLayersTreeState3 = setLayerStateAction(
    {},
    { active: true, opacity: 1 },
    newLayersTreeState1,
  );
  expect(newLayersTreeState3).toBe(newLayersTreeState3);
});

it('should return an empty array', () => {
  const activeLayers = filterLayersFromLayersState(
    initialLayersTreeState,
  );
  expect(activeLayers).toEqual([]);
  expect(filterLayersFromLayersState()).toEqual([]);
});

it('if have filters, should return an array of active layers', () => {
  const activeLayers = filterLayersFromLayersState(
    layersTreeFilterState,
  );
  expect(activeLayers).toEqual(['layer1', 'layer4.1']);
  const layersTreeState = new Map();
  layersTreeState.set({}, { active: true });
  expect(filterLayersFromLayersState(layersTreeState)).toEqual([]);
});

it('should tell is there is a table active', () => {
  expect(hasTable(layersTreeFilterState)).toBe(true);
});

it('should tell is there is a widget active', () => {
  expect(hasWidget(layersTreeFilterState)).toBe(true);
});

it('should return true if the layersTree state has changed', () => {
  const step0 = new Map();
  const layer = {};
  step0.set(layer, {});

  const step1 = new Map();
  step1.set(layer, undefined);
  expect(layersTreeStatesHaveChanged(step0, step1)).toBe(false);
  expect(layersTreeStatesHaveChanged(step0, step1, ['opacity'])).toBe(false);

  const step2 = new Map();
  step2.set(layer, {
    active: true,
  });
  expect(layersTreeStatesHaveChanged(step1, step2)).toBe(true);
  expect(layersTreeStatesHaveChanged(step1, step2, ['opacity'])).toBe(false);

  const step3 = new Map();
  step3.set(layer, {
    active: false,
    opacity: 0.2,
  });
  expect(layersTreeStatesHaveChanged(step2, step3)).toBe(true);
  expect(layersTreeStatesHaveChanged(step2, step3, ['opacity'])).toBe(true);
});

it('should be a cluster', () => {
  expect(isCluster('test-cluster-source-0', 'test')).toBe(true);
  expect(isCluster('test-source', 'test')).toBe(false);
});

it('should filter features', () => {
  const map = {
    getLayer: jest.fn(layerId => (layerId === 'unknownlayer'
      ? undefined
      : {
        source: layerId === 'cluster' ? `${layerId}-cluster-source-0` : 'source',
      })),
    getFilter: jest.fn(() => ['prev', 'filter']),
    setFilter: jest.fn(),
    fire: jest.fn(),
  };
  const layer1 = {
    label: 'foo',
    layers: ['foo', 'unknownlayer'],
    filters: {
      layer: 'foo',
    },
  };
  const layer2 = {
    label: 'bar',
    layers: ['bar'],
  };
  const layer3 = {
    label: 'cluster',
    layers: ['cluster'],
    filters: {
      layer: 'cluster',
    },
  };
  const ltState = new Map();
  ltState.set(layer1, { active: true });
  ltState.set(layer2, { active: false });
  ltState.set(layer3, { active: true });

  filterFeatures(map, [{ layer: 'bar', features: ['1', '2'] }], ltState);
  expect(map.fire).toHaveBeenCalledWith('refreshCluster');
  expect(map.setFilter).toHaveBeenCalledWith('foo', ['prev', 'filter']);
  expect(map.setFilter).toHaveBeenCalledTimes(1);

  map.setFilter.mockClear();
  map.fire.mockClear();
  ltState.set(layer3, { active: false });
  filterFeatures(map, [{ layer: 'foo', features: ['1', '2'] }], ltState);
  expect(map.fire).not.toHaveBeenCalled();
  expect(map.setFilter).toHaveBeenCalledWith('foo', ['match', ['get', '_id'], ['1', '2'], true, false]);
  expect(map.setFilter).toHaveBeenCalledTimes(1);

  map.setFilter.mockClear();
  map.fire.mockClear();
  ltState.set(layer3, { active: false });
  filterFeatures(map, [{ layer: 'foo', features: [] }], ltState);
  expect(map.fire).not.toHaveBeenCalled();
  expect(map.setFilter).toHaveBeenCalledWith('foo', false);
  expect(map.setFilter).toHaveBeenCalledTimes(1);

  INITIAL_FILTERS.clear();
});

it('should reset filters', () => {
  const map = {
    getLayer: jest.fn(layerId => (layerId === 'unknownlayer'
      ? undefined
      : {
        source: layerId === 'cluster' ? `${layerId}-cluster-source-0` : 'source',
      })),
    getFilter: jest.fn(() => ['prev', 'filter']),
    setFilter: jest.fn(),
    fire: jest.fn(),
  };
  const layer1 = {
    label: 'foo',
    layers: ['foo', 'unknownlayer'],
    filters: {
      layer: 'foo',
    },
  };
  const layer2 = {
    label: 'bar',
    layers: ['bar'],
  };
  const layer3 = {
    label: 'cluster',
    layers: ['cluster'],
    filters: {
      layer: 'cluster',
    },
  };
  const layer4 = {
    label: 'empty',
  };
  const ltState = new Map();
  ltState.set(layer1, { active: true });
  ltState.set(layer2, { active: false });
  ltState.set(layer3, { active: true });
  ltState.set(layer4, {});
  resetFilters(map, ltState);
  expect(map.fire).toHaveBeenCalledTimes(1);
  expect(map.setFilter).not.toHaveBeenCalled();

  INITIAL_FILTERS.set('foo', ['prev', 'filter']);
  resetFilters(map, ltState);
  expect(map.setFilter).toHaveBeenCalledWith('foo', ['prev', 'filter']);
});

it('should set group state', () => {
  const layer = {
    group: 'foo',
    layers: [{
      label: 'foo1',
    }, {
      label: 'foo2',
    }],
  };
  const layerState = {
    active: true,
  };
  const prevLayerState = new Map([
    [layer, {}],
    [layer.layers[0], {}],
    [layer.layers[1], {}],
  ]);
  const newLayersTreeState = setLayerStateAction(layer, layerState, prevLayerState);

  expect(newLayersTreeState.get(layer.layers[0])).toEqual({
    active: true,
  });
  expect(newLayersTreeState.get(layer.layers[1])).toEqual({
    active: false,
  });
});

it('should sort custom layers', () => {
  const customLayers = [{
    id: '1',
  }, {
    id: '2',
  }, {
    id: '3',
  }, {
    id: '4',
  }, {
    id: '5',
  }, {
    id: '6',
  }];
  const lT = [{
    layers: ['4', '2', '7'],
  }, {
    group: 'foo',
    layers: [{
      layers: ['3', '5'],
    }, {
      group: 'bar',
      layers: [{
        layers: ['1', '2'],
      }],
    }],
  }];
  expect(sortCustomLayers(customLayers, lT)).toEqual([{
    id: '6',
  }, {
    id: '4',
  }, {
    id: '3',
  }, {
    id: '5',
  }, {
    id: '1',
  }, {
    id: '2',
  }]);
});

it('should fetch property value', async () => {
  const values = await fetchPropertyValues('foo', { property: 'foo' });
  expect(search.search).toHaveBeenCalledWith({
    index: 'foo',
    aggregations: [{
      type: 'terms',
      field: 'foo.keyword',
      name: 'values',
      options: {
        size: 10000,
      },
    }],
    size: 0,
  });
  expect(values).toEqual(['foo', 'bar']);
});

it('should fetch property range', async () => {
  const values = await fetchPropertyRange('foo', { property: 'foo' });
  expect(search.search).toHaveBeenCalledWith({
    index: 'foo',
    aggregations: [{
      type: 'max',
      field: 'foo',
      name: 'max',
    }, {
      type: 'min',
      field: 'foo',
      name: 'min',
    }],
    size: 0,
  });
  expect(values).toEqual({ min: 42, max: 123 });
});

it('should fetch property range with error', async () => {
  const values = await fetchPropertyRange('witherror', { property: 'foo' });
  expect(values).toEqual({ min: undefined, max: undefined });
});

it('should generate story from layerstree', () => {
  expect(layersTreeToStory([{
    group: 'foo',
    layers: [{
      label: 'first story',
      layers: ['layer1', 'layer2'],
      content: 'some content',
    }, {
      label: 'second story',
      layers: ['layer3', 'layer4'],
      content: 'some other content',
    }],
  }])).toEqual({
    beforeEach: [{
      layers: ['layer1', 'layer2', 'layer3', 'layer4'],
      active: false,
    }],
    slides: [{
      title: 'first story',
      layouts: [{
        layers: ['layer1', 'layer2'],
        active: true,
      }],
      content: 'some content',
    }, {
      title: 'second story',
      layouts: [{
        layers: ['layer3', 'layer4'],
        active: true,
      }],
      content: 'some other content',
    }],
  });
});
