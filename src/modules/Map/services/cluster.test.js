import { getClusterSourceName, createCluster, updateCluster, getClusteredFeatures } from './cluster';

it('should get cluster source name', () => {
  expect(getClusterSourceName('foo')).toBe('foo-cluster-source');
});

it('should create a cluster layers set', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      maxZoom: 15,
      radius: 25,
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
      font: {
        color: 'white',
      },
    },
  };
  createCluster(map, layer);

  expect(map.addLayer).toHaveBeenCalledTimes(4);
  expect(map.addLayer.mock.calls[0][0]).toEqual({
    id: 'layer-cluster-data',
    type: 'circle',
    source: 'source',
    'source-layer': 'source-layer',
    paint: {
      'circle-color': 'transparent',
    },
  });
  expect(map.addLayer.mock.calls[1][0]).toEqual({
    id: 'layer',
    type: 'circle',
    source: 'layer-cluster-source',
    paint: {
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          1,
          ['<', ['get', 'point_count'], 20],
          2,
          ['<', ['get', 'point_count'], 30],
          3,
          ['<', ['get', 'point_count'], 40],
          4,
          5,
        ],
        1,
      ],
      'circle-color': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          'red',
          ['<', ['get', 'point_count'], 20],
          'blue',
          ['<', ['get', 'point_count'], 30],
          'green',
          ['<', ['get', 'point_count'], 40],
          'yellow',
          'purple',
        ],
        'red',
      ],
    },
  });
  expect(map.addLayer.mock.calls[2][0]).toEqual({
    id: 'layer-border',
    type: 'circle',
    source: 'layer-cluster-source',
    filter: ['has', 'point_count'],
    paint: {
      'circle-opacity': 0.4,
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          6,
          ['<', ['get', 'point_count'], 20],
          7,
          ['<', ['get', 'point_count'], 30],
          8,
          ['<', ['get', 'point_count'], 40],
          9,
          10,
        ],
        6,
      ],
      'circle-color': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          'red',
          ['<', ['get', 'point_count'], 20],
          'blue',
          ['<', ['get', 'point_count'], 30],
          'green',
          ['<', ['get', 'point_count'], 40],
          'yellow',
          'purple',
        ],
        'red',
      ],
    },
  });
  expect(map.addLayer.mock.calls[3][0]).toEqual({
    id: 'layer-count',
    type: 'symbol',
    source: 'layer-cluster-source',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': ['case',
        ['<', ['get', 'point_count'], 10],
        1,
        ['<', ['get', 'point_count'], 20],
        2,
        ['<', ['get', 'point_count'], 30],
        3,
        ['<', ['get', 'point_count'], 40],
        4,
        5,
      ],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': 'white',
    },
  });

  expect(map.addSource).toHaveBeenCalledTimes(1);
  expect(map.addSource).toHaveBeenCalledWith('layer-cluster-source', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom: 15,
    clusterRadius: 25,
  });
});

it('should create a cluster layers set with default values', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };
  createCluster(map, layer);

  expect(map.addLayer.mock.calls[3][0]).toEqual({
    id: 'layer-count',
    type: 'symbol',
    source: 'layer-cluster-source',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': ['case',
        ['<', ['get', 'point_count'], 10],
        1,
        ['<', ['get', 'point_count'], 20],
        2,
        ['<', ['get', 'point_count'], 30],
        3,
        ['<', ['get', 'point_count'], 40],
        4,
        5,
      ],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#000000',
    },
  });

  expect(map.addSource).toHaveBeenCalledTimes(1);
  expect(map.addSource).toHaveBeenCalledWith('layer-cluster-source', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom: 16,
    clusterRadius: 50,
  });
});

it('should update cluster', () => {
  const sourceMock = {
    setData: jest.fn(),
  };
  const map = {
    querySourceFeatures: jest.fn(() => []),
    getSource: jest.fn(() => sourceMock),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
  };

  updateCluster(map, layer);

  expect(map.querySourceFeatures).toHaveBeenCalledWith('source', {
    sourceLayer: 'source-layer',
  });
  expect(map.getSource).toHaveBeenCalledWith('layer-cluster-source');
  expect(sourceMock.setData).toHaveBeenCalledWith({
    type: 'FeatureCollection',
    features: [],
  });
});

it('should create cluster on update', () => {
  const sourceMock = {
    setData: jest.fn(),
  };
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
    querySourceFeatures: jest.fn(() => []),
    getSource: jest.fn(() => {
      if (map.getSource.mock.calls.length === 1) {
        return null;
      }
      return sourceMock;
    }),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
  };

  updateCluster(map, layer);
  expect(map.getSource).toHaveBeenCalledTimes(2);
});

it('should not get clustered features', async () => {
  const noFeature = await getClusteredFeatures({});
  expect(noFeature).toBe(null);
});

it('should get clustered features', async () => {
  const sourceMock = {
    getClusterLeaves: jest.fn((a, b, c, callback) => callback(null, [])),
  };
  const map = {
    getSource: jest.fn(() => sourceMock),
  };
  const feature = {
    source: 'source',
    properties: {
      cluster: true,
      cluster_id: 42,
    },
  };

  const features = await getClusteredFeatures(map, feature);
  expect(features).toEqual([]);
});

it('should get error while getting clustered features', async () => {
  const sourceMock = {
    getClusterLeaves: jest.fn((a, b, c, callback) => callback('sad')),
  };
  const map = {
    getSource: jest.fn(() => sourceMock),
  };
  const feature = {
    source: 'source',
    properties: {
      cluster: true,
      cluster_id: 42,
    },
  };

  let expected;
  try {
    await getClusteredFeatures(map, feature);
  } catch (e) {
    expected = e;
  }

  expect(expected).toBe('sad');
});

it('should create a cluster with paint values', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    },
    paint: {
      'circle-color': 'red',
      'circle-opacity': 0.6,
    },
  };
  createCluster(map, layer);

  expect(map.addLayer.mock.calls[1][0]).toEqual({
    id: 'layer',
    type: 'circle',
    source: 'layer-cluster-source',
    paint: {
      'circle-opacity': 0.6,
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          1,
          ['<', ['get', 'point_count'], 20],
          2,
          ['<', ['get', 'point_count'], 30],
          3,
          ['<', ['get', 'point_count'], 40],
          4,
          5,
        ],
        1,
      ],
      'circle-color': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          'red',
          ['<', ['get', 'point_count'], 20],
          'blue',
          ['<', ['get', 'point_count'], 30],
          'green',
          ['<', ['get', 'point_count'], 40],
          'yellow',
          'purple',
        ],
        ['!', ['has', 'point_count']],
        'red',
        'red',
      ],
    },
  });
});

it('should create a cluster with border', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
      border: 2,
    },
  };
  createCluster(map, layer);

  expect(map.addLayer.mock.calls[2][0]).toEqual({
    id: 'layer-border',
    type: 'circle',
    source: 'layer-cluster-source',
    filter: ['has', 'point_count'],
    paint: {
      'circle-opacity': 0.4,
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          3,
          ['<', ['get', 'point_count'], 20],
          4,
          ['<', ['get', 'point_count'], 30],
          5,
          ['<', ['get', 'point_count'], 40],
          6,
          7,
        ],
        3,
      ],
      'circle-color': [
        'case',
        ['has', 'point_count'],
        ['case',
          ['<', ['get', 'point_count'], 10],
          'red',
          ['<', ['get', 'point_count'], 20],
          'blue',
          ['<', ['get', 'point_count'], 30],
          'green',
          ['<', ['get', 'point_count'], 40],
          'yellow',
          'purple',
        ],
        'red',
      ],
    },
  });
});

it('should create a cluster with no border', () => {
  const map = {
    addLayer: jest.fn(),
    addSource: jest.fn(),
  };
  const layer = {
    id: 'layer',
    source: 'source',
    'source-layer': 'source-layer',
    cluster: {
      steps: [10, 20, 30, 40],
      sizes: [1, 2, 3, 4, 5],
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
      border: 0,
    },
  };
  createCluster(map, layer);

  expect(map.addLayer).toHaveBeenCalledTimes(3);
});
