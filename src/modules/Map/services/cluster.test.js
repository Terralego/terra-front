import { getPaintExpression, createClusterLayers, updateCluster, getClusteredFeatures } from './cluster';

it('should get paint expression', () => {
  expect(getPaintExpression([1, 2, 3], [4, 5, 6, 7])).toEqual([
    'case',
    ['<', ['get', 'point_count'], 1], 4,
    ['<', ['get', 'point_count'], 2], 5,
    ['<', ['get', 'point_count'], 3], 6,
    7,
  ]);
});

it('should create cluster layers', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    getMaxZoom: jest.fn(() => 18),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      radius: 25,
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };
  createClusterLayers({
    map,
    layer,
    index: 0,
    radius: 25,
  });

  expect(map.addSource).toHaveBeenCalledWith('layer-cluster-source-0', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom: 19,
    clusterRadius: 25,
    maxzoom: 19,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-0',
    source: 'layer-cluster-source-0',
    type: 'circle',
    filter: ['has', 'point_count'],
    paint: {
      'circle-radius': [
        'case',
        ['<', ['get', 'point_count'], 10], 1,
        ['<', ['get', 'point_count'], 20], 2,
        ['<', ['get', 'point_count'], 30], 3,
        ['<', ['get', 'point_count'], 40], 4,
        5,
      ],
      'circle-color': [
        'case',
        ['<', ['get', 'point_count'], 10], 'red',
        ['<', ['get', 'point_count'], 20], 'blue',
        ['<', ['get', 'point_count'], 30], 'green',
        ['<', ['get', 'point_count'], 40], 'yellow',
        'purple',
      ],
      'circle-stroke-width': 5,
      'circle-stroke-opacity': 0.4,
      'circle-stroke-color': [
        'case',
        ['<', ['get', 'point_count'], 10], 'red',
        ['<', ['get', 'point_count'], 20], 'blue',
        ['<', ['get', 'point_count'], 30], 'green',
        ['<', ['get', 'point_count'], 40], 'yellow',
        'purple',
      ],
    },
    minzoom: 0,
    maxzoom: 24,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-unclustered-0',
    source: 'layer-cluster-source-0',
    type: 'circle',
    filter: ['!', ['has', 'point_count']],
    paint: {},
    minzoom: 0,
    maxzoom: 24,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-count-0',
    source: 'layer-cluster-source-0',
    type: 'symbol',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': [
        'case',
        ['<', ['get', 'point_count'], 10], 1,
        ['<', ['get', 'point_count'], 20], 2,
        ['<', ['get', 'point_count'], 30], 3,
        ['<', ['get', 'point_count'], 40], 4,
        5,
      ],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#000000',
    },
    minzoom: 0,
    maxzoom: 24,
  });
});

it('should create cluster layers with custom paint', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    getMaxZoom: jest.fn(() => 18),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      radius: 25,
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
      font: {
        family: ['Comic Sans MS'],
        color: 'red',
      },
      paint: {
        'circle-pitch-scale': 'map',
      },
    },
    paint: {
      'circle-color': 'red',
    },
  };
  createClusterLayers({
    map,
    layer,
    index: 0,
    radius: 25,
  });

  expect(map.addSource).toHaveBeenCalledWith('layer-cluster-source-0', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom: 19,
    clusterRadius: 25,
    maxzoom: 19,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-0',
    source: 'layer-cluster-source-0',
    type: 'circle',
    filter: ['has', 'point_count'],
    paint: {
      'circle-pitch-scale': 'map',
      'circle-radius': [
        'case',
        ['<', ['get', 'point_count'], 10], 1,
        ['<', ['get', 'point_count'], 20], 2,
        ['<', ['get', 'point_count'], 30], 3,
        ['<', ['get', 'point_count'], 40], 4,
        5,
      ],
      'circle-color': [
        'case',
        ['<', ['get', 'point_count'], 10], 'red',
        ['<', ['get', 'point_count'], 20], 'blue',
        ['<', ['get', 'point_count'], 30], 'green',
        ['<', ['get', 'point_count'], 40], 'yellow',
        'purple',
      ],
      'circle-stroke-width': 5,
      'circle-stroke-opacity': 0.4,
      'circle-stroke-color': [
        'case',
        ['<', ['get', 'point_count'], 10], 'red',
        ['<', ['get', 'point_count'], 20], 'blue',
        ['<', ['get', 'point_count'], 30], 'green',
        ['<', ['get', 'point_count'], 40], 'yellow',
        'purple',
      ],
    },
    minzoom: 0,
    maxzoom: 24,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-unclustered-0',
    source: 'layer-cluster-source-0',
    type: 'circle',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': 'red',
    },
    minzoom: 0,
    maxzoom: 24,
  });

  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-count-0',
    source: 'layer-cluster-source-0',
    type: 'symbol',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Comic Sans MS'],
      'text-size': [
        'case',
        ['<', ['get', 'point_count'], 10], 1,
        ['<', ['get', 'point_count'], 20], 2,
        ['<', ['get', 'point_count'], 30], 3,
        ['<', ['get', 'point_count'], 40], 4,
        5,
      ],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': 'red',
    },
    minzoom: 0,
    maxzoom: 24,
  });
});

it('should update cluster first time with single radius', () => {
  const sourceMock = {
    setData: jest.fn(),
  };
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    getMaxZoom: jest.fn(() => 18),
    getLayer: jest.fn(() => {}),
    getSource: jest.fn(() => sourceMock),
    querySourceFeatures: jest.fn(() => []),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      radius: 25,
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };
  const onClusterUpdate = jest.fn(() => []);

  updateCluster(map, layer, onClusterUpdate);

  expect(map.getLayer).toHaveBeenCalledWith('layer-cluster-data');
  expect(map.addLayer).toHaveBeenCalledWith({
    id: 'layer-cluster-data',
    type: 'circle',
    source: 'source',
    'source-layer': 'source-layer',
    paint: {
      'circle-color': 'transparent',
    },
  });
  expect(map.getSource).toHaveBeenCalledTimes(2);
  expect(map.getSource).toHaveBeenCalledWith('layer-cluster-source-0');
  expect(sourceMock.setData).toHaveBeenCalledWith({
    type: 'FeatureCollection',
    features: [],
  });
  expect(onClusterUpdate).toHaveBeenCalledWith({
    features: [],
    source: 'source',
    sourceLayer: 'source-layer',
  });
});

it('should update cluster next time', () => {
  const layerMock = {};
  const sourceMock = {
    setData: jest.fn(),
  };
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    getMaxZoom: jest.fn(() => 18),
    // Return
    getLayer: jest.fn(() => layerMock),
    getSource: jest.fn(() => sourceMock),
    querySourceFeatures: jest.fn(() => []),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      radius: 25,
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };

  updateCluster(map, layer);

  expect(map.addLayer).not.toHaveBeenCalled();
});

it('should update cluster with many radius', () => {
  const sourcesMock = {};
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    getMaxZoom: jest.fn(() => 18),
    getLayer: jest.fn(() => ({})),
    getSource: jest.fn(source => {
      if (!sourcesMock[source]) {
        sourcesMock[source] = {
          setData: jest.fn(),
        };
        return undefined;
      }
      return sourcesMock[source];
    }),
    querySourceFeatures: jest.fn(() => []),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      radius: [{
        value: 25,
        maxzoom: 16,
      }, {
        value: 10,
        minzoom: 16,
      }],
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };
  const onClusterUpdate = jest.fn(() => []);

  updateCluster(map, layer, onClusterUpdate);

  expect(map.getSource).toHaveBeenCalledTimes(4);
  expect(map.getSource).toHaveBeenCalledWith('layer-cluster-source-0');
  expect(map.getSource).toHaveBeenCalledWith('layer-cluster-source-1');
});

it('should get clustered features', async () => {
  const featuresMock = [{}, {}];
  const sourceMock = {
    getClusterLeaves: jest.fn((id, i, k, fn) => fn(null, featuresMock)),
  };
  const map = {
    getSource: jest.fn(() => sourceMock),
  };
  const features = await getClusteredFeatures(map, {
    source: 'source',
    properties: {
      cluster: true,
      cluster_id: 1,
    },
  });
  expect(features).toBe(featuresMock);
  expect(map.getSource).toHaveBeenCalledWith('source');
  expect(sourceMock.getClusterLeaves).toHaveBeenCalled();
  expect(sourceMock.getClusterLeaves.mock.calls[0][0]).toBe(1);
  expect(sourceMock.getClusterLeaves.mock.calls[0][1]).toBe(-1);
  expect(sourceMock.getClusterLeaves.mock.calls[0][2]).toBe(0);

  const noFeature = await getClusteredFeatures(map, {
    source: 'source',
    properties: {},
  });
  expect(noFeature).toBeNull();

  const noFeatureAtAll = await getClusteredFeatures(map);
  expect(noFeatureAtAll).toBeNull();

  sourceMock.getClusterLeaves = (id, i, k, fn) => fn();
  const noFeaturesFound = await getClusteredFeatures(map, {
    source: 'source',
    properties: {
      cluster: true,
      cluster_id: 1,
    },
  });
  expect(noFeaturesFound).toBeNull();
});
