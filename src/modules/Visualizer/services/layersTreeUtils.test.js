import {
  initLayersStateAction,
  selectSublayerAction,
  setLayerStateAction,
  filterLayersFromLayersState,
  hasTable,
  hasWidget,
  layersTreeStatesHaveChanged,
  isCluster,
  filterFeatures,
  resetFilters,
  INITIAL_FILTERS,
} from './layersTreeUtils';

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
    label: 'label4.1',
    initialState: {
      active: false,
    },
    sublayers: [{
      label: 'sublayer4.1.1',
      layers: ['layer4.1.1'],
    }, {
      label: 'sublayer4.1.2',
      layers: ['layer4.1.2'],
    }],
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
initialLayersTreeState.set(layersTree[2], { active: true, opacity: 1, sublayers: [true, false] });
initialLayersTreeState.set(
  layersTree[3].layers[0],
  { active: false, opacity: 1, sublayers: [false, false] },
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
    sublayers: [true, false],
  });
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

it('should select sublayer', () => {
  const newLayersTreeState1 = selectSublayerAction(layersTree[2], 0, initialLayersTreeState);

  expect(newLayersTreeState1).not.toBe(initialLayersTreeState);
  expect(newLayersTreeState1.get(layersTree[2])).toEqual({
    active: true,
    opacity: 1,
    sublayers: [true, false],
    table: false,
  });

  const newLayersTreeState2 = selectSublayerAction(layersTree[2], 1, initialLayersTreeState);

  expect(newLayersTreeState2).not.toBe(newLayersTreeState1);
  expect(newLayersTreeState2.get(layersTree[2])).toEqual({
    active: true,
    opacity: 1,
    sublayers: [false, true],
    table: false,
  });
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

  INITIAL_FILTERS.clear();
});

it('should filter features on sublayers', () => {
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
    sublayers: [{
      label: 'foo',
      layers: ['foo'],
    }, {
      label: 'bar',
      layers: ['bar'],
    }],
    filters: {
      layer: 'foo',
    },
  };
  const ltState = new Map();
  ltState.set(layer1, { active: true });

  filterFeatures(map, [{ layer: 'bar', features: ['1', '2'] }], ltState);
  expect(map.setFilter).toHaveBeenCalledWith('bar', ['prev', 'filter']);
  expect(map.setFilter).toHaveBeenCalledWith('foo', ['prev', 'filter']);
  expect(map.setFilter).toHaveBeenCalledTimes(2);

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
